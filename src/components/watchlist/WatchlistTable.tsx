import { Link } from 'react-router-dom';
import { Trash2, Star, ArrowRight } from 'lucide-react';
import type { Fund } from '@/types';
import { FUND_TYPE_COLORS } from '@/constants';
import { formatPercent, formatNav, getChangeColor, safeNumber, safeString } from '@/utils/formatters';
import EmptyState from '@/components/common/EmptyState';

interface WatchlistTableProps {
  funds: Fund[];
  onRemove?: (id: string) => void;
}

export default function WatchlistTable({ funds, onRemove }: WatchlistTableProps) {
  if (!funds || funds.length === 0) {
    return (
      <div className="glass-table p-8">
        <EmptyState
          icon={<Star className="w-12 h-12 text-gold-400/60" />}
          message="自选列表为空，请先添加关注的基金"
        />
        <div className="text-center -mt-4 pb-2">
          <Link
            to="/funds"
            className="glass-button-gold inline-flex items-center gap-1.5 px-4 py-2 text-xs"
          >
            浏览基金
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-table overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted border-b border-surface-divider">
            <th className="text-left font-medium px-4 py-3 whitespace-nowrap">名称/代码</th>
            <th className="text-left font-medium px-4 py-3 whitespace-nowrap hidden sm:table-cell">类型</th>
            <th className="text-right font-medium px-4 py-3 whitespace-nowrap">单位净值</th>
            <th className="text-right font-medium px-4 py-3 whitespace-nowrap">日涨跌</th>
            <th className="text-right font-medium px-4 py-3 whitespace-nowrap hidden md:table-cell">近1年收益</th>
            <th className="text-center font-medium px-4 py-3 whitespace-nowrap">操作</th>
          </tr>
        </thead>
        <tbody>
          {funds.map((fund) => {
            const dailyChange = safeNumber(fund.dailyChange);
            const yearlyReturn = safeNumber(fund.yearlyReturn);
            const typeColor = FUND_TYPE_COLORS[safeString(fund.type)] ?? '#D4A853';
            return (
              <tr key={fund.id ?? fund.code} className="glass-table-row">
                <td className="px-4 py-3">
                  <Link to={`/funds/${fund.code}`} className="block group">
                    <div className="text-white font-medium truncate group-hover:text-gold-300 transition-colors max-w-[180px] sm:max-w-[240px]">
                      {safeString(fund.name)}
                    </div>
                    <div className="text-muted text-xs font-mono mt-0.5">{safeString(fund.code)}</div>
                  </Link>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs"
                    style={{
                      color: typeColor,
                      backgroundColor: `${typeColor}1A`,
                      border: `1px solid ${typeColor}33`,
                    }}
                  >
                    {safeString(fund.type)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-white">
                  {formatNav(fund.nav)}
                </td>
                <td className={`px-4 py-3 text-right font-mono ${getChangeColor(dailyChange)}`}>
                  {formatPercent(dailyChange)}
                </td>
                <td className={`px-4 py-3 text-right font-mono hidden md:table-cell ${getChangeColor(yearlyReturn)}`}>
                  {formatPercent(yearlyReturn)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => onRemove?.(fund.id ?? fund.code)}
                    className="glass-button inline-flex items-center justify-center w-8 h-8 text-loss hover:text-loss"
                    title="移出自选"
                    aria-label="移出自选"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
