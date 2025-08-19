//types/full-score/scorecard

import { TeamInfo } from "../matches";
import { Player, TeamData } from "./fullScore";

export interface ScoreCardPlayer {
    commentaryPlayerId: string;
    playerName: string;
    playerimage?: string;
    isInPlayingEleven?: boolean;
    ord: number;
    teamId: string;
}

export interface ScoreCardBattingData extends ScoreCardPlayer {
    batterOrder: number;
    wicketType?: string;
    batRun: number;
    batBall: number;
    batFour: number;
    batSix: number;
    batsmanStrikeRate: number;
}

export interface ScoreCardBowlingData extends ScoreCardPlayer {
    bowlerOrder: number;
    bowlerOver: string;
    bowlerMaidenOver: number;
    bowlerRun: number;
    bowlerTotalWicket: number;
    bowlerEconomy: number;
    isPlay?: boolean;
}


export interface ScoreCardInningsData {
    bat1?: ScoreCardBattingData[];
    bat2?: ScoreCardBattingData[];
    bow1?: ScoreCardBowlingData[];
    bow2?: ScoreCardBowlingData[];
    fow1?: Array<{
        teamScore: number;
        wicketCount: number;
        batterName: string;
    }>;
    fow2?: Array<{
        teamScore: number;
        wicketCount: number;
        batterName: string;
    }>;
}

export interface ScoreCardProps {
    scoreCardData: {
        commentaryDetails: any,
        commentaryTeams: any,
        commentaryPlayers: any,
        commentaryWicket: any,
    };
    // imgBaseUrl: string,
}

export interface FormattedInningsData {
    bat1: Player[];
    bat2: Player[];
    bow1: Player[];
    bow2: Player[];
    fow1: Array<{
        teamScore: number;
        wicketCount: number;
        batterName: string;
    }>;
    fow2: Array<{
        teamScore: number;
        wicketCount: number;
        batterName: string;
    }>;
}
export interface FormattedScoreCardData {
    td: TeamData[];
    sqt1: Player[];
    sqt2: Player[];
    team1Id: string;
    t1jr: string;
    t2jr: string;
    baid: string;
    boid: string;
    t1id: string;
    cci: {
        [key: string]: FormattedInningsData;
    };
    es: {
        currentInnings: number;
    };
    prevBaid?: string;
    prevBoid?: string;
}