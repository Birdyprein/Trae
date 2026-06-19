export type FundType = '股票型' | '混合型' | '债券型' | '货币型' | '指数型';

export interface PeriodReturns {
  month1: number;
  month3: number;
  month6: number;
  year1: number;
  year3: number;
}

export interface RiskMetrics {
  maxDrawdown: number;
  volatility: number;
  sharpeRatio: number;
  alpha: number;
}

export interface NavPoint {
  date: string;
  value: number;
}

export interface Fund {
  id: string;
  code: string;
  name: string;
  type: FundType;
  manager: string;
  establishDate: string;
  scale: number;
  nav: number;
  accumulatedNav: number;
  dailyChange: number;
  yearlyReturn: number;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  returns: PeriodReturns;
  riskMetrics: RiskMetrics;
  navHistory: NavPoint[];
}

export interface MarketIndex {
  name: string;
  code: string;
  value: number;
  change: number;
  changePercent: number;
}

export type TimeRange = '1m' | '3m' | '6m' | '1y' | 'all';

export type SortField = 'yearlyReturn' | 'scale' | 'dailyChange';