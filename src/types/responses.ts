import { Banner } from "./banner";
import { Competition } from "./competition";
import { MenuBlock } from "./menu";
import { NewsItem } from "./news";
import { Page } from "./page";

export interface InitialDataResponse {
    menuItems: MenuBlock[];
    pages: Page[];
    banner: Banner[];
    news: NewsItem[];
    competitions: Competition[];
    blocks: unknown[]; // Define specific type if needed
}