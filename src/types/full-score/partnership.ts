// types/full-score/partnership.ts

export interface Partnership {
    teamId: number;
    commentaryTeamId: number;
    currentInnings: number;
    batter1Name: string;
    batter2Name: string;
    totalRuns: number;
    totalBalls: number;
    player1image: string;
    player2image: string;
    totalSix: number;
    totalFour: number;
    batter1Balls: number;
    batter2Balls: number;
    batter1Runs: number;
    batter2Runs: number;
}

export interface TeamData {
    teamId: number;
    commentaryTeamId: number;
    teamName: string;
    image: string;
    nimage?: string;
    jersey: string;
    currentInnings: number;
    par: Partnership[];
    teamStatus: number;
}

export interface PartnershipTabProps {
    partnershipData: TeamData[];
    loading?: boolean;
    // imgBaseUrl: string;
}