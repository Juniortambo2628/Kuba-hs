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
 * Singleton instance of Laravel Echo configured for Reverb (Pusher protocol)
 */
let echoInstance: Echo<any> | null = null;

export const getEcho = () => {
    if (typeof window === 'undefined') return null;
    
    if (!echoInstance) {
        const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
        const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;

        const reverbHost = process.env.NEXT_PUBLIC_REVERB_HOST;
        const reverbPort = process.env.NEXT_PUBLIC_REVERB_PORT;
        const reverbScheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || 'https';

        // Prefer Reverb config if available, fall back to Pusher config
        const useReverb = !!reverbHost;
        const effectiveKey = useReverb ? process.env.NEXT_PUBLIC_REVERB_APP_KEY || key : key;
        
        if (!effectiveKey) {
            console.warn('Laravel Echo: No broadcasting key defined (NEXT_PUBLIC_REVERB_APP_KEY or NEXT_PUBLIC_PUSHER_APP_KEY). Real-time features (Chat/Notifications) will be disabled.');
            return null;
        }

        echoInstance = new Echo({
            broadcaster: 'pusher',
            key: effectiveKey,
            cluster: cluster ?? 'mt1',
            wsHost: useReverb ? reverbHost : undefined,
            wsPort: useReverb && reverbPort ? parseInt(reverbPort) : undefined,
            wssPort: useReverb && reverbPort ? parseInt(reverbPort) : undefined,
            forceTLS: !useReverb,
            enabledTransports: useReverb ? ['ws', 'wss'] : undefined,
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
