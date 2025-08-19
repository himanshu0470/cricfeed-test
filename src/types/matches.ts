// types/matches.ts
export interface MatchData {
    rno: number;
    eid: string;
    ety: string;
    mtyp: string;
    com: string;
    compId: number;
    ci: number;
    cid: string;
    en: string;
    ed: string;
    et: string;
    utc: string;
    twonby: string;
    choseto: string;
    te1n: string;
    te2n: string;
    s1n: string;
    s2n: string;
    te1i: string;
    te2i: string;
    t1jr: string;
    scov: string;
    t2jr: string;
    loc: string;
    isrun: boolean;
    t1s: string;
    t2s: string;
    dis: string;
    rmk: string;
    te1crr: string | number;
    te2crr: string | number;
    te1rrr: string | number;
    te2rrr: string | number;
    crr: string | number;
    rrr: string | number;
    cst: number;
    res: string;
    tsi: any[];
    t1bg: string;
    t2bg: string;
    t1co: string;
    t2co: string;
    batid: number;
    ballid: number;
    t1id: number;
    t2id: number;
    isPr: boolean;
    ics: boolean;
    t1n: string;
    t2n: string;
    nte1i?: string;
    nte2i?: string;
}

export interface MatchResponse {
    scheduleMatches: MatchData[];
    liveMatches: MatchData[];
}

export interface LiveScheduleMatchesResponse {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    data: MatchData[];
}

export interface CompletedMatchesResponse {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    data: MatchData[];
    total: number;
}

// Match Details
export interface MatchDetails {
    commentaryId: string;
    matchTypeId: number;
    matchType: string;
    eventTypeId: number;
    team1Id: number;
    team2Id: number;
    team1Name: string;
    team2Name: string;
    competitionId: number;
    competition: string;
    eventId: number;
    eventDate: string;
    eventName: string;
    eventRefId: string;
    location: string;
    weather: number;
    pitch: number;
    homeSideTeam: null | string;
    tossWonBy: number;
    choseTo: number;
    winnerId: null | number;
    winnerName: null | string;
    isClientShow: boolean;
    displayStatus: string;
    rmk: null | string;
    commentaryUserId: null | number;
    commentaryStatus: number;
    updateTime: null | string;
    isMatchDraw: null | boolean;
    target: null | number;
    marketId: null | string;
    tpId: null | number;
    isSignalROn: boolean;
    isMatchTypeUpdated: boolean;
    currentInnings: number;
    systemPlayerCount: null | number;
    isPlayersShow: boolean;
    isPredictMarket: boolean;
    isActive: boolean;
    isTeamPredictionOn: boolean;
    createdBy: string;
    lineRatio: number;
    delay: number;
    historyMatchTypeId: number;
    callPrediction: Record<string, any>;
    commentaryCloseTime: null | string;
    result: string;
}

// Team Information
export interface TeamInfo {
    commentaryTeamId: number;
    commentaryId: string;
    teamId: number;
    shortName: string;
    teamName: string;
    teamCaptain: number;
    teamKipper: number;
    teamScore: number | null;
    teamOver: number | null;
    teamWicket: number | null;
    crr: string | null;
    rrr: string | null;
    teamStatus: number;
    teamTrialRuns: number;
    teamLeadRuns: number;
    teamWideRuns: number;
    teamByRuns: number;
    teamLegByRuns: number;
    teamNoBallRuns: number;
    teamPenaltyRuns: number;
    isWin: null | boolean;
    teamBattingOrder: number;
    currentInnings: number;
    isBattingComplete: boolean;
    commentaryPlayerTeamCaptain: number;
    commentaryPlayerTeamKipper: number;
    teamColor: string;
    backgroundColor: string;
    teamMaxOver: number;
    isSuperOver: null | boolean;
    teamPredictionPercentage: number | null;
    image: string;
    jersey: string;
}

// Player Information
export interface PlayerInfo {
    commentaryPlayerId: number;
    commentaryId: string;
    teamId: number;
    playerId: number;
    playerName: string;
    displayOrder: number;
    batStatus: null | string;
    batRun: number | null;
    batBall: number | null;
    batDotBall: number | null;
    batFour: number | null;
    batSix: number | null;
    batSrr: null | number;
    battingOrder: null | number;
    isPlay: null | boolean;
    onStrike: null | boolean;
    wicketType: number | null;
    bowlerId: number | null;
    fielderId1: number | null;
    fielderId2: number | null;
    bowlerOver: string | null;
    bowlerCurrentBall: null | number;
    bowlerTotalBall: number | null;
    bowlerRun: number | null;
    bowlerDotBall: number | null;
    bowlerMaidenOver: number | null;
    bowlerFour: number | null;
    bowlerSix: number | null;
    bowlerWideBall: number | null;
    bowlerNoBall: number | null;
    bowlerByeBall: number | null;
    bowlerLegByeBall: number | null;
    bowlerWideBallRun: number | null;
    bowlerNoBallRun: number | null;
    bowlerByeBallRun: number | null;
    bowlerLegByeBallRun: number | null;
    bowlerTotalWicket: number | null;
    bowlerEconomy: string | null;
    bowlerOnStrike: null | boolean;
    bowlerPeneltyRun: null | number;
    isBatterOut: null | boolean;
    isBatterRetir: null | boolean;
    swapName: null | string;
    batsmanAverage: string;
    batsmanStrikeRate: string | null;
    bowlerAverage: string;
    currentInnings: number;
    batterOrder: number | null;
    bowlerOrder: number | null;
    batsmanPreviousStrikeRate: string;
    bowlerPreviousEconomy: string;
    isInPlayingEleven: boolean;
    boundary: number;
    playerimage: string;
    playerType: string;
    isKipper: boolean;
}

// Ball by Ball Commentary
export interface BallByBallCommentary {
    overId: number;
    teamId: number;
    ballRun: number;
    ballSix: number;
    ballFour: number;
    ballType: number;
    bowlerId: number;
    isDelete: boolean;
    ballIsDot: boolean;
    overCount: string;
    ballIsCount: boolean;
    batStrikeId: number;
    createdDate: string;
    ballBowlerId: number;
    ballExtraRun: number;
    ballIsWicket: boolean;
    ballPlayerId: number;
    commentaryId: string;
    overIsMaiden: boolean;
    ballIsBoundry: boolean;
    ballFielderId1: number;
    ballFielderId2: number;
    ballWicketType: number;
    batNonStrikeId: number;
    currentInnings: number;
    nextBatStrikeId: number;
    currentOverBalls: number;
    nextBatNonStrikeId: number;
    autoStrikeBallCount: number | null;
    commentaryBallByBallId: number;
}

// Wicket Information
export interface WicketInfo {
    overId: number;
    teamId: number;
    batterId: number;
    bowlerId: number;
    isDelete: boolean;
    ballCount: number;
    overCount: number;
    playerRun: number;
    teamScore: number;
    batterName: string;
    bowlerName: string;
    wicketType: number;
    createdDate: string;
    playerBalls: number;
    wicketCount: number;
    commentaryId: string;
    fieldPlayerId: number;
    currentInnings: number;
    fieldPlayerName: string;
    commentaryWicketId: number;
    commentaryBallByBallId: number;
}

// Over Information
export interface OverInfo {
    date: string;
    over: number;
    overId: number;
    teamId: number;
    dotBall: number;
    bowlerId: number;
    isMaiden: boolean;
    totalRun: number;
    totalSix: number;
    ballCount: number;
    teamScore: string | null;
    totalFour: number;
    isComplete: boolean;
    isPowerPlay: null | boolean;
    totalNoball: number;
    totalWicket: number;
    commentaryId: string;
    totalByesRun: number;
    totalPanelty: number;
    totalWideRun: number;
    powerPlayName: null | string;
    powerplayType: number;
    totalWideBall: number;
    currentInnings: number;
    totalNoBallRun: number;
    totalLegByesRun: number;
    isOverInPowerplay: boolean;
    totalByesBall?: number;
}

// Partnership Information
export interface PartnershipInfo {
    p1Run: null | number;
    p2Run: null | number;
    extras: number;
    p1Ball: null | number;
    p2Ball: null | number;
    teamId: number;
    totalSix: null | number;
    batter1Id: number | null;
    batter2Id: number | null;
    totalFour: null | number;
    totalRuns: number;
    totalWide: null | number;
    totalBalls: number;
    totalExtra: null | number;
    batter1Name: string | null;
    batter1Runs: null | number;
    batter2Name: string | null;
    batter2Runs: null | number;
    createdDate: string;
    totalNoBall: null | number;
    batter1Balls: null | number;
    batter2Balls: null | number;
    commentaryId: string;
    currentInnings: number;
    commentaryBallByBallId: number;
    commentaryPartnershipId: number;
    player1image?: string;
    player2image?: string;
}

// Market Odds
export interface MarketOdds {
    id: number;
    commentaryId: string;
    commentaryBallByBallId: number;
    eventMarketId: number;
    marketStatus: number;
    marketName: string;
    data: string;
    dateTime: string;
    rateSource: number;
    marketTypeId: string;
}

// Module Data Types
export interface ModuleData {
    date: string;
    type: string;
    module: string;
    data: MatchDetails | TeamInfo[] | PlayerInfo[] | BallByBallCommentary[] | WicketInfo[] | OverInfo[] | PartnershipInfo[] | MarketOdds[];
}

// Main Response Interface
export interface ApiResponse {
    success: boolean;
    status: number;
    result: {
        commentaryId: string;
        eventId: string;
        value: ModuleData[];
    };
    title: string;
    message: string;
}