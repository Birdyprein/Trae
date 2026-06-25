export type FundType = '股票型' | '混合型' | '债券型' | '货币型' | '指数型' | 'QDII' | 'FOF';

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
  managerId?: string;
  company: string;
  companyId?: string;
  establishDate: string;
  scale: string;
  nav: number;
  accumulatedNav: number;
  dailyChange: number;
  yearlyReturn: number;
  month1?: number;
  month3?: number;
  month6?: number;
  ytd?: number;
  totalReturn?: number;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  subscribe?: string;
  redeem?: string;
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

export type SortField = 'nav' | 'dailyChange' | 'yearlyReturn' | 'month1' | 'month3' | 'month6';