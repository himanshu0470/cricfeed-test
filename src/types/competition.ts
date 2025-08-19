export type Competition = {
    competitionName: string;
    competitionId: number;
    eventTypeId: number;
    eventType: string;
    refId: string;
    image: string | null;
    isActive: boolean;
    displayOrder: number;
    isTrending: boolean;
    imagePath?: string;
};