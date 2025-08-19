// types/full-score/chart.ts

export interface TeamData {
    teamId: number;
    teamColor: string;
}

export interface Over {
    overId: number;
    teamId: number;
    currentInnings: number;
    over: number;
    totalRun: number;
    teamScore: string;
}

export interface Summary {
    team1Id: number;
    team2Id: number;
    currentInnings: number;
}

export interface ChartData {
    summery: Summary;  // keeping the misspelling as it's in the data
    oversData: Over[];
    teamsData: TeamData[];
}

export interface FormattedChartData {
    team1Data: Over[];
    team2Data: Over[];
    team3Data: Over[];
    team4Data: Over[];
    team1Color: string;
    team2Color: string;
}

export interface ChartComponentProps {
    graphData: FormattedChartData;
}