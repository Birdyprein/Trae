import type { FundPerformance } from '@/types';
import { formatPercent, getChangeColor, safeNumber } from '@/utils/formatters';

interface PerformanceTableProps {
  performance: FundPerformance;
}

interface PeriodRow {
  key: keyof FundPerformance;
  label: string;
}

const PERIODS: PeriodRow[] = [
  { key: 'month1', label: '近1月' },
  { key: 'month3', label: '近3月' },
  { key: 'month6', label: '近6月' },
  { key: 'year1', label: '近1年' },
];

export default function PerformanceTable({ performance }: PerformanceTableProps) {
  return (
    <div className="glass-table overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted border-b border-surface-divider">
            <th className="px-4 py-3 text-left font-normal">时段</th>
            <th className="px-4 py-3 text-right font-normal">收益率</th>
          </tr>
        </thead>
        <tbody>
          {PERIODS.map((period) => {
            const value = safeNumber(performance?.[period.key]);
            const color = getChangeColor(value);
            return (
              <tr key={period.key} className="glass-table-row">
                <td className="px-4 py-2.5 text-secondary">{period.label}</td>
                <td className={`px-4 py-2.5 text-right font-mono font-medium ${color}`}>
                  {formatPercent(value)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
