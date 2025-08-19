export interface Page {
    pageId: string;
    pageTitle: string;
    pageHeading: string;
    pageName: string;
    alias: string;
    isLink: boolean;
    linkURL: string;
    pageFormatId: string | null;
    isOpenInNewTab: boolean;
    pageContent?: string;
    seoWord?: string | null;
    seoDescription?: string | null;
    isDefault: boolean;
    dynamicParameters?: string | null;
    isStatic: boolean;
    isActive: boolean;
    whiteLabelId?: string | null;
}