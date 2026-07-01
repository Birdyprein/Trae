import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchlistState {
  watchlist: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      toggle: (id) =>
        set((state) => ({
          watchlist: state.watchlist.includes(id)
            ? state.watchlist.filter((w) => w !== id)
            : [...state.watchlist, id],
        })),
      has: (id) => get().watchlist.includes(id),
      remove: (id) =>
        set((state) => ({ watchlist: state.watchlist.filter((w) => w !== id) })),
      clear: () => set({ watchlist: [] }),
    }),
    { name: 'fund-watchlist' }
  )
);
