import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Fund } from '@/types';

interface FundDataState {
  funds: Fund[];
  totalFunds: number;
  loading: boolean;
  error: string | null;
  setFunds: (funds: Fund[]) => void;
  setTotalFunds: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFundDataStore = create<FundDataState>((set) => ({
  funds: [],
  totalFunds: 0,
  loading: false,
  error: null,
  setFunds: (funds) => set({ funds }),
  setTotalFunds: (total) => set({ totalFunds: total }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
