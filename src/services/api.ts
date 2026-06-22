import type { Fund, MarketIndex, NavPoint } from '@/types';

const BASE = '/api';

async function fetchJSON<T>(url: string): Promise<T> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const json = await resp.json();
  if (!json.success) throw new Error(json.error || 'API error');
  return json.data as T;
}

// ============ 基金搜索 ============
export async function searchFunds(keyword: string): Promise<{ code: string; name: string; type: string }[]> {
  return fetchJSON(`${BASE}/funds/search?keyword=${encodeURIComponent(keyword)}`);
}

// ============ 基金列表 ============
export async function fetchFundList(): Promise<Fund[]> {
  const raw = await fetchJSON<any[]>(`${BASE}/funds/list`);
  return raw.map((f, i) => ({
    id: String(i + 100),
    code: f.code,
    name: f.name,
    type: f.type as Fund['type'],
    manager: '--',
    establishDate: '--',
    scale: 0,
    nav: f.nav || 0,
    accumulatedNav: f.accumulatedNav || 0,
    dailyChange: f.dailyChange || 0,
    yearlyReturn: f.yearlyReturn || 0,
    riskLevel: 3 as const,
    returns: {
      month1: 0, month3: 0, month6: 0,
      year1: f.yearlyReturn || 0, year3: 0,
    },
    riskMetrics: {
      maxDrawdown: 0, volatility: 0, sharpeRatio: 0, alpha: 0,
    },
    navHistory: [],
  }));
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