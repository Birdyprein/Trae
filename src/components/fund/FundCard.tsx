import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Fund } from '@/types';
import { FUND_TYPE_COLORS } from '@/constants';
import { useWatchlistStore } from '@/stores/watchlistStore';
import { formatNav, formatPercent, getChangeColor, safeString, formatScale } from '@/utils/formatters';

interface FundCardProps {
  fund: Fund;
  index: number;
}

function RiskTag({ level }: { level: number }) {
  const riskMap = {
    1: { label: '低风险', className: 'tag-risk-low' },
    2: { label: '低风险', className: 'tag-risk-low' },
    3: { label: '中风险', className: 'tag-risk-mid' },
    4: { label: '高风险', className: 'tag-risk-high' },
    5: { label: '高风险', className: 'tag-risk-high' },
  };
  const risk = riskMap[level] || { label: '中风险', className: 'tag-risk-mid' };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${risk.className}`}>
      {risk.label}
    </span>
  );
}

function getTypeIcon(type: string): string {
  const iconMap: Record<string, string> = {
    '股票型': '股',
    '混合型': '混',
    '债券型': '债',
    '指数型': '指',
    '货币型': '货',
    'QDII': 'Q',
  };
  return iconMap[type] || '基';
}

function getTypeGradient(type: string): string {
  const gradientMap: Record<string, string> = {
    '股票型': 'linear-gradient(135deg, #e53e3e, #c53030)',
    '混合型': 'linear-gradient(135deg, #d69e2e, #b7791f)',
    '债券型': 'linear-gradient(135deg, #3182ce, #2b6cb0)',
    '指数型': 'linear-gradient(135deg, #38a169, #2f855a)',
    '货币型': 'linear-gradient(135deg, #805ad5, #6b46c1)',
    'QDII': 'linear-gradient(135deg, #00b5d8, #0097a7)',
  };
  return gradientMap[type] || 'linear-gradient(135deg, #718096, #4a5568)';
}

export default function FundCard({ fund, index }: FundCardProps) {
  const toggle = useWatchlistStore((s) => s.toggle);
  const isWatched = useWatchlistStore((s) => s.watchlist.includes(fund.id));
  const yearlyColor = getChangeColor(fund.yearlyReturn);
  const dailyColor = getChangeColor(fund.dailyChange);

  const handleToggleWatch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(fund.id);
  };

  return (
    <Link
      to={`/funds/${fund.id}`}
      className="card-light p-5 block animate-fade-in hover:-translate-y-0.5"
      style={{ animationDelay: `${Math.min(index, 10) * 30}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* 基金类型图标 */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
          style={{ background: getTypeGradient(fund.type) }}
        >
          {getTypeIcon(fund.type)}
        </div>

        {/* 基金信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-gray-900 line-clamp-1 mb-1">
                {safeString(fund.name)}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-mono">{safeString(fund.code)}</span>
                <span>·</span>
                <span>{safeString(fund.manager)} 管理</span>
              </div>
            </div>
            <button
              onClick={handleToggleWatch}
              className="shrink-0 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={isWatched ? '取消自选' : '加入自选'}
            >
              <Star
                size={18}
                className={isWatched ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}
              />
            </button>
          </div>

          {/* 标签行 */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <RiskTag level={fund.riskLevel ?? 3} />
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">
              {safeString(fund.type)}
            </span>
            {fund.scale > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700">
                规模 {formatScale(fund.scale)}
              </span>
            )}
          </div>

          {/* 数据指标 */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">单位净值</div>
              <div className="text-base font-bold font-mono text-gray-900">
                {formatNav(fund.nav)}
              </div>
              <div className={`text-xs font-semibold ${dailyColor}`}>
                {formatPercent(fund.dailyChange)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">近一年</div>
              <div className={`text-base font-bold font-mono ${yearlyColor}`}>
                {formatPercent(fund.yearlyReturn)}
              </div>
            </div>
            <div className="flex items-end justify-end">
              <button className="px-4 py-1.5 text-xs font-bold rounded-full transition-all hover:-translate-y-0.5" style={{
                background: '#c9a84c',
                color: '#1a1a1a',
                border: '1.5px solid #c9a84c',
              }}>
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
