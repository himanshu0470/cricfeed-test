import { MatchData } from "./matches";

export interface MatchCardProps {
    match: MatchData;
    type: 'Live' | 'Result' | 'Upcoming';
    removeCard?: (eid: string) => void;
}

export interface MatchDetails {
    runs?: number;
    wickets?: number;
    overs?: string;
}

export interface MarketRunner {
    teamName: string;
    backPrice?: number;
    layPrice?: number;
}
export interface MatchInfoCardProps {
    isSidebar?: boolean;
    match: MatchData;
    index: number;
    groupedMatchesLength: number;
    showResult?: boolean;
    showLocation?: boolean;
    timeTextSize?: 'xs' | 'sm';
    pages?: any;
    linkURL?: string;
}