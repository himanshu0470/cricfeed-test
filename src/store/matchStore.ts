import { MatchData } from '@/types/matches';
import { create } from 'zustand';

interface MatchState {
  matchData: MatchData | null;
  setMatchData: (data: MatchData) => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  matchData: null,
  setMatchData: (data) => set({ matchData: data }),
}));
