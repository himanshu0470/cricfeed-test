import { useEffect, useState, useRef, useCallback } from 'react';
import { useSocket } from '@/lib/socket/SocketProvider';
import {
    ProcessedMatchData,
    Player,
    TeamData,
    OverData,
    FullScoreState,
    UseFullScoreDataProps
} from '@/types/full-score/fullScore';
import { FULL_SCORE_SOCKET, FULL_SCORE_SOCKET_DATA_GET } from '@/constants/socketConstants';

const initialState: FullScoreState = {
    commentaryDetails: null,
    currentTeamsData: [],
    currentPlayersData: [],
    currentBallByBallData: [],
    currentWicketData: [],
    currentOversData: [],
    currentPartnershipData: [],
    marketOddsBallByBallData: [],
    loading: false
};

export function useFullScoreData({ commentaryId, initialData = {} }: UseFullScoreDataProps) {
    const { socket, subscribeToFullScore, unsubscribeFromFullScore } = useSocket();
    const [matchData, setMatchData] = useState()
    const [fullScoreState, setFullScoreState] = useState<FullScoreState>({
        ...initialState,
        ...initialData
    });
    
    // Use commentaryId as part of the ref key to ensure proper cleanup
    const subscriptionRef = useRef<{
        commentaryId: string | null;
        isSubscribed: boolean;
    }>({
        commentaryId: null,
        isSubscribed: false
    });

    const handleModuleUpdate = useCallback((prev: FullScoreState, item: any) => {
        switch (item.module) {
            case 'commentaryDetails':
                return item.data ? {
                    ...prev,
                    commentaryDetails: item.data,
                    loading: false
                } : prev;

            case 'commentaryTeams':
                if (item.type === 'full') {
                    return { ...prev, currentTeamsData: item.data };
                }
                if (item.type === 'update') {
                    const updatedTeamsData = [...prev.currentTeamsData];
                    item.data.forEach((updatedTeam: TeamData) => {
                        const index = updatedTeamsData.findIndex(
                            team => team.commentaryTeamId === updatedTeam.commentaryTeamId
                        );
                        if (index !== -1) {
                            updatedTeamsData[index] = updatedTeam;
                        }
                    });
                    return { ...prev, currentTeamsData: updatedTeamsData };
                }
                return prev;

            case 'commentaryPlayers':
                if (item.type === 'full') {
                    return { ...prev, currentPlayersData: item.data };
                }
                if (item.type === 'update') {
                    const updatedPlayersData = [...prev.currentPlayersData];
                    item.data.forEach((updatedPlayer: Player) => {
                        const index = updatedPlayersData.findIndex(
                            player => player.commentaryPlayerId === updatedPlayer.commentaryPlayerId
                        );
                        if (index !== -1) {
                            updatedPlayersData[index] = updatedPlayer;
                        }
                    });
                    return { ...prev, currentPlayersData: updatedPlayersData };
                }
                return prev;

            case 'commentaryBallByBall':
                if (item.type === 'full') {
                    return { ...prev, currentBallByBallData: item.data };
                }
                if (item.type === 'update' || item.type === 'create') {
                    return {
                        ...prev,
                        currentBallByBallData: [...prev.currentBallByBallData, item.data]
                    };
                }
                if (item.type === 'delete') {
                    return {
                        ...prev,
                        currentBallByBallData: prev.currentBallByBallData.filter(
                            ball => ball.commentaryBallByBallId !== item.data.commentaryBallByBallId
                        )
                    };
                }
                return prev;

            case 'commentaryOvers':
                if (item.type === 'full') {
                    return { ...prev, currentOversData: item.data };
                }
                if (item.type === 'update') {
                    const updatedOversData = [...prev.currentOversData];
                    const index = updatedOversData.findIndex(
                        over => over.overId === item.data.overId
                    );
                    if (index !== -1) {
                        updatedOversData[index] = item.data;
                    }
                    return { ...prev, currentOversData: updatedOversData };
                }
                if (item.type === 'create') {
                    return {
                        ...prev,
                        currentOversData: [...prev.currentOversData, item.data]
                    };
                }
                return prev;

            case 'commentaryPartnership':
                if (item.type === 'full') {
                    return { ...prev, currentPartnershipData: item.data };
                }
                if (item.type === 'update' || item.type === 'create') {
                    return {
                        ...prev,
                        currentPartnershipData: [...prev.currentPartnershipData, item.data]
                    };
                }
                return prev;

            case 'marketOddsBallByBall':
                if (item.type === 'full' || item.type === 'create') {
                    return { ...prev, marketOddsBallByBallData: item.data };
                }
                return prev;

            default:
                return prev;
        }
    }, []);

    useEffect(() => {
        // Early returns for invalid states
        if (!socket || !commentaryId) {
            console.warn('useFullScoreData: Socket or commentaryId not available');
            return;
        }

        // Check if we're already subscribed to this commentary
        if (subscriptionRef.current.isSubscribed && 
            subscriptionRef.current.commentaryId === commentaryId) {
            // console.log('Already subscribed to commentary:', commentaryId);
            return;
        }

        const handleFullScoreUpdate = (data: any) => {
            // Only process data for the current commentary
            if (data?.commentaryId == commentaryId && data?.value) {
                // console.log('Received full score update for:', commentaryId);
                setMatchData(data?.value);
                setFullScoreState(prev => {
                    return data.value.reduce((updatedState: FullScoreState, item: any) => {
                        return handleModuleUpdate(updatedState, item);
                    }, prev);
                });
            }
        };

        // Clean up previous subscription if it exists
        if (subscriptionRef.current.isSubscribed && 
            subscriptionRef.current.commentaryId && 
            subscriptionRef.current.commentaryId !== commentaryId) {
            // console.log('Cleaning up previous subscription:', subscriptionRef.current.commentaryId);
            unsubscribeFromFullScore(subscriptionRef.current.commentaryId);
            socket.off(FULL_SCORE_SOCKET_DATA_GET, handleFullScoreUpdate);
        }

      

        // console.log('Subscribing to full score data for commentary:', commentaryId);
        
        // Subscribe to socket events
        subscribeToFullScore(commentaryId);
        socket.on(FULL_SCORE_SOCKET_DATA_GET, handleFullScoreUpdate);
        
        // Update subscription ref
        subscriptionRef.current = {
            commentaryId,
            isSubscribed: true
        };

        return () => {
            console.log('Cleaning up full score subscription for:', commentaryId);
            if (subscriptionRef.current.isSubscribed && 
                subscriptionRef.current.commentaryId === commentaryId) {
                unsubscribeFromFullScore(commentaryId);
                socket.off(FULL_SCORE_SOCKET_DATA_GET, handleFullScoreUpdate);
                subscriptionRef.current = {
                    commentaryId: null,
                    isSubscribed: false
                };
            }
        };
    }, [socket, commentaryId, subscribeToFullScore, unsubscribeFromFullScore, handleModuleUpdate]);

    const processTeamsData = useCallback((teamsData: TeamData[]) => {
        return teamsData?.sort((a, b) => b.currentInnings - a.currentInnings)
            .reduce((acc: { [key: string]: TeamData[] }, team) => {
                const key = team.currentInnings.toString();
                if (!acc[key]) acc[key] = [];
                acc[key].push(team);
                return acc;
            }, {});
    }, []);

    const processOversData = useCallback((oversData: any[]) => {
        return oversData?.reduce((acc: { [key: string]: OverData[] }, over) => {
            const key = over.teamId.toString();
            if (!acc[key]) acc[key] = [];
            acc[key].push(over);
            return acc;
        }, {});
    }, []);

    return {
        ...fullScoreState,
        processTeamsData,
        processOversData,
        matchData
    };
}