// types/full-score/commentary.ts

// Add this interface for commentary players
export interface CommentaryPlayer {
    commentaryPlayerId: number;
    playerName: string;
    playerimage: string;
}

// Add/update this interface for commentary teams
export interface CommentaryTeam {
    teamId: number;
    teamName: string;
    image: string;
    nimage?: string;
    jersey?: string;  // Add if needed
    commentaryTeamId?: number;  // Add if needed
    teamBattingOrder?: number | null;  // Add if needed
    currentInnings?: number | null;  // Add if needed
    status?: number | null;  // Add if needed
}

// Update your existing CommentaryProps to use CommentaryPlayer type
export interface CommentaryProps {
    commentaryOverData: {
        td: {
            commentaryTeamId: number;
            teamId: number;
            jersey?: string;
            teamBattingOrder: number | null;
            currentInnings: number;
        }[];
        t1id: number;
        t3id: number;
        team1Id: number;  // Add if needed
        team2Id: number;  // Add if needed
        sqt1: CommentaryPlayer[];  // Now properly typed
        sqt2: CommentaryPlayer[];  // Now properly typed
        teamsData: CommentaryTeam[];
        ov: Over[];
        marketData?: MarketData[];
    };
    loading: boolean;
    isShowClient: boolean;
}

// Optional: Add a type for the router
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Update BallDetailsProps to use the proper router type
export interface BallDetailsProps {
    ball: Ball;
    previousBall: Ball | null;
    bowler: string;
    batsman: string;
    isShowClient: boolean;
    token: string;
    marketData: BaseMarketData[];
    team1Id: number;
    team2Id: number;
    router: AppRouterInstance;  // Updated router type
}

// Rest of your existing interfaces remain the same
export interface Ball {
    commentaryBallByBallId: number;
    ballType: number;
    ballRun: number;
    ballIsBoundry: boolean;
    ballIsWicket: boolean;
    overCount: string;
    ballExtraRun: number;
    createdDate: string;
    batStrikeId: number;  // Add if needed
}

export interface Over {
    over: number;
    totalRun: number;
    totalWicket: number;
    teamScore: string;
    ball?: Ball[];
    bowlerId: number;
    teamId: number;
    currentInnings: number;
    overId?: number;  // Add if needed
}

// BaseMarketData and MarketData remain the same
export interface BaseMarketData {
    commentaryBallByBallId: number;
    marketName: string;
    marketTypeId: string;
    data: string;
    rateSource: number;
    commentaryId: string;
    eventMarketId: number;
    id: number;
    marketStatus: number;
}

export interface MarketData extends BaseMarketData {
    id: number;
    status?: string;
    marketId?: string;
    updateTime?: string;
    maxLiability?: number;
}

export interface CommentaryOverData {
    td: {
        commentaryTeamId: number;
        teamId: number;
        jersey?: string;
        teamBattingOrder: number | null;
        currentInnings: number;
        status: number,
        order: number
    }[];
    t1id: number;
    t3id: number;
    team1Id: number;
    team2Id: number;
    sqt1: CommentaryPlayer[];
    sqt2: CommentaryPlayer[];
    teamsData: CommentaryTeam[];
    ov: Over[];
    marketData?: BaseMarketData[];
}

// Then define the props interface for the component
export interface CommentaryTabProps {
    commentaryOverData: CommentaryOverData;
    isShowClient: boolean;
    // imgBaseUrl: string;
}