export interface MarketRunner {
    selectionId: string | number;
    runner: string;
    backPrice: number;
    layPrice: number;
    status: string;
}
// types/market.ts

export interface RunnerBase {
    teamId?: number;
    RunnerName: string;
    LayPrice: number;
    BackPrice: number;
    LaySize?: number;
    BackSize?: number;
    SelectionId?: number;
    WinLoss?: number;
    MarketId?: string;
}

export interface MarketRunner extends RunnerBase {
    Status?: RunnerStatus;
    LastPriceTraded?: number;
    TotalMatched?: number;
    Runners?: SubRunner[];
}

export interface SessionRunner extends RunnerBase {
    PlaceValue?: number;
    MaximumLiability?: number;
    RunnerId?: number;
    MinimumStake?: number;
    MaximumStake?: number;
}

export interface SubRunner {
    RunnerId: number;
    RunnerName: string;
    HandicapValue: number;
    SortPriority: number;
}

export enum RunnerStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    CLOSED = "CLOSED"
}

// Optional: If you want to combine all runner types
export type Runner = MarketRunner | SessionRunner;

// Optional: Type guard to check runner type
export const isMarketRunner = (runner: Runner): runner is MarketRunner => {
    return (runner as MarketRunner).Status !== undefined;
};

export const isSessionRunner = (runner: Runner): runner is SessionRunner => {
    return (runner as SessionRunner).PlaceValue !== undefined;
};

// Market data interface that uses these runner types
export interface MarketData {
    id: number;
    commentaryBallByBallId: string;
    marketName: string;
    marketTypeId: string;
    data: string; // JSON string containing Runner[]
    rateSource: number;
    status?: RunnerStatus;
    marketId?: string;
    updateTime?: string;
    maxLiability?: number;
}