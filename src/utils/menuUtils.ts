// utils/menuUtils.ts
import { MenuItem, MenuPath } from '@/types/menu';

export function findMenuItem(
    items: MenuItem[],
    id: string
): MenuItem | undefined {
    for (const item of items) {
        if (item.menuItemId === id) return item;
        if (item.children) {
            const found = findMenuItem(item.children, id);
            if (found) return found;
        }
    }
    return undefined;
}

export function buildMenuPath(
    items: MenuItem[],
    id: string,
    path: MenuPath[] = []
): MenuPath[] {
    for (const item of items) {
        const currentPath = [
            ...path,
            { id: parseInt(item.menuItemId), title: item.menuItem, alias: item.pageDetails.alias }
        ];

        if (item.menuItemId === id) return currentPath;

        if (item.children) {
            const found = buildMenuPath(item.children, id, currentPath);
            if (found.length) return found;
        }
    }
    return [];
}

export function flattenMenuItems(
    items: MenuItem[],
    level = 0
): MenuItem[] {
    return items.reduce<MenuItem[]>((flat, item) => {
        const flatItem = { ...item, level };
        return [
            ...flat,
            flatItem,
            ...(item.children ? flattenMenuItems(item.children, level + 1) : [])
        ];
    }, []);
}