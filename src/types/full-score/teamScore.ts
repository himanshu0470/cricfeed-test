// types/cricket-score.types.ts

export interface Runner {
    backPrice?: number;
    layPrice?: number;
    runner?: string;
}

export interface RunnerData {
    team1Runner?: Runner;
    team2Runner?: Runner;
    drawRunner?: Runner;
}

export interface MatchDetails {
    runs?: number;
    wickets?: number;
    overs?: number;
}

export interface CurrentBall {
    actualRun: number;
    ocn: string;
    isb: boolean;
    isw: boolean;
    bty: number;
}

export interface Team {
    bgColor: string;
    borderColor: string;
}

export interface ScoreData {
    t1n?: string;
    t2n?: string;
    t1im?: string;
    t2im?: string;
    t1id?: string;
    t2id?: string;
    batid?: string;
    ballid?: string;
    com?: string;
    cinn?: string;
    utc?: string;
    loc?: string;
    cst?: number;
    res?: string;
    dis?: string;
    win?: string;
    crr?: number;
    rrr?: number;
    tpp1?: string;
    tpp2?: string;
    t1MatchDetails?: MatchDetails;
    t2MatchDetails?: MatchDetails;
    t3MatchDetails?: string;
    t4MatchDetails?: string;
    t3Id?: string;
    t4Id?: string;
    tsi?: Array<{
        inning: number;
        t1s: string;
        t2s: string;
    }>;
    currOver?: {
        currentBall: CurrentBall;
    };
    scot?: string;
    t1sn?: string;
    t2sn?: string;
    battingTeam: Team;
    bowlingTeam: Team;
    t1co?: string;
    t2co?: string;
    en?: string;
    eno?: string;
    nt1im?: string;
    nt2im?: string;
}

export interface Data{
    displayStatus: string
    winnerId?: number;
    winnerName?: string;
}


export interface FullScoreContentProps {
    data: Data;
    scoreData: ScoreData;
    runnerData: RunnerData;
    inProgress: boolean;
    isChase: boolean;
}

export interface DateTimeLocal {
    localDate: string;
    localTime: string;
}

export interface TeamMatchDetails {
    runs?: number;
    wickets?: number;
    overs?: number;
}

export interface ProcessedTeam {
    id: number;
    name: string;
    image: string;
    shortName: string;
    innings: {
        score: number | null;
        overs: number | null;
        wickets: number | null;
    }[];
    crr: string | null;
    rrr: string | null;
    color: string;
    backgroundColor: string;
}

export interface InningDetails {
    score: number | null;
    wickets: number | null;
    overs: number | null;
    isSuperOver?: boolean;
}