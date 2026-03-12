import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

export default function NotificationDropdown() {
    const { auth } = usePage().props;
    const notifications = auth.notifications || [];
    const unreadCount = notifications.length;

    const markAsRead = (id) => {
        router.post(route('notifications.read', id), {}, {
            preserveScroll: true,
        });
    };

    const markAllAsRead = () => {
        router.post(route('notifications.read-all'), {}, {
            preserveScroll: true,
        });
    };

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button
                    type="button"
                    className="relative inline-flex items-center rounded-md p-2 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <span className="sr-only">View notifications</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    
                    {unreadCount > 0 && (
                        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content width="80" contentClasses="py-1 bg-white dark:bg-gray-700">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-600 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notifications</span>
                    {unreadCount > 0 && (
                        <button 
                            onClick={markAllAsRead}
                            className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            Mark all read
                        </button>
                    )}
                </div>

                <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div 
                                key={notification.id} 
                                className="block px-4 py-3 border-b border-gray-100 dark:border-gray-600 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition"
                                onClick={() => {
                                    markAsRead(notification.id);
                                    if(notification.data.url) router.visit(notification.data.url);
                                }}
                            >
                                <p className="text-sm text-gray-800 dark:text-gray-200">
                                    {notification.data.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(notification.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No new notifications
                        </div>
                    )}
                </div>
            </Dropdown.Content>
        </Dropdown>
    );
}
