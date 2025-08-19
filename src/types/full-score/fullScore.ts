// types/fullScore.ts

import {
    MatchDetails,
    TeamInfo,
    PlayerInfo,
    BallByBallCommentary,
    OverInfo,
    PartnershipInfo
} from '../matches';

// Simplified types for specific components
export type Player = PlayerInfo;
export type TeamData = TeamInfo;

export interface OverData extends OverInfo {
    ball?: BallByBallCommentary[];
}

export interface ScoreCardData {
    td: TeamData[];
    es: MatchDetails;
    te1n: string;
    te2n: string;
    te3n?: string;
    te4n?: string;
    team1Id: number;
    team2Id: number;
    team3Id?: number;
    team4Id?: number;
    t1s: string;
    t2s: string;
    t3s?: string;
    t4s?: string;
    cci: Record<string, {
        bat1: Player[];
        bat2: Player[];
        bow1: Player[];
        bow2: Player[];
        fow1: any[];
        fow2: any[];
    }>;
    sqt1: Player[];
    sqt2: Player[];
    t1id: number;
    t2id: number;
    t3id?: number;
    t4id?: number;
    baid: number;
    boid: number;
    prevBaid?: number;
    prevBoid?: number;
    t1jr: string;
    t2jr: string;
    t3jr?: string;
    t4jr?: string;
}

// Socket related types
export interface ProcessedMatchData {
    commentaryDetails?: MatchDetails;
    teams?: TeamData[];
    players?: Player[];
    overs?: Record<string, OverData[]>;
    partnership?: PartnershipInfo[];
    ballByBall?: BallByBallCommentary[];
}

export interface SocketEventData {
    commentaryId: string;
    // eventId: string;
    value: {
        module: string;
        type: string;
        data: any;
    }[];
}

export interface SocketResponse {
    // eventId: string;
    commentaryId: string;
    value: {
        cm?: any;
        mr?: any[];
    };
}

export interface FullScoreSocketHookResult {
    matchData: ProcessedMatchData | null;
    marketRunnerData: any[] | null;
    loading: boolean;
}

export interface UseFullScoreSocketProps {
    commentaryId: string;
    // eventId: string;
    initialData?: ProcessedMatchData;
}

// export interface LiveScoreboardProps {
//     commentaryData: {
//         cbt: Array<{
//             bati: string;
//             batn: string;
//             os: boolean;
//             trun: number;
//             tball: number;
//             t4: number;
//             t6: number;
//             str: number;
//         }>;
//         cbl: Array<{
//             bli: string;
//             pn: string;
//             tov: number;
//             mov: number;
//             trun: number;
//             twik: number;
//             eco: number;
//         }>;
//         cm: {
//             scot: string;
//             t1sn: string;
//             t2sn: string;
//             t1jr: string;
//             t2jr: string;
//         };
//         currOver: Array<{
//             ballType: string;
//             run: number;
//         }>;
//     };
// }

export interface ScoreCardDetailsProps {
    scoreCardData: ScoreCardData;
}

// types/fullScore.ts

export interface BatsmanData {
    bati: string;
    batn: string;
    os: boolean;
    trun: number;
    tball: number;
    t4: number;
    t6: number;
    str: number;
    jrsyplyimg: string;
    jrsyplyimgpath: string;
}

export interface BowlerData {
    tnb: string;
    twb: string;
    t6: string;
    t4: string;
    bli: string;
    pn: string;
    tov: number;
    mov: number;
    trun: number;
    twik: number;
    eco: number;
    jrsyplyimg: string;
    jrsyplyimgpath: string;
}

export interface OverBall {
    ballType: 'wicket' | 'boundary' | 'normal';
    run: number;
    commentaryBallByBallId: number
}

export interface MatchData {
    cm: {
        scot: string;
        t1sn: string;
        t2sn: string;
        t1jr: string;
        t2jr: string;
    };
    cbt: BatsmanData[];
    cbl: BowlerData[];
    currOver: OverBall[];
}

export interface LiveScoreboardProps {
    commentaryData: any;
    // imgBaseUrl: string;
    loading?: boolean;
}

export interface ProcessedScoreData {
    commentaryData: {
        cm: {
            scot: string;
            t1sn: string;
            t2sn: string;
            t1jr: string;
            t2jr: string;
        };
        cbt: Array<{
            bati: string;
            batn: string;
            os: boolean;
            trun: number;
            tball: number;
            t4: number;
            t6: number;
            str: number;
        }>;
        cbl: Array<{
            bli: string;
            pn: string;
            tov: number;
            mov: number;
            trun: number;
            twik: number;
            eco: number;
        }>;
        currOver: Array<{
            ballType: string;
            run: number,
            ballCount: number
        }>;
    };
}


export interface UseFullScoreDataProps {
    commentaryId: string;
    // eventId: string;
    initialData?: Partial<FullScoreState>;
}

export interface FullScoreState {
    commentaryDetails: any | null;
    currentTeamsData: TeamData[];
    currentPlayersData: Player[];
    currentBallByBallData: any[];
    currentWicketData: any[];
    currentOversData: any[];
    currentPartnershipData: any[];
    marketOddsBallByBallData: any[];
    loading: boolean;
}

