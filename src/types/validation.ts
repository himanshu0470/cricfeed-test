import { MenuBlock } from "./menu";

// types/validation.ts
export function isMenuBlock(obj: unknown): obj is MenuBlock {
    if (!obj || typeof obj !== 'object') return false;

    const menuBlock = obj as MenuBlock;
    return (
        typeof menuBlock.menuTypeId === 'string' &&
        typeof menuBlock.menuTypeName === 'string' &&
        typeof menuBlock.blockName === 'string' &&
        typeof menuBlock.containerId === 'string' &&
        Array.isArray(menuBlock.menuItem)
    );
}