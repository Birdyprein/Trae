import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareState {
  compareList: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      compareList: [],
      addToCompare: (id) =>
        set((state) => ({
          compareList: state.compareList.includes(id)
            ? state.compareList
            : [...state.compareList, id].slice(0, 5),
        })),
      removeFromCompare: (id) =>
        set((state) => ({ compareList: state.compareList.filter((c) => c !== id) })),
      clearCompare: () => set({ compareList: [] }),
      isInCompare: (id) => get().compareList.includes(id),
    }),
    { name: 'fund-compare' }
  )
);
