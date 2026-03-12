/**
 * Laravel Echo (Reverb) for real-time chat.
 * Only initializes when VITE_REVERB_APP_KEY is set (e.g. after running php artisan reverb:install).
 * Requires: npm install laravel-echo pusher-js
 */
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const key = import.meta.env.VITE_REVERB_APP_KEY;
const host = import.meta.env.VITE_REVERB_HOST ?? 'localhost';
const port = import.meta.env.VITE_REVERB_PORT ?? '8080';
const scheme = (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https' ? 'https' : 'http';

if (key) {
    window.Pusher = Pusher;
    window.Echo = new Echo({
        broadcaster: 'reverb',
        key,
        wsHost: host,
        wsPort: port,
        wssPort: port,
        forceTLS: scheme === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: '/broadcasting/auth',
        auth: {
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
                Accept: 'application/json',
            },
        },
    });

    // Listen for notifications
    const userId = document.querySelector('meta[name="user-id"]')?.getAttribute('content');
    if (userId) {
        import('sonner').then(({ toast }) => {
            window.Echo.private(`App.Models.User.${userId}`)
                .notification((notification) => {
                    toast.success(notification.message || 'New notification received', {
                        description: notification.description,
                    });
                });
        });
    }
} else {
    window.Echo = null;
}
