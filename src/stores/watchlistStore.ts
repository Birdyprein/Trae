import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchlistState {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids : [...s.ids, id] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((i) => i !== id) })),
      toggle: (id) => {
        const exists = get().ids.includes(id);
        if (exists) {
          set((s) => ({ ids: s.ids.filter((i) => i !== id) }));
        } else {
          set((s) => ({ ids: [...s.ids, id] }));
        }
      },
      has: (id) => get().ids.includes(id),
    }),
    { name: 'fund-watchlist' }
  )
);