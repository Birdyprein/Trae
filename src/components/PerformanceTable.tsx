import type { PeriodReturns } from '@/types';

interface Props {
  returns: PeriodReturns;
}

const periods: { label: string; key: keyof PeriodReturns }[] = [
  { label: '近1月', key: 'month1' },
  { label: '近3月', key: 'month3' },
  { label: '近6月', key: 'month6' },
  { label: '近1年', key: 'year1' },
  { label: '近3年', key: 'year3' },
];

export default function PerformanceTable({ returns }: Props) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-display font-bold text-white mb-4">阶段收益</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              {periods.map((p) => (
                <th key={p.key} className="text-center px-4 py-3 text-muted font-medium">
                  {p.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {periods.map((p) => {
                const val = returns[p.key];
                const isPositive = val >= 0;
                return (
                  <td
                    key={p.key}
                    className={`text-center px-4 py-3 text-lg font-bold font-display ${
                      isPositive ? 'text-gain' : 'text-loss'
                    }`}
                  >
                    {isPositive ? '+' : ''}{val.toFixed(2)}%
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}