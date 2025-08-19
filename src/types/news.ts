export type NewsItem = {
    newsId: number;
    title: string;
    news: string;
    image: string;
    isActive: boolean;
    isPermanent: boolean;
    startDate: string;
    endDate: string;
    tags: string;
    viewerCount: number;
    credit: string | null;
    SEO: string | null;
    SEODescription: string | null;
    imagePath: string;
};