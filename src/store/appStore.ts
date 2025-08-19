import { create } from 'zustand';
import type { MenuBlock, Page, NewsItem } from '@/types/types';

interface AppState {
  menuItems: MenuBlock[];
  pages: Page[];
  news: NewsItem[];
  setInitialData: (data: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  menuItems: [],
  pages: [],
  news: [],
  setInitialData: (data) => {
    if (data) {
      set({
        menuItems: data.menuItems || [],
        pages: data.pages || [],
        news: data.news || [],
      });
    }
  },
}));