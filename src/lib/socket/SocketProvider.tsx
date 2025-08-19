import { createContext, useContext, useRef, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { CONFIG } from '@/config/config';
import { FULL_SCORE_SOCKET, MATCH_CONNECTION, RUNNER_CONNECTION } from '@/constants/socketConstants';
import { SocketContextType } from '@/types/socket';

const SocketContext = createContext<SocketContextType>({
    socket: null,
    subscribeToMatch: () => { },
    unsubscribeFromMatch: () => { },
    subscribeToFullScore: () => { },
    unsubscribeFromFullScore: () => { },
});

// Global socket instance to ensure singleton pattern
let globalSocketInstance: Socket | null = null;
let globalConnectionPromise: Promise<Socket> | null = null;

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(globalSocketInstance);
    const subscriptionsRef = useRef<Map<string, Set<'match' | 'fullScore'>>>(new Map());
    const isConnectingRef = useRef(false);

    // Helper function to emit current subscriptions
    const emitSubscriptions = (socketInstance: Socket) => {
        const matchEvents: string[] = [];
        const fullScoreEvents: string[] = [];

        subscriptionsRef.current.forEach((types, commentaryId) => {
            if (types.has('match')) matchEvents.push(commentaryId);
            if (types.has('fullScore')) fullScoreEvents.push(commentaryId);
        });

        if (matchEvents.length > 0) {
            socketInstance.emit(MATCH_CONNECTION, matchEvents);
            socketInstance.emit(RUNNER_CONNECTION, matchEvents);
        }
        if (fullScoreEvents.length > 0) {
            socketInstance.emit(FULL_SCORE_SOCKET, fullScoreEvents);
        }
    };

    const createSocketConnection = (): Promise<Socket> => {
        if (globalConnectionPromise) {
            return globalConnectionPromise;
        }

        globalConnectionPromise = new Promise((resolve, reject) => {
            // console.log('Creating new socket connection...');
            
            const socketInstance = io(CONFIG.API_BASE_URL, {
                transports: ["websocket"],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                forceNew: false, // Important: don't force new connection
            });

            socketInstance.on('connect', () => {
                // console.log('Socket connected successfully:', socketInstance.id);
                globalSocketInstance = socketInstance;
                emitSubscriptions(socketInstance);
                resolve(socketInstance);
            });

            socketInstance.on('disconnect', (reason) => {
                // console.log('Socket disconnected:', reason);
                // Don't reset globalSocketInstance here as it might reconnect
            });

            socketInstance.on('connect_error', (error) => {
                // console.error('Socket connection error:', error);
                reject(error);
            });

            // Timeout fallback
            setTimeout(() => {
                if (!socketInstance.connected) {
                    reject(new Error('Connection timeout'));
                }
            }, 10000);
        });

        return globalConnectionPromise;
    };

    useEffect(() => {
        // If we already have a connected socket, use it
        if (globalSocketInstance?.connected) {
            // console.log('Using existing socket connection:', globalSocketInstance.id);
            setSocket(globalSocketInstance);
            emitSubscriptions(globalSocketInstance);
            return;
        }

        // Prevent multiple concurrent connection attempts
        if (isConnectingRef.current) {
            // console.log('Socket connection already in progress...');
            return;
        }

        isConnectingRef.current = true;

        createSocketConnection()
            .then((socketInstance) => {
                setSocket(socketInstance);
                isConnectingRef.current = false;
            })
            .catch((error) => {
                // console.error('Failed to create socket connection:', error);
                isConnectingRef.current = false;
                globalConnectionPromise = null;
            });

        // Cleanup function
        return () => {
            // Don't close the socket here as other components might be using it
            // Only clean up local state
            // console.log('SocketProvider cleanup');
        };
    }, []); // Empty dependency array to run only once

    const subscribe = (commentaryId: string, type: 'match' | 'fullScore') => {
        if (!socket || !commentaryId) {
            // console.warn('Cannot subscribe: socket not ready or commentaryId missing');
            return;
        }

        const currentTypes = subscriptionsRef.current.get(commentaryId) || new Set();
        const wasAlreadySubscribed = currentTypes.has(type);
        
        currentTypes.add(type);
        subscriptionsRef.current.set(commentaryId, currentTypes);

        // Only emit if this is a new subscription
        if (!wasAlreadySubscribed) {
            // console.log(`Subscribing to ${type} for commentary:`, commentaryId);
            
            if (type === 'match') {
                socket.emit(MATCH_CONNECTION, [commentaryId]);
                socket.emit(RUNNER_CONNECTION, [commentaryId]);
            } else {
                socket.emit(FULL_SCORE_SOCKET, [commentaryId]);
            }
        }
    };

    const unsubscribe = (commentaryId: string, type: 'match' | 'fullScore') => {
        if (!socket || !commentaryId) return;

        const currentTypes = subscriptionsRef.current.get(commentaryId);
        if (!currentTypes || !currentTypes.has(type)) return;

        // console.log(`Unsubscribing from ${type} for commentary:`, commentaryId);
        currentTypes.delete(type);

        if (currentTypes.size === 0) {
            subscriptionsRef.current.delete(commentaryId);
        } else {
            subscriptionsRef.current.set(commentaryId, currentTypes);
        }

        // Re-emit all subscriptions to update server
        emitSubscriptions(socket);
    };

    const subscribeToMatch = (commentaryId: string) => subscribe(commentaryId, 'match');
    const unsubscribeFromMatch = (commentaryId: string) => unsubscribe(commentaryId, 'match');
    const subscribeToFullScore = (commentaryId: string) => subscribe(commentaryId, 'fullScore');
    const unsubscribeFromFullScore = (commentaryId: string) => unsubscribe(commentaryId, 'fullScore');

    return (
        <SocketContext.Provider value={{
            socket,
            subscribeToMatch,
            unsubscribeFromMatch,
            subscribeToFullScore,
            unsubscribeFromFullScore
        }}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => useContext(SocketContext);

// Utility function to manually close the global socket (useful for logout, etc.)
export const closeGlobalSocket = () => {
    if (globalSocketInstance) {
        // console.log('Closing global socket connection');
        globalSocketInstance.close();
        globalSocketInstance = null;
        globalConnectionPromise = null;
    }
};