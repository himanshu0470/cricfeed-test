export type Banner = {
    bannerId: number;
    bannerType: number;
    title: string;
    image: string;
    isActive: boolean;
    isPermanent: boolean;
    startDate: string;
    endDate: string;
    link: string | null;
    viewerCount: number | null;
    imagePath: string;
};