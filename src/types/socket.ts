import { Socket } from "socket.io-client";

export interface Subscription {
    commentaryId: string;
    types: Set<'match' | 'fullScore'>;
}

export interface SocketContextType {
    socket: Socket | null;
    subscribeToMatch: (commentaryId: string) => void;
    unsubscribeFromMatch: (commentaryId: string) => void;
    subscribeToFullScore: (commentaryId: string) => void;
    unsubscribeFromFullScore: (commentaryId: string) => void;
}