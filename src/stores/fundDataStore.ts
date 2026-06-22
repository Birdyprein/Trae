import { create } from 'zustand';
import { funds as mockFunds, marketIndices as mockIndices } from '@/data/mockData';
import { fetchFundList, fetchMarketIndices } from '@/services/api';
import type { Fund, MarketIndex } from '@/types';

interface FundDataState {
  funds: Fund[];
  indices: MarketIndex[];
  loading: boolean;
  loadRealData: () => Promise<void>;
}

export const useFundDataStore = create<FundDataState>((set) => ({
  funds: mockFunds,
  indices: mockIndices,
  loading: false,
  loadRealData: async () => {
    set({ loading: true });
    try {
      const [realFunds, realIndices] = await Promise.all([
        fetchFundList(),
        fetchMarketIndices(),
      ]);
      // 真实数据优先，不够时用 mock 补充
      const merged = realFunds.length >= 6
        ? realFunds
        : [...realFunds, ...mockFunds.slice(realFunds.length)];
      set({
        funds: merged,
        indices: realIndices.length > 0 ? realIndices : mockIndices,
        loading: false,
      });
    } catch {
      // API 失败，保留 mock 数据
      set({ loading: false });
    }
  },
}));