import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axiosInstance from './axios';

declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

if (typeof window !== 'undefined') {
    window.Pusher = Pusher;
}

/**
 * Singleton instance of Laravel Echo configured for Reverb
 */
let echoInstance: Echo<any> | null = null;

export const getEcho = () => {
    if (typeof window === 'undefined') return null;
    
    if (!echoInstance) {
        const key = process.env.NEXT_PUBLIC_REVERB_APP_KEY;
        
        if (!key) {
            console.warn('Laravel Echo: NEXT_PUBLIC_REVERB_APP_KEY is not defined. Real-time features (Chat/Notifications) will be disabled.');
            return null;
        }

        echoInstance = new Echo({
            broadcaster: 'reverb',
            key: key,
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
            wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
            wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
            forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
            authorizer: (channel: any, options: any) => {
                return {
                    authorize: (socketId: string, callback: Function) => {
                        axiosInstance.post('/api/broadcasting/auth', {
                            socket_id: socketId,
                            channel_name: channel.name
                        })
                        .then(response => {
                            callback(false, response.data);
                        })
                        .catch(error => {
                            callback(true, error);
                        });
                    }
                };
            },
        });
    }

    return echoInstance;
};
