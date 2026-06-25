import { create } from 'zustand';
import { funds as mockFunds, marketIndices as mockIndices } from '@/data/mockData';
import { fetchFundList, fetchMarketIndices, fetchFundStats } from '@/services/api';
import type { Fund, MarketIndex } from '@/types';

interface FundDataState {
  funds: Fund[];
  totalFunds: number;
  indices: MarketIndex[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  currentType: string;
  loadRealData: () => Promise<void>;
  loadFundPage: (page: number, type?: string) => Promise<void>;
}

export const useFundDataStore = create<FundDataState>((set, get) => ({
  funds: mockFunds,
  totalFunds: mockFunds.length,
  indices: mockIndices,
  loading: false,
  currentPage: 1,
  pageSize: 50,
  currentType: 'all',
  loadRealData: async () => {
    set({ loading: true });
    try {
      const [result, realIndices] = await Promise.all([
        fetchFundList(1, 50, 'all'),
        fetchMarketIndices(),
      ]);
      set({
        funds: result.funds,
        totalFunds: result.total,
        indices: realIndices.length > 0 ? realIndices : mockIndices,
        loading: false,
        currentPage: 1,
      });
    } catch {
      set({ loading: false });
    }
  },
  loadFundPage: async (page: number, type?: string) => {
    const currentType = type || get().currentType;
    const pageSize = get().pageSize;
    set({ loading: true, currentType });
    try {
      const result = await fetchFundList(page, pageSize, currentType);
      set({
        funds: result.funds,
        totalFunds: result.total,
        loading: false,
        currentPage: page,
      });
    } catch {
      set({ loading: false });
    }
  },
}));