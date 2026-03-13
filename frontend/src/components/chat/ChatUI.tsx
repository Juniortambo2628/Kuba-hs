"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { 
  Send, 
  User, 
  Clock, 
  Check, 
  CheckCheck,
  Loader2,
  Paperclip,
  Smile,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { format } from "date-fns";

import { getEcho } from "@/lib/echo";

interface Message {
    id: string | number;
    body: string;
    sender_id: number;
    sender: {
        name: string;
        profile_photo_url?: string;
    };
    created_at: string;
    read_at?: string;
}

interface Conversation {
    id: string | number;
    booking_id: number;
    customer_id: number;
    provider_id: number;
    messages: Message[];
    booking?: {
        provider?: {
            business_name: string;
        };
    };
}

interface ChatUIProps {
    bookingId: number;
    onClose?: () => void;
}

export function ChatUI({ bookingId, onClose }: ChatUIProps) {
    const { user } = useAuth();
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchConversation();
        
        const echo = getEcho();
        if (echo) {
            const channel = echo.private(`conversation.${bookingId}`)
                .listen('.message.sent', (data: { message: Message }) => {
                    setMessages(prev => [...prev, data.message]);
                    markRead();
                });
            return () => channel.stopListening('.message.sent');
        }
    }, [bookingId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchConversation = async () => {
        try {
            const res = await axiosInstance.get(`/api/chat/conversations/${bookingId}`);
            setConversation(res.data);
            setMessages(res.data.messages || []);
            markRead();
        } catch (err) {
            console.error("Failed to fetch conversation:", err);
            toast.error("Could not load chat");
        } finally {
            setIsLoading(false);
        }
    };

    const markRead = async () => {
        if (!conversation) return;
        try {
            await axiosInstance.patch(`/api/chat/conversations/${conversation.id}/read`);
        } catch (err) {
            console.error("Failed to mark read:", err);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversation || isSending) return;

        setIsSending(true);
        try {
            const res = await axiosInstance.post("/api/chat/messages", {
                conversation_id: conversation.id,
                body: newMessage
            });
            setMessages(prev => [...prev, res.data]);
            setNewMessage("");
        } catch (err) {
            toast.error("Message failed to send");
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-[600px] items-center justify-center space-y-4 bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-white/5 shadow-2xl">
                <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Opening Secure Channel...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-[#F8FAFC] dark:bg-white/5 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="w-12 h-12 border-2 border-white dark:border-zinc-900 shadow-sm">
                            <AvatarFallback className="bg-sky-100 text-sky-600 font-bold">
                                {conversation?.booking?.provider?.business_name?.[0] || 'CH'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full shadow-sm"></div>
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-[#1E293B] dark:text-white uppercase tracking-tight">
                            {conversation?.booking?.provider?.business_name || "Support Chat"}
                        </h3>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-emerald-500"></div> Online
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#1E293B] dark:hover:text-white rounded-xl">
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide" ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                        <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-full text-gray-300">
                            <Smile className="w-10 h-10" />
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Start a premium conversation</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.sender_id === user?.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-3`}>
                                {!isMe && (
                                    <Avatar className="w-8 h-8 mb-1 border border-gray-100 dark:border-white/5">
                                        <AvatarFallback className="text-[10px] bg-sky-50 text-sky-600 font-black">
                                            {msg.sender.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div className="space-y-1.5 max-w-[75%]">
                                    <div className={`p-4 rounded-3xl text-sm font-medium shadow-sm transition-all duration-300 ${
                                        isMe 
                                        ? "bg-sky-600 text-white rounded-br-none hover:bg-sky-700" 
                                        : "bg-[#F8FAFC] dark:bg-white/5 text-[#1E293B] dark:text-gray-300 rounded-bl-none hover:bg-gray-100 dark:hover:bg-white/10"
                                    }`}>
                                        {msg.body}
                                    </div>
                                    <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${isMe ? "justify-end text-sky-400" : "text-gray-400"}`}>
                                        <span>{format(new Date(msg.created_at), 'p')}</span>
                                        {isMe && (
                                            msg.read_at ? <CheckCheck className="w-3 h-3 text-sky-400" /> : <Check className="w-3 h-3" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-[#F8FAFC] dark:bg-white/5 border-t border-gray-100 dark:border-white/5">
                <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                    <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-sky-600 rounded-xl shrink-0">
                        <Paperclip className="w-5 h-5" />
                    </Button>
                    <div className="relative flex-1">
                        <Input 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="h-14 bg-white dark:bg-zinc-900 border-none rounded-2xl px-6 font-bold shadow-sm focus-visible:ring-sky-600 focus-visible:ring-offset-0 transition-all"
                        />
                    </div>
                    <Button 
                        type="submit" 
                        disabled={!newMessage.trim() || isSending}
                        className="h-14 w-14 bg-sky-600 hover:bg-sky-700 hover:scale-110 text-white rounded-2xl shadow-xl shadow-sky-100 transition-all duration-300 shrink-0"
                    >
                        {isSending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}
