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
 * Singleton instance of Laravel Echo configured for Pusher Channels
 */
let echoInstance: Echo<any> | null = null;

export const getEcho = () => {
    if (typeof window === 'undefined') return null;
    
    if (!echoInstance) {
        const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
        const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;
        
        if (!key) {
            console.warn('Laravel Echo: NEXT_PUBLIC_PUSHER_APP_KEY is not defined. Real-time features (Chat/Notifications) will be disabled.');
            return null;
        }

        echoInstance = new Echo({
            broadcaster: 'pusher',
            key: key,
            cluster: cluster ?? 'mt1',
            forceTLS: true,
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
