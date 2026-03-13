import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axiosInstance from './axios';

// @ts-ignore
if (typeof window !== 'undefined') {
    window.Pusher = Pusher;
}

/**
 * Singleton instance of Laravel Echo configured for Reverb
 */
let echoInstance: Echo | null = null;

export const getEcho = () => {
    if (typeof window === 'undefined') return null;
    
    if (!echoInstance) {
        echoInstance = new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
            wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080,
            wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080,
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
