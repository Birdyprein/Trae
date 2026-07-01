import type { NavPoint } from '@/types';

// 计算最大回撤
export function calcMaxDrawdown(navHistory: NavPoint[]): number {
  if (!navHistory || navHistory.length === 0) return 0;
  let maxNav = navHistory[0].value;
  let maxDrawdown = 0;
  for (const point of navHistory) {
    if (point.value > maxNav) maxNav = point.value;
    const drawdown = (maxNav - point.value) / maxNav;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }
  return -(maxDrawdown * 100);
}

// 计算波动率（年化）
export function calcVolatility(navHistory: NavPoint[]): number {
  if (!navHistory || navHistory.length < 2) return 0;
  const returns: number[] = [];
  for (let i = 1; i < navHistory.length; i++) {
    const ret = (navHistory[i].value - navHistory[i - 1].value) / navHistory[i - 1].value;
    returns.push(ret);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
  const dailyVol = Math.sqrt(variance);
  return dailyVol * Math.sqrt(252) * 100; // 年化
}

// 计算夏普比率
export function calcSharpeRatio(navHistory: NavPoint[], riskFreeRate = 2): number {
  if (!navHistory || navHistory.length < 2) return 0;
  const totalReturn = (navHistory[navHistory.length - 1].value - navHistory[0].value) / navHistory[0].value;
  const days = navHistory.length;
  const annualReturn = (Math.pow(1 + totalReturn, 365 / days) - 1) * 100;
  const vol = calcVolatility(navHistory);
  if (vol === 0) return 0;
  return (annualReturn - riskFreeRate) / vol;
}

// 生成模拟净值历史
export function generateMockNavHistory(baseNav: number, yearlyReturn: number, days = 365): NavPoint[] {
  const history: NavPoint[] = [];
  let value = baseNav * (1 - yearlyReturn * 0.01 * 0.3);
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const noise = (Math.random() - 0.48) * 0.012;
    const drift = (yearlyReturn * 0.01) / 365;
    value = value * (1 + drift + noise);
    history.push({
      date: date.toISOString().slice(0, 10),
      value: Math.round(value * 10000) / 10000,
    });
  }
  return history;
}

// 生成模拟指数历史
export function generateMockIndexHistory(base: number, days = 30): NavPoint[] {
  const history: NavPoint[] = [];
  let value = base;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    value = value * (1 + (Math.random() - 0.48) * 0.015);
    history.push({
      date: date.toISOString().slice(0, 10),
      value: Math.round(value * 100) / 100,
    });
  }
  return history;
}

// SIP定投计算
export function calcSIP(monthlyInvestment: number, annualReturn: number, years: number) {
  const monthlyRate = annualReturn / 100 / 12;
  const months = years * 12;
  const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const totalInvested = monthlyInvestment * months;
  const totalReturn = futureValue - totalInvested;
  const returnRate = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
  return {
    totalInvested: Math.round(totalInvested),
    futureValue: Math.round(futureValue),
    totalReturn: Math.round(totalReturn),
    returnRate: returnRate.toFixed(2),
    months,
  };
}
