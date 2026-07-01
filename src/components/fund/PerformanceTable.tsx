import type { FundPerformance, FundRanking } from '@/types';
import { formatPercent, getChangeColor, safeNumber } from '@/utils/formatters';

interface PerformanceTableProps {
  performance: FundPerformance;
  ranking?: FundRanking;
}

interface PeriodRow {
  key: keyof FundPerformance;
  label: string;
  rankingKey?: keyof FundRanking;
}

const PERIODS: PeriodRow[] = [
  { key: 'month1', label: '近1月', rankingKey: 'month1' },
  { key: 'month3', label: '近3月', rankingKey: 'month3' },
  { key: 'month6', label: '近6月' },
  { key: 'year1', label: '近1年', rankingKey: 'year1' },
  { key: 'year2', label: '近2年' },
  { key: 'year3', label: '近3年' },
  { key: 'year5', label: '近5年' },
  { key: 'thisYear', label: '今年来' },
  { key: 'sinceEstablish', label: '成立来' },
];

export default function PerformanceTable({ performance, ranking }: PerformanceTableProps) {
  const sameTypeCount = ranking?.sameTypeCount;

  const renderRanking = (rank?: number) => {
    if (rank === undefined || rank === null) return <span className="text-muted">--</span>;
    if (sameTypeCount && sameTypeCount > 0) {
      const percentile = (rank / sameTypeCount) * 100;
      const color = percentile <= 25 ? 'text-gain' : percentile >= 75 ? 'text-loss' : 'text-secondary';
      return <span className={color}>{rank}/{sameTypeCount}</span>;
    }
    return <span className="text-secondary">第{rank}名</span>;
  };

  return (
    <div className="glass-table overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted border-b border-surface-divider">
            <th className="px-4 py-3 text-left font-normal">时段</th>
            <th className="px-4 py-3 text-right font-normal">收益率</th>
            {ranking && <th className="px-4 py-3 text-right font-normal">同类排名</th>}
          </tr>
        </thead>
        <tbody>
          {PERIODS.map((period) => {
            const value = safeNumber(performance?.[period.key]);
            const color = getChangeColor(value);
            const rank = period.rankingKey ? ranking?.[period.rankingKey] : undefined;
            return (
              <tr key={period.key} className="glass-table-row">
                <td className="px-4 py-2.5 text-secondary">{period.label}</td>
                <td className={`px-4 py-2.5 text-right font-mono font-medium ${color}`}>
                  {formatPercent(value)}
                </td>
                {ranking && (
                  <td className="px-4 py-2.5 text-right font-mono text-xs">
                    {renderRanking(rank)}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
