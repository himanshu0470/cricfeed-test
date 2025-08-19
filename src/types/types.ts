// Types for individual news items
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
};

// Types for pages within the response
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
  whiteLabelId?: string | null;
}

// Types for menu items within a block
export interface MenuItem {
  menuItemId: string;
  menuItem: string;
  parentId: string;
  pageId: string;
  displayOrder: number;
  pageDetails: {
    alias: string;
    linkURL: string;
  };
}

// Types for each menu block within the menu
export interface MenuBlock {
  menuTypeId: string;
  menuTypeName: string;
  blockName: string;
  containerId: string;
  menuItem: MenuItem[];
}

// Type for the banner items
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
};

// Types for competition items
export type Competition = {
  competitionId: number;
  eventTypeId: number;
  eventType: string;
  refId: string;
  image: string | null;
  isActive: boolean;
  displayOrder: number;
  isTrending: boolean;
};

// Types for menu path
export type MenuPath = {
  id: number;
  title: string;
  alias: string;
};

// Types for breadcrumb items
export type BreadcrumbItem = {
  title: string;
  alias: string;
  isActive: boolean;
};

// Types for menu context if using context for menu
export interface MenuContext {
  activeMenuId?: number;
  breadcrumbs: BreadcrumbItem[];
  setActiveMenu: (id: number) => void;
  toggleMenu: (id: number) => void;
}

// Type for props for menu components
export interface MenuItemProps {
  item: MenuBlock;
  depth?: number;
  isActive?: boolean;
  onSelect?: (item: MenuBlock) => void;
}

// Helper type for nested menu operations
export type FlattenedMenu = MenuBlock & {
  path: MenuPath[];
  depth: number;
};

// Overall API response structure
export interface ApiResponse {
  success: boolean;
  status: number;
  result: {
    menuItems: MenuBlock[];
    pages: Page[];
    banner: Banner[];
    news: NewsItem[];
    competitions: Competition[];
    blocks: unknown[]; // Define a type if 'blocks' has a known structure
  };
  title: string;
  message: string;
}
