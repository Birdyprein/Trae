import type { HoldingItem } from '@/types';
import { safeString, safeNumber, formatNumber } from '@/utils/formatters';

interface HoldingsTableProps {
  holdings: HoldingItem[];
}

const CHANGE_STYLES: Record<string, { bg: string; color: string; default: boolean }> = {
  新增: { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', default: false },
  增持: { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', default: false },
  减持: { bg: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', default: false },
  不变: { bg: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255,255,255,0.5)', default: false },
};

function ChangeTag({ change }: { change?: string }) {
  const text = safeString(change);
  if (!change || text === '--') {
    return <span className="text-xs text-muted">--</span>;
  }
  const style = CHANGE_STYLES[text] ?? { bg: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255,255,255,0.5)', default: true };
  return (
    <span
      className="inline-block px-1.5 py-0.5 rounded text-xs"
      style={{ background: style.bg, color: style.color }}
    >
      {text}
    </span>
  );
}

export default function HoldingsTable({ holdings }: HoldingsTableProps) {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="glass-table flex items-center justify-center py-12">
        <div className="text-sm text-muted">暂无重仓股数据</div>
      </div>
    );
  }

  const totalRatio = holdings.reduce((sum, h) => sum + safeNumber(h.ratio), 0);

  return (
    <div className="glass-table overflow-x-auto">
      <table className="w-full text-sm min-w-[520px]">
        <thead>
          <tr className="text-xs text-muted border-b border-surface-divider">
            <th className="px-4 py-3 text-left font-normal">代码</th>
            <th className="px-4 py-3 text-left font-normal">名称</th>
            <th className="px-4 py-3 text-right font-normal">持仓占比</th>
            <th className="px-3 py-3 text-left font-normal hidden sm:table-cell">占比分布</th>
            <th className="px-4 py-3 text-center font-normal">持仓变化</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, idx) => {
            const ratio = safeNumber(holding.ratio);
            const barWidth = totalRatio > 0 ? Math.min((ratio / totalRatio) * 100, 100) : 0;
            return (
              <tr key={`${holding.stockCode}-${idx}`} className="glass-table-row">
                <td className="px-4 py-2.5 font-mono text-xs text-secondary">
                  {safeString(holding.stockCode)}
                </td>
                <td className="px-4 py-2.5 text-white">{safeString(holding.stockName)}</td>
                <td className="px-4 py-2.5 text-right font-mono text-gold-300">
                  {formatNumber(ratio)}%
                </td>
                <td className="px-3 py-2.5 hidden sm:table-cell">
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gold-400/60"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 py-2.5 text-center">
                  <ChangeTag change={holding.change} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
