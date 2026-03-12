import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { MessageSquare, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatIndex({ conversations }) {
    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Messages</h1>
                    <p className="text-sm text-stone-500">Chat with your service providers and customers.</p>
                </div>
            }
        >
            <Head title="Messages" />

            {conversations.length > 0 ? (
                <div className="space-y-3">
                    {conversations.map((conversation) => {
                        const otherUser = conversation.customer_id === conversation.provider?.user?.id
                            ? conversation.customer
                            : conversation.provider?.user;

                        return (
                            <Link
                                key={conversation.id}
                                href={route('chat.show', conversation.id)}
                                className={cn(
                                    "flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 group",
                                    conversation.unread_count > 0
                                        ? "bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800 shadow-sm"
                                        : "bg-white dark:bg-zinc-800/50 border-stone-100 dark:border-zinc-800 hover:shadow-lg hover:shadow-stone-200/50 dark:hover:shadow-none"
                                )}
                            >
                                {/* Avatar */}
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-indigo-500/20">
                                    {otherUser?.first_name?.[0]}{otherUser?.last_name?.[0]}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-stone-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {otherUser?.first_name} {otherUser?.last_name}
                                        </h3>
                                        <span className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatTime(conversation.last_message_at)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 font-medium mb-1">
                                        {conversation.booking?.service?.name}
                                    </p>
                                    <p className="text-sm text-stone-500 dark:text-zinc-400 truncate">
                                        {conversation.latest_message?.body || 'No messages yet'}
                                    </p>
                                </div>

                                {/* Unread Badge + Arrow */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {conversation.unread_count > 0 && (
                                        <span className="h-6 min-w-6 px-2 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                                            {conversation.unread_count}
                                        </span>
                                    )}
                                    <ChevronRight className="h-4 w-4 text-stone-300 dark:text-zinc-600 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-24 w-24 rounded-3xl bg-stone-50 dark:bg-zinc-800/50 flex items-center justify-center mb-6 shadow-inner">
                        <MessageSquare className="h-10 w-10 text-stone-300 dark:text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">
                        No conversations yet
                    </h3>
                    <p className="max-w-xs text-stone-500 dark:text-zinc-500">
                        When you book a service or receive a booking, you can start chatting here.
                    </p>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
