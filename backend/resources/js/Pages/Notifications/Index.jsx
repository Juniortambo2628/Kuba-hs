import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Bell, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotificationsIndex({ notifications }) {
    const markAsRead = (id) => {
        router.post(route('notifications.read', id), {}, { preserveScroll: true });
    };

    const markAllAsRead = () => {
        router.post(route('notifications.read-all'), {}, { preserveScroll: true });
    };

    const unreadCount = notifications.filter((n) => !n.read_at).length;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
                        Notifications
                    </h1>
                    <p className="text-sm text-stone-500">
                        Your recent activity and updates.
                    </p>
                </div>
            }
        >
            <Head title="Notifications" />

            <div className="max-w-2xl mx-auto">
                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={markAllAsRead}
                        className="mb-4 flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                    >
                        <CheckCheck className="h-4 w-4" />
                        Mark all as read
                    </button>
                )}

                <div className="space-y-3">
                    {notifications.length === 0 ? (
                        <div className="bg-white dark:bg-zinc-800/50 rounded-2xl border border-stone-100 dark:border-zinc-800 p-12 text-center">
                            <Bell className="h-12 w-12 text-stone-300 dark:text-zinc-600 mx-auto mb-4" />
                            <p className="text-stone-500 dark:text-zinc-400">No notifications yet.</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => {
                                    if (!notification.read_at) markAsRead(notification.id);
                                    if (notification.data?.url) router.visit(notification.data.url);
                                }}
                                className={cn(
                                    'bg-white dark:bg-zinc-800/50 rounded-2xl border p-5 cursor-pointer transition-all',
                                    notification.read_at
                                        ? 'border-stone-100 dark:border-zinc-800'
                                        : 'border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/30 dark:bg-indigo-900/10'
                                )}
                            >
                                <p className="text-sm text-stone-900 dark:text-white">
                                    {notification.data?.message || 'Notification'}
                                </p>
                                <p className="text-xs text-stone-500 mt-1">
                                    {new Date(notification.created_at).toLocaleString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
