import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Send, Loader2, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatShow({ conversation, currentUserId }) {
    const [messages, setMessages] = useState(conversation.messages || []);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const pollIntervalRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Real-time: subscribe to Echo when available (Reverb/WebSocket)
    useEffect(() => {
        if (typeof window.Echo === 'undefined' || !window.Echo) return;

        const channelName = `conversation.${conversation.id}`;
        const channel = window.Echo.private(channelName);

        channel.listen('.message.sent', (e) => {
            const msg = e.message;
            if (!msg || !msg.id) return;
            setMessages(prev => {
                const exists = prev.some(m => m.id === msg.id);
                if (exists) return prev;
                return [...prev, msg];
            });
        });

        return () => {
            window.Echo.leave(channelName);
        };
    }, [conversation.id]);

    // Polling fallback for new messages (every 5s when Echo not used; 15s when Echo active to reduce load)
    const pollIntervalMs = typeof window.Echo !== 'undefined' && window.Echo ? 15000 : 5000;
    useEffect(() => {
        const pollMessages = async () => {
            try {
                const lastMessage = messages[messages.length - 1];
                const since = lastMessage?.created_at || new Date(Date.now() - 60000).toISOString();

                const response = await fetch(
                    route('chat.poll', conversation.id) + `?since=${encodeURIComponent(since)}`,
                    {
                        headers: { 'Accept': 'application/json' },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.messages && data.messages.length > 0) {
                        setMessages(prev => {
                            const existingIds = new Set(prev.map(m => m.id));
                            const newMsgs = data.messages.filter(m => !existingIds.has(m.id));
                            return newMsgs.length > 0 ? [...prev, ...newMsgs] : prev;
                        });
                    }
                }
            } catch (err) {
                // Silently fail - will retry on the next poll
            }
        };

        pollIntervalRef.current = setInterval(pollMessages, pollIntervalMs);
        return () => clearInterval(pollIntervalRef.current);
    }, [conversation.id, messages, pollIntervalMs]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        const messageText = newMessage;
        setNewMessage('');

        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const optimisticMessage = {
            id: tempId,
            conversation_id: conversation.id,
            sender_id: currentUserId,
            body: messageText,
            type: 'text',
            created_at: new Date().toISOString(),
            sender: { id: currentUserId },
            _pending: true,
        };
        setMessages(prev => [...prev, optimisticMessage]);

        try {
            const response = await fetch(route('chat.send', conversation.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ body: messageText }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => prev.map(m => m.id === tempId ? data.message : m));
            }
        } catch (err) {
            // Remove failed message
            setMessages(prev => prev.filter(m => m.id !== tempId));
            setNewMessage(messageText);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    const otherUser = conversation.customer_id === currentUserId
        ? conversation.provider?.user
        : conversation.customer;

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Group messages by date
    const groupedMessages = messages.reduce((groups, message) => {
        const dateKey = new Date(message.created_at).toDateString();
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(message);
        return groups;
    }, {});

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('chat.index')}
                        className="h-10 w-10 rounded-xl bg-stone-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 text-stone-600 dark:text-zinc-300" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
                            {otherUser?.first_name?.[0]}{otherUser?.last_name?.[0]}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-stone-900 dark:text-white">
                                {otherUser?.first_name} {otherUser?.last_name}
                            </h1>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                {conversation.booking?.service?.name}
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Chat with ${otherUser?.first_name}`} />

            <div className="flex flex-col h-[calc(100vh-220px)]">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1 scrollbar-thin scrollbar-thumb-stone-200 dark:scrollbar-thumb-zinc-700">
                    {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
                        <div key={dateKey}>
                            {/* Date Separator */}
                            <div className="flex items-center justify-center my-4">
                                <span className="px-3 py-1 bg-stone-100 dark:bg-zinc-800 rounded-full text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-wider">
                                    {formatDate(dateMessages[0].created_at)}
                                </span>
                            </div>

                            {dateMessages.map((message, idx) => {
                                const isMine = message.sender_id === currentUserId;
                                return (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex mb-2",
                                            isMine ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm",
                                                isMine
                                                    ? "bg-indigo-600 text-white rounded-br-md"
                                                    : "bg-white dark:bg-zinc-800 text-stone-900 dark:text-white border border-stone-100 dark:border-zinc-700 rounded-bl-md",
                                                message._pending && "opacity-70"
                                            )}
                                        >
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                {message.body}
                                            </p>
                                            <div className={cn(
                                                "flex items-center gap-1 mt-1",
                                                isMine ? "justify-end" : "justify-start"
                                            )}>
                                                <span className={cn(
                                                    "text-[10px]",
                                                    isMine ? "text-indigo-200" : "text-stone-400 dark:text-zinc-500"
                                                )}>
                                                    {formatTime(message.created_at)}
                                                </span>
                                                {isMine && message.read_at && (
                                                    <CheckCheck className="h-3 w-3 text-indigo-200" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-stone-100 dark:border-zinc-800 p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
                    <form onSubmit={handleSend} className="flex items-center gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-5 py-3 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || sending}
                            className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center transition-all active:scale-95",
                                newMessage.trim() && !sending
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
                                    : "bg-stone-100 dark:bg-zinc-800 text-stone-400 dark:text-zinc-600 cursor-not-allowed"
                            )}
                        >
                            {sending ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Send className="h-5 w-5" />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
