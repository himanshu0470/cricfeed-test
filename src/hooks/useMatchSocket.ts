import { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/lib/socket/SocketProvider';
import { MatchData } from '@/types/matches';

interface UseMatchSocketProps {
    commentaryId: string;
    eventId: string;
    initialData: MatchData;
}

export function useMatchSocket({ eventId, commentaryId, initialData }: UseMatchSocketProps) {
    const { socket, subscribeToMatch, unsubscribeFromMatch } = useSocket();
    const [matchData, setMatchData] = useState<MatchData>(initialData);
    const [liveTabData, setLiveTabData] = useState<any>({});
    const [matchOversData, setMatchOverData] = useState<any[]>([]);
    const [marketRunnerData, setMarketRunnerData] = useState<any[]>([]);
    const isSubscribed = useRef(false);

    useEffect(() => {
        if (!socket || !commentaryId  || isSubscribed.current) return;


        const handleMatchData = (eventDataArray: any) => {
            // console.log("eventDataArray", eventDataArray)
            // Check if it's an array and get the actual data
            const [eventType, data] = Array.isArray(eventDataArray) ? eventDataArray : [null, eventDataArray];
            if(data?.commentaryId == commentaryId){
                setLiveTabData((prevData:any) => ({
                    ...prevData,
                    ...data.value,
                }));
            }
            if (data?.commentaryId == commentaryId && data?.value?.cm) {
                setMatchData(prevData => ({
                    ...prevData,
                    ...data.value.cm,
                }));
            }
            if (data?.commentaryId == commentaryId && data?.value?.cbb) {
                setMatchOverData(prevData => ({
                    ...prevData,
                    ...data.value.cbb,
                }));
            }
        };

        const handleRunnerData = (eventDataArray: any) => {
            const [eventType, data] = Array.isArray(eventDataArray) ? eventDataArray : [null, eventDataArray];

            if (data?.commentaryId == commentaryId && data?.value?.[0]?.runners) {
                setMarketRunnerData(data.value[0].runners);
            }
        };

        // Subscribe to socket events
        subscribeToMatch(commentaryId);
        socket.on('eventData', handleMatchData);
        socket.on('eventRunnerData', handleRunnerData);
        isSubscribed.current = true;

        return () => {
            if (isSubscribed.current) {
                unsubscribeFromMatch(commentaryId);
                socket.off('eventData', handleMatchData);
                socket.off('eventRunnerData', handleRunnerData);
                isSubscribed.current = false;
            }
        };
    }, [socket, commentaryId, subscribeToMatch, unsubscribeFromMatch]);

    return { matchData, marketRunnerData, matchOversData, liveTabData };
}