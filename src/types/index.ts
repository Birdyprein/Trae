// ===== 基金类型 =====
export type FundType = '股票型' | '混合型' | '债券型' | '指数型' | '货币型' | 'QDII' | 'FOF';
export type RiskLevel = 1 | 2 | 3 | 4 | 5;

export interface Fund {
  id: string;
  code: string;
  name: string;
  type: FundType;
  riskLevel: RiskLevel;
  manager: string;
  company: string;
  establishDate: string;
  scale: number;
  nav: number;
  accumulatedNav: number;
  dailyChange: number;
  yearlyReturn: number;
  estimatedNav?: number;
  estimatedChange?: number;
}

export interface FundPerformance {
  month1: number; month3: number; month6: number;
  year1: number; year2: number; year3: number; year5: number;
  thisYear: number; sinceEstablish: number;
}

export interface FundRanking {
  month1: number; month3: number; year1: number;
  sameTypeCount: number;
}

export interface RiskMetrics {
  maxDrawdown: number;
  volatility: number;
  sharpeRatio: number;
  alpha: number;
  beta: number;
  informationRatio: number;
}

export interface AssetAllocation {
  stock: number; bond: number; cash: number; other: number;
}

export interface IndustryAllocationItem {
  industry: string;
  ratio: number;
}

export interface HoldingItem {
  stockCode: string;
  stockName: string;
  ratio: number;
  shares?: number;
  value?: number;
  change?: string;
}

export interface FundDetail extends Fund {
  performance: FundPerformance;
  ranking: FundRanking;
  riskMetrics: RiskMetrics;
  assetAllocation: AssetAllocation;
  industryAllocation: IndustryAllocationItem[];
  topHoldings: HoldingItem[];
  managerDetail: {
    name: string;
    tenure: number;
    tenureReturn: number;
    managedFunds: number;
    totalScale: number;
    style: string;
  };
  fees: {
    managementFee: number;
    custodyFee: number;
    purchaseFee: number;
    redemptionFee: number;
  };
}

export interface NavPoint {
  date: string;
  value: number;
  accumulatedNav?: number;
  dailyChange?: number;
}

// ===== 市场类型 =====
export interface MarketIndex {
  code: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  high?: number;
  low?: number;
  open?: number;
  prevClose?: number;
}

export interface IndexHistoryPoint {
  date: string;
  value: number;
}

export interface Sector {
  code: string;
  name: string;
  change: number;
  volume: number;
  leadingStock?: string;
  leadingStockChange?: number;
}

// ===== 筛选类型 =====
export type SortField = 'year1Return' | 'year3Return' | 'scale' | 'maxDrawdown' | 'sharpeRatio' | 'establishDate';

export interface BasicFilter {
  type?: FundType[];
  riskLevel?: RiskLevel[];
  sortBy?: SortField;
  sortOrder?: 'asc' | 'desc';
}

export interface AdvancedFilter {
  minYear1Return?: number;
  minYear3Return?: number;
  maxDrawdown?: number;
  maxVolatility?: number;
  minSharpeRatio?: number;
  minScale?: number;
  maxScale?: number;
  minEstablishYears?: number;
  excludeNewFunds?: boolean;
  excludeSmallScale?: boolean;
}

export interface SavedFilterScheme {
  id: string;
  name: string;
  basic: BasicFilter;
  advanced?: AdvancedFilter;
  createdAt: string;
}

// ===== 基准类型 =====
export interface Benchmark {
  code: string;
  name: string;
  type: 'index' | 'category';
}

export interface BenchmarkHistory {
  benchmark: Benchmark;
  data: IndexHistoryPoint[];
}

// ===== 穿透分析类型 =====
export interface OverlappedStock {
  stockCode: string;
  stockName: string;
  funds: string[];
  totalRatio: number;
}

export interface PortfolioAnalysis {
  industryDistribution: IndustryAllocationItem[];
  holdingsOverlap: {
    overlappedStocks: OverlappedStock[];
    overlapRate: number;
  };
  styleExposure: {
    marketCap: 'large' | 'mid' | 'small' | 'mixed';
    style: 'value' | 'growth' | 'balanced';
    score: number;
  };
  portfolioRisk: {
    estimatedMaxDrawdown: number;
    estimatedVolatility: number;
    diversificationScore: number;
  };
}
