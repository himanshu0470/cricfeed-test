// types/full-score/teams.ts

export interface Player {
    commentaryPlayerId: number;
    playerName: string;
    playerimage: string;
    playerType: string;
    currentInnings: number;
    isInPlayingEleven: boolean;
    ord: number;
    jerseyPlayerImage: string;
    jerseyPlayerImagePath: string;
}

export interface TeamData {
    sqt1: Player[];
    sqt2: Player[];
    t1img: string;
    nt1img?: string;
    t2img: string;
    nt2img?: string;
    t1jr: string;
    t2jr: string;
    te1n: string;
    te2n: string;
    es: {
        currentInnings: number;
    };
}

export interface LiveTeamsProps {
    teamData: TeamData;
    loading: boolean;
    // imgBaseUrl: string;
}

export interface RawTeam {
    teamId: number;
    teamName: string;
    shortName: string;
    teamBattingOrder: number | null;
    currentInnings: number;
    image: string;
    jersey: string;
    teamScore: number | null;
    teamWicket: number | null;
    teamOver: number | null;
}

export interface CommentaryPlayer {
    commentaryPlayerId: number;
    teamId: number;
    playerName: string;
    playerimage: string;
    playerType: string;
    currentInnings: number;
    isInPlayingEleven: boolean;
    displayOrder: number;
}

export interface FormattedTeamData {
    sqt1: CommentaryPlayer[];
    sqt2: CommentaryPlayer[];
    t1img: string;
    t2img: string;
    nt1img: string;
    nt2img: string;
    t1jr: string;
    t2jr: string;
    te1n: string;
    te2n: string;
    es: {
        currentInnings: number;
    };
}