import type { FundType, Benchmark } from '@/types';

export const FUND_TYPES: FundType[] = [
  '股票型', '混合型', '债券型', '指数型', '货币型', 'QDII', 'FOF'
];

export const FUND_TYPE_COLORS: Record<string, string> = {
  '股票型': '#EF4444',
  '混合型': '#F59E0B',
  '债券型': '#3B82F6',
  '指数型': '#8B5CF6',
  '货币型': '#10B981',
  'QDII': '#EC4899',
  'FOF': '#6366F1',
  'ETF': '#14B8A6',
};

export const RISK_LEVELS = [
  { level: 1, label: '低风险', desc: '适合保守型投资者' },
  { level: 2, label: '中低风险', desc: '适合稳健型投资者' },
  { level: 3, label: '中风险', desc: '适合平衡型投资者' },
  { level: 4, label: '中高风险', desc: '适合进取型投资者' },
  { level: 5, label: '高风险', desc: '适合激进型投资者' },
];

export const PRESET_BENCHMARKS: Benchmark[] = [
  { code: '000300', name: '沪深300', type: 'index' },
  { code: '000905', name: '中证500', type: 'index' },
  { code: '000852', name: '中证1000', type: 'index' },
  { code: 'category_avg', name: '同类平均', type: 'category' },
];

export const MARKET_INDICES = [
  { code: '1.000001', name: '上证指数' },
  { code: '0.399001', name: '深证成指' },
  { code: '0.399006', name: '创业板指' },
  { code: '1.000688', name: '科创50' },
  { code: '100.HSI', name: '恒生指数' },
  { code: '100.NDX', name: '纳斯达克' },
];

export const COMPLIANCE_NOTICE = '数据来自公开接口，仅供学习研究，不构成投资建议';
