import type { Fund, MarketIndex, NavPoint } from '@/types';

const BASE = '/api';

async function fetchJSON<T>(url: string): Promise<T> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const json = await resp.json();
  if (!json.success) throw new Error(json.error || 'API error');
  return json.data as T;
}

async function fetchFullResponse<T>(url: string): Promise<{ data: T; total?: number; page?: number; pageSize?: number }> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const json = await resp.json();
  if (!json.success) throw new Error(json.error || 'API error');
  return json;
}

// ============ 基金搜索 ============
export async function searchFunds(keyword: string): Promise<{ code: string; name: string; type: string }[]> {
  return fetchJSON(`${BASE}/funds/search?keyword=${encodeURIComponent(keyword)}`);
}

// ============ 基金列表（服务端分页） ============
export interface FundListResponse {
  funds: Fund[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchFundList(
  page = 1,
  pageSize = 50,
  type = 'all',
  sort = '1nzf',
  dir = 'desc'
): Promise<FundListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    type,
    sort,
    dir,
  });
  const raw = await fetchFullResponse<any[]>(`${BASE}/funds/list?${params.toString()}`);
  const funds = raw.data.map((f: any, i: number) => ({
    id: `${f.code}-${i}`,
    code: f.code,
    name: f.name,
    type: f.type as Fund['type'],
    manager: '--',
    managerId: undefined,
    company: '--',
    companyId: undefined,
    establishDate: '--',
    scale: '--',
    nav: f.nav || 0,
    accumulatedNav: f.accumulatedNav || 0,
    dailyChange: f.dailyChange || 0,
    yearlyReturn: f.yearlyReturn || 0,
    month1: f.month1,
    month3: f.month3,
    month6: f.month6,
    ytd: 0,
    totalReturn: 0,
    riskLevel: 3 as const,
    returns: {
      month1: f.month1 || 0,
      month3: f.month3 || 0,
      month6: f.month6 || 0,
      year1: f.yearlyReturn || 0,
      year3: f.year3 || 0,
    },
    riskMetrics: {
      maxDrawdown: 0, volatility: 0, sharpeRatio: 0, alpha: 0,
    },
    navHistory: [],
  }));
  return {
    funds,
    total: raw.total,
    page: raw.page,
    pageSize: raw.pageSize,
  };
}

// ============ 基金统计 ============
export async function fetchFundStats(): Promise<{ total: number; byType: Record<string, number> }> {
  return fetchJSON(`${BASE}/funds/stats`);
}

// ============ 基金详情 ============
export async function fetchFundDetail(code: string): Promise<Partial<Fund>> {
  return fetchJSON(`${BASE}/funds/${code}/detail`);
}

// ============ 基金净值历史 ============
export async function fetchFundNav(code: string, pageSize = 60): Promise<NavPoint[]> {
  return fetchJSON(`${BASE}/funds/${code}/nav?pageSize=${pageSize}`);
}

// ============ 市场指数 ============
export async function fetchMarketIndices(): Promise<MarketIndex[]> {
  return fetchJSON(`${BASE}/market/indices`);
}