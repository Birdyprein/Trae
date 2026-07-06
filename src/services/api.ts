import type { Fund, FundDetail, NavPoint, MarketIndex, Sector, BenchmarkHistory, Benchmark, PortfolioAnalysis } from '@/types';

const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('API请求失败:', url, err);
    throw err;
  }
}

// 对中文关键词做 URL-safe Base64 编码，避免 + / = 在 URL 中被转义
function encodeKeyword(kw: string): string {
  return btoa(unescape(encodeURIComponent(kw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// ===== 基金API =====
export async function fetchFundList(page = 1, size = 20, params?: {
  type?: string; sortBy?: string; sortOrder?: string; keyword?: string;
  minYear1Return?: number; minYear3Return?: number; minMonth6Return?: number;
  minMonth3Return?: number; minMonth1Return?: number; minDailyChange?: number;
  minEstablishYears?: number; excludeNewFunds?: boolean;
}, signal?: AbortSignal): Promise<{ funds: Fund[]; total: number }> {
  const query = new URLSearchParams({
    page: String(page), size: String(size),
    ...(params?.type && { type: params.type }),
    ...(params?.sortBy && { sortBy: params.sortBy }),
    ...(params?.sortOrder && { sortOrder: params.sortOrder }),
    ...(params?.keyword && { keyword: encodeKeyword(params.keyword) }),
    ...(params?.minYear1Return !== undefined && { minYear1Return: String(params.minYear1Return) }),
    ...(params?.minYear3Return !== undefined && { minYear3Return: String(params.minYear3Return) }),
    ...(params?.minMonth6Return !== undefined && { minMonth6Return: String(params.minMonth6Return) }),
    ...(params?.minMonth3Return !== undefined && { minMonth3Return: String(params.minMonth3Return) }),
    ...(params?.minMonth1Return !== undefined && { minMonth1Return: String(params.minMonth1Return) }),
    ...(params?.minDailyChange !== undefined && { minDailyChange: String(params.minDailyChange) }),
    ...(params?.minEstablishYears !== undefined && { minEstablishYears: String(params.minEstablishYears) }),
    ...(params?.excludeNewFunds && { excludeNewFunds: 'true' }),
  });
  return request<{ funds: Fund[]; total: number }>(`${API_BASE}/funds/list?${query}`, { signal });
}

export async function fetchFundDetail(code: string): Promise<FundDetail | null> {
  try {
    return await request<FundDetail>(`${API_BASE}/funds/${code}/detail`);
  } catch { return null; }
}

export async function fetchFundNav(code: string, days = 365): Promise<NavPoint[]> {
  try {
    const res = await request<{ data: NavPoint[] }>(`${API_BASE}/funds/${code}/nav?days=${days}`);
    return res.data || [];
  } catch { return []; }
}

export async function searchFunds(keyword: string): Promise<Fund[]> {
  try {
    const res = await request<{ funds: Fund[] }>(`${API_BASE}/funds/search?keyword=${keyword}`);
    return res.funds || [];
  } catch { return []; }
}

// ===== 市场API =====
export async function fetchMarketIndices(): Promise<MarketIndex[]> {
  try {
    const res = await request<{ data: MarketIndex[] }>(`${API_BASE}/market/indices`);
    return res.data || [];
  } catch { return []; }
}

export async function fetchIndexHistory(days = 30): Promise<NavPoint[]> {
  try {
    const res = await request<{ data: NavPoint[] }>(`${API_BASE}/market/index-history?days=${days}`);
    return res.data || [];
  } catch { return []; }
}

export async function fetchSectors(): Promise<Sector[]> {
  try {
    const res = await request<{ data: Sector[] }>(`${API_BASE}/market/sectors`);
    return res.data || [];
  } catch { return []; }
}

// ===== 基准API =====
export async function fetchBenchmarkHistory(code: string, days = 365): Promise<BenchmarkHistory | null> {
  try {
    const res = await request<{ data: any[] }>(`${API_BASE}/benchmarks/${code}/history?days=${days}`);
    const benchmark: Benchmark = code === 'category_avg'
      ? { code, name: '同类平均', type: 'category' }
      : { code, name: code, type: 'index' };
    return { benchmark, data: res.data || [] };
  } catch { return null; }
}

// ===== 穿透分析API =====
export async function fetchPortfolioAnalysis(fundIds: string[]): Promise<PortfolioAnalysis | null> {
  try {
    return await request<PortfolioAnalysis>(`${API_BASE}/analysis/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fundIds }),
    });
  } catch { return null; }
}
