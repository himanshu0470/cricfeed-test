// types/menu.ts

// Basic menu item type
export interface BaseMenuItem {
    menuItemId: string;
    menuItem: string;
    parentId: string | null;
    pageId: string;
    displayOrder: number;
    isActive: boolean;
    pageDetails: {
        pageId: string;
        alias: string;
        linkURL: string;
        pageTitle: string;
        isLink: boolean;
        isOpenInNewTab: boolean;
    };
}

// Menu item with children (for nested menus)
export interface MenuItem extends BaseMenuItem {
    children?: MenuItem[];
    level?: number;
}

// Menu block containing menu items
export interface MenuBlock {
    menuTypeId: string;
    menuTypeName: string;
    blockName: string;
    containerId: string;
    menuItem: MenuItem[];
    isActive?: boolean;
    displayOrder?: number;
}

// Menu navigation path
export type MenuPath = {
    id: number;
    title: string;
    alias: string;
};

// Breadcrumb navigation item
export type BreadcrumbItem = {
    title: string;
    alias: string;
    isActive: boolean;
};

// Menu context for state management
export interface MenuContext {
    activeMenuId?: number;
    breadcrumbs: BreadcrumbItem[];
    setActiveMenu: (id: number) => void;
    toggleMenu: (id: number) => void;
}

// Props for menu item components
export interface MenuItemProps {
    item: MenuItem;
    depth?: number;
    isActive?: boolean;
    onSelect?: (item: MenuItem) => void;
}

// Flattened menu structure
export type FlattenedMenu = MenuBlock & {
    path: MenuPath[];
    depth: number;
};

// Menu response from API
export interface MenuResponse {
    menuItems: MenuBlock[];
    defaultMenu?: MenuBlock;
}

// Menu utility types
export type MenuItemId = string;
export type MenuBlockId = string;

// Menu actions for state management
export type MenuAction =
    | { type: 'SET_ACTIVE_MENU'; payload: MenuItemId }
    | { type: 'TOGGLE_MENU'; payload: MenuItemId }
    | { type: 'UPDATE_BREADCRUMBS'; payload: BreadcrumbItem[] };

// Menu selection event
export interface MenuSelectEvent {
    item: MenuItem;
    path: MenuPath[];
    event: React.MouseEvent;
}