// ===== 数据格式化工具 =====

export function formatPercent(value: number | undefined | null, decimals = 2): string {
  if (value === undefined || value === null || isNaN(value)) return '--';
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number | undefined | null, decimals = 2): string {
  if (value === undefined || value === null || isNaN(value)) return '--';
  return value.toFixed(decimals);
}

export function formatNav(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '--';
  return value.toFixed(4);
}

export function formatScale(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '--';
  if (value >= 100) return `${value.toFixed(1)}亿`;
  if (value >= 1) return `${value.toFixed(2)}亿`;
  return `${(value * 10000).toFixed(0)}万`;
}

export function formatVolume(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '--';
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万亿`;
  if (value >= 100) return `${value.toFixed(1)}亿`;
  return `${value.toFixed(1)}亿`;
}

export function formatDate(date: string | undefined | null): string {
  if (!date) return '--';
  return date.slice(0, 10);
}

export function formatMoney(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '--';
  return `¥${value.toLocaleString()}`;
}

export function getChangeColor(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return 'text-muted';
  if (value > 0) return 'text-gain';
  if (value < 0) return 'text-loss';
  return 'text-secondary';
}

export function safeNumber(value: any, fallback = 0): number {
  if (value === undefined || value === null || isNaN(value)) return fallback;
  return Number(value);
}

export function safeString(value: any, fallback = '--'): string {
  if (value === undefined || value === null || value === '') return fallback;
  return String(value);
}
