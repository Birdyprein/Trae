import { Layers, AlertTriangle } from 'lucide-react';
import type { OverlappedStock } from '@/types';
import { formatNumber, safeNumber, safeString } from '@/utils/formatters';

interface HoldingsOverlapProps {
  overlappedStocks: OverlappedStock[];
  overlapRate: number;
}

function getOverlapColor(rate: number): string {
  if (rate >= 30) return 'text-gain';
  if (rate >= 15) return 'text-gold-400';
  return 'text-loss';
}

function getOverlapLabel(rate: number): string {
  if (rate >= 30) return '重叠较高';
  if (rate >= 15) return '重叠适中';
  return '重叠较低';
}

export default function HoldingsOverlap({ overlappedStocks, overlapRate }: HoldingsOverlapProps) {
  const rate = safeNumber(overlapRate);
  const stocks = Array.isArray(overlappedStocks) ? overlappedStocks : [];

  return (
    <div className="glass-data-card p-4 sm:p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-4 h-4 text-gold-400" />
        <h3 className="text-white text-base font-medium">重仓股重叠</h3>
      </div>

      {/* 重叠率展示 */}
      <div className="glass-metric-box p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-muted text-xs">组合重叠率</div>
            <div className={`text-2xl font-bold mt-1 ${getOverlapColor(rate)}`}>
              {formatNumber(rate)}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-muted text-xs">重叠评估</div>
            <div className={`text-sm font-medium mt-1 ${getOverlapColor(rate)}`}>
              {getOverlapLabel(rate)}
            </div>
          </div>
        </div>
        {/* 进度条 */}
        <div className="mt-3 h-1.5 bg-surface-hover rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              rate >= 30 ? 'bg-gain' : rate >= 15 ? 'bg-gold-400' : 'bg-loss'
            }`}
            style={{ width: `${Math.min(rate, 100)}%` }}
          />
        </div>
        {rate >= 30 && (
          <div className="mt-2 flex items-center gap-1 text-xs text-gain">
            <AlertTriangle className="w-3 h-3" />
            <span>重叠率较高，建议适当分散投资</span>
          </div>
        )}
      </div>

      {/* 重叠股票表格 */}
      {stocks.length === 0 ? (
        <div className="py-6 text-center text-muted text-sm">暂无重叠股票数据</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted border-b border-surface-divider">
                <th className="text-left font-medium px-2 py-2 whitespace-nowrap">股票</th>
                <th className="text-right font-medium px-2 py-2 whitespace-nowrap">合计占比</th>
                <th className="text-left font-medium px-2 py-2 whitespace-nowrap hidden sm:table-cell">涉及基金</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, index) => {
                const ratio = safeNumber(stock.totalRatio);
                const funds = Array.isArray(stock.funds) ? stock.funds : [];
                return (
                  <tr key={`${stock.stockCode ?? index}`} className="glass-table-row">
                    <td className="px-2 py-2">
                      <div className="text-white text-sm font-medium">
                        {safeString(stock.stockName)}
                      </div>
                      <div className="text-muted text-xs font-mono">
                        {safeString(stock.stockCode)}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-right">
                      <span
                        className={`font-mono font-medium ${
                          ratio >= 8 ? 'text-gain' : ratio >= 5 ? 'text-gold-400' : 'text-white'
                        }`}
                      >
                        {formatNumber(ratio)}%
                      </span>
                    </td>
                    <td className="px-2 py-2 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {funds.slice(0, 3).map((fundId, i) => (
                          <span key={i} className="glass-badge">
                            {safeString(fundId)}
                          </span>
                        ))}
                        {funds.length > 3 && (
                          <span className="text-xs text-muted">+{funds.length - 3}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
