import { OverData } from "./fullScore";

interface Player {
    commentaryPlayerId: string;
    playerName: string;
    playerimage: string;
}

interface TeamData {
    teamId: string;
    teamName: string;
    image: string;
    jersey: string;
    currentInnings: number;
    teamStatus: number;
    teamBattingOrder: number;
}

interface Ball {
    commentaryBallByBallId: string;
    overCount: number;
    ballType: number;
    ballExtraRun: number;
    ballIsBoundry: boolean;
    ballRun: number;
    ballIsWicket: boolean;
}

interface Over {
    over: number;
    bowlerId: string;
    totalRun: number;
    totalWicket: number;
    teamScore: number | null;
    currentInnings: number;
    ball: Ball[];
}

interface OversData {
    players: Player[];
    teamsData: TeamData[];
    summery: {
        currentInnings: number;
    };
    overs: {
        [key: string]: Over[];
    };
}

export interface OversProps {
    OversData: OversData;
    loading: boolean;
    isShowClient?: boolean;
    // imgBaseUrl: string;
}