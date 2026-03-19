"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { getEcho } from "@/lib/echo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageSquare, Clock, ShieldCheck, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { User, Message, Conversation } from "@/types";

const getAvatarUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${baseUrl}/storage/${path.replace('storage/', '')}`;
};

export function ChatInterface({ role }: { role: "client" | "provider" }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const echo = getEcho();

  // Load conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await axiosInstance.get("/api/chat/conversations");
      setConversations(res.data.conversations);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load conversations");
    } finally {
      setIsLoadingConversations(false);
    }
  };

  // Load messages when conversation is opened
  useEffect(() => {
    if (!activeConversationId) return;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const res = await axiosInstance.get(`/api/chat/conversations/${activeConversationId}`);
        setMessages(res.data.conversation.messages || []);
        
        // Mark as read in the conversation list to update UI
        setConversations(prev => prev.map(c => 
          c.id === activeConversationId ? { ...c, unread_count: 0 } : c
        ));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load messages");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();

    // Subscribe to Laravel Echo Reverb WebSockets
    if (echo) {
      const channel = echo.private(`conversation.${activeConversationId}`);
      
      channel.listen('.message.sent', (e: any) => {
        if (e.message && e.message.sender_id !== user?.id) {
            setMessages(prev => {
                if (prev.find(m => m.id === e.message.id)) return prev;
                return [...prev, e.message];
            });
        }
      });

      channel.listen('.message.read', (e: any) => {
          setMessages(prev => prev.map(m => 
            e.message_ids.includes(m.id) ? { ...m, read_at: new Date().toISOString() } : m
          ));
      });

      return () => {
        channel.stopListening('.message.sent');
        channel.stopListening('.message.read');
        echo.leave(`conversation.${activeConversationId}`);
      };
    }
  }, [activeConversationId, echo]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversationId || !newMessage.trim()) return;

    const body = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    try {
      const res = await axiosInstance.post(`/api/chat/conversations/${activeConversationId}/messages`, {
        body
      });
      // Add the new message to state immediately for responsiveness
      const sentMsg = res.data;
      setMessages(prev => {
        if (prev.find(m => m.id === sentMsg.id)) return prev;
        return [...prev, sentMsg];
      });
      
      // Update last message in sidebar
      setConversations(prev => prev.map(c => 
        c.id === activeConversationId 
        ? { ...c, latestMessage: sentMsg, last_message_at: sentMsg.created_at } 
        : c
      ).sort((a,b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()));
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
      setNewMessage(body); // restore input if failed
    } finally {
      setIsSending(false);
    }
  };

  const getPartnerInfo = (conv: Conversation) => {
    if (role === 'client') {
       return {
          name: `${conv.provider.user.first_name} ${conv.provider.user.last_name}`,
          avatar: getAvatarUrl(conv.provider.user.avatar_url),
          roleLabel: 'Provider'
       };
    } else {
       return {
          name: `${conv.customer.first_name} ${conv.customer.last_name}`,
          avatar: getAvatarUrl(conv.customer.avatar_url),
          roleLabel: 'Client'
       };
    }
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-2xl overflow-hidden border border-border bg-card/50 backdrop-blur-md shadow-sm font-sans relative z-10 w-full mb-8">
      
      {/* Sidebar - Conversations List */}
      <div className={`w-full md:w-[320px] border-r border-border flex flex-col bg-muted/30 ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-border bg-transparent">
          <h2 className="text-lg font-bold text-foreground tracking-tight">Messages</h2>
        </div>
        
        <ScrollArea className="flex-1">
          {isLoadingConversations ? (
             <div className="p-6 text-center text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p className="text-xs font-bold tracking-widest">Loading Chats...</p>
             </div>
          ) : conversations.length === 0 ? (
             <div className="p-8 text-center text-gray-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No conversations yet.</p>
                <p className="text-[10px] font-black tracking-widest mt-2">{role === 'client' ? 'Book a service to start chatting' : 'Clients will message you here'}</p>
             </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversations.map(conv => {
                const partner = getPartnerInfo(conv);
                const isActive = activeConversationId === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full text-left p-4 hover:bg-muted/50 transition-all flex items-start gap-4 relative border-b border-border/50
                      ${isActive ? 'bg-muted/80 shadow-inner' : ''}
                    `}
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border overflow-hidden group-hover:scale-105 transition-transform">
                       {partner.avatar ? (
                           <img src={partner.avatar} alt={partner.name} className="w-full h-full object-cover" />
                       ) : (
                           <span className="text-muted-foreground font-bold text-xs tracking-tighter">{partner.name.substring(0,2).toUpperCase()}</span>
                       )}
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <p className="font-bold text-xs text-foreground truncate tracking-tight">{partner.name}</p>
                        {conv.latestMessage && (
                           <span className="text-[8px] font-bold text-muted-foreground whitespace-nowrap ml-2 uppercase">
                             {format(new Date(conv.latestMessage.created_at), 'MMM d')}
                           </span>
                        )}
                      </div>
                      <p className="text-[9px] text-primary font-bold mb-1 truncate tracking-wide">{conv.booking?.service?.name}</p>
                      <p className={`text-[10px] truncate ${conv.unread_count > 0 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                         {conv.latestMessage?.body || "Start conversation"}
                      </p>
                    </div>
                    {conv.unread_count > 0 && (
                        <div className="w-4 h-4 rounded-full bg-primary text-white text-[8px] font-bold flex items-center justify-center absolute right-4 top-1/2 -translate-y-1/2 shadow-sm uppercase">
                            {conv.unread_count}
                        </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-transparent ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        {!activeConversationId ? (
           <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
               <MessageSquare className="w-12 h-12 mb-4 opacity-10" />
               <h3 className="text-sm font-bold text-muted-foreground tracking-[0.2em]">Access Encryption Secure</h3>
           </div>
        ) : (
           <>
              {/* Chat Header */}
              <div className="h-20 border-b border-border flex items-center px-8 justify-between bg-transparent shrink-0">
                  {activeConversation && (
                    <div className="flex items-center gap-4">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => setActiveConversationId(null)}
                         className="md:hidden mr-2 h-10 w-10 rounded-xl"
                       >
                           &larr;
                       </Button>
                       <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border overflow-hidden">
                           {getPartnerInfo(activeConversation).avatar ? (
                               <img src={getPartnerInfo(activeConversation).avatar!} alt="" className="w-full h-full object-cover" />
                           ) : (
                               <span className="text-muted-foreground font-bold text-xs">{getPartnerInfo(activeConversation).name.substring(0,2).toUpperCase()}</span>
                           )}
                       </div>
                       <div className="space-y-0.5">
                          <h3 className="font-bold text-sm text-foreground tracking-tight">{getPartnerInfo(activeConversation).name}</h3>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                             <ShieldCheck className="w-3 h-3 text-primary" /> {getPartnerInfo(activeConversation).roleLabel} — SECURE CHANNEL
                          </p>
                       </div>
                    </div>
                  )}
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 bg-muted/5 scrollbar-hide" ref={scrollRef}>
                 {isLoadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                       <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                 ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-30">
                       <p className="text-xs font-bold uppercase tracking-widest">Initialization Complete</p>
                       <p className="text-[9px] font-bold tracking-widest mt-2">Channel ready for data transmission.</p>
                    </div>
                 ) : (
                    <div className="space-y-6">
                       {messages.map((msg, i) => {
                          const isMe = String(msg.sender_id) === String(user?.id);
                          return (
                             <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${isMe ? 'ml-auto' : 'mr-auto'}`}>
                                <div className={`px-5 py-3.5 shadow-sm text-[13px] font-medium leading-relaxed
                                  ${isMe ? 'bg-primary text-white rounded-2xl rounded-tr-none' : 'bg-card border border-border text-foreground rounded-2xl rounded-tl-none'}
                                `}>
                                   <p className="whitespace-pre-wrap">{msg.body}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-2 px-1">
                                   <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                                      {format(new Date(msg.created_at), 'h:mm a')}
                                   </span>
                                   {isMe && (
                                       msg.read_at ? (
                                           <CheckCheck className="w-3.5 h-3.5 text-primary" />
                                       ) : (
                                           <CheckCheck className="w-3.5 h-3.5 text-muted-foreground/30" />
                                       )
                                   )}
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 )}
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-border bg-transparent">
                 <form onSubmit={handleSendMessage} className="flex gap-4">
                    <input 
                       value={newMessage}
                       onChange={e => setNewMessage(e.target.value)}
                       placeholder="Dispatch secure message..."
                       className="flex-1 bg-muted/50 border border-border rounded-xl h-12 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-[11px] outline-none text-foreground placeholder:text-muted-foreground/50"
                    />
                    <Button 
                       type="submit" 
                       disabled={isSending || !newMessage.trim()}
                       className="bg-foreground text-background hover:bg-muted hover:text-foreground w-12 h-12 rounded-xl shrink-0 p-0 transition-all shadow-md"
                    >
                       {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                 </form>
              </div>
           </>
        )}
      </div>
    </div>
  );
}
