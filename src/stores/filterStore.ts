import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BasicFilter, AdvancedFilter, SavedFilterScheme } from '@/types';

interface FilterState {
  basic: BasicFilter;
  advanced: AdvancedFilter;
  showAdvanced: boolean;
  savedSchemes: SavedFilterScheme[];
  setBasic: (filter: Partial<BasicFilter>) => void;
  setAdvanced: (filter: Partial<AdvancedFilter>) => void;
  toggleAdvanced: () => void;
  resetAdvanced: () => void;
  saveScheme: (name: string) => void;
  loadScheme: (id: string) => void;
  deleteScheme: (id: string) => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      basic: { sortBy: 'year1Return', sortOrder: 'desc' },
      advanced: {},
      showAdvanced: false,
      savedSchemes: [],
      setBasic: (filter) => set((state) => ({ basic: { ...state.basic, ...filter } })),
      setAdvanced: (filter) => set((state) => ({ advanced: { ...state.advanced, ...filter } })),
      toggleAdvanced: () => set((state) => ({ showAdvanced: !state.showAdvanced })),
      resetAdvanced: () => set({ advanced: {} }),
      saveScheme: (name) =>
        set((state) => ({
          savedSchemes: [
            ...state.savedSchemes,
            {
              id: Date.now().toString(),
              name,
              basic: state.basic,
              advanced: state.advanced,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      loadScheme: (id) => {
        const scheme = get().savedSchemes.find((s) => s.id === id);
        if (scheme) set({ basic: scheme.basic, advanced: scheme.advanced || {} });
      },
      deleteScheme: (id) =>
        set((state) => ({ savedSchemes: state.savedSchemes.filter((s) => s.id !== id) })),
    }),
    { name: 'fund-filter' }
  )
);
