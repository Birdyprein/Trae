import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** 持仓条目 */
export interface PortfolioHolding {
  /** 基金代码 */
  code: string;
  /** 基金名称 */
  name: string;
  /** 持有份额 */
  shares: number;
  /** 买入均价（净值） */
  avgCost: number;
  /** 买入日期 */
  buyDate: string;
}

interface PortfolioState {
  holdings: PortfolioHolding[];
  /** 添加持仓 */
  addHolding: (holding: PortfolioHolding) => void;
  /** 删除持仓 */
  removeHolding: (code: string) => void;
  /** 更新持仓 */
  updateHolding: (code: string, updates: Partial<PortfolioHolding>) => void;
  /** 清空持仓 */
  clearHoldings: () => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      holdings: [],
      addHolding: (holding) =>
        set((state) => {
          const existing = state.holdings.findIndex((h) => h.code === holding.code);
          if (existing >= 0) {
            const updated = [...state.holdings];
            updated[existing] = { ...updated[existing], ...holding };
            return { holdings: updated };
          }
          return { holdings: [...state.holdings, holding] };
        }),
      removeHolding: (code) =>
        set((state) => ({
          holdings: state.holdings.filter((h) => h.code !== code),
        })),
      updateHolding: (code, updates) =>
        set((state) => ({
          holdings: state.holdings.map((h) =>
            h.code === code ? { ...h, ...updates } : h
          ),
        })),
      clearHoldings: () => set({ holdings: [] }),
    }),
    {
      name: 'portfolio-storage',
    }
  )
);
