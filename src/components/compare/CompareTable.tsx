import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { X, Crown } from 'lucide-react';
import type { FundDetail } from '@/types';
import { RISK_LEVELS } from '@/constants';
import {
  formatPercent, formatNumber, formatNav, formatScale, formatDate,
  getChangeColor, safeNumber, safeString,
} from '@/utils/formatters';

interface CompareTableProps {
  funds: FundDetail[];
  onRemove?: (id: string) => void;
}

type RowDef = {
  label: string;
  group?: string;
  get: (f: FundDetail) => number | string | undefined;
  format?: (v: number | string | undefined) => string;
  color?: (v: number | string | undefined) => string;
  higherBetter?: boolean;
};

const riskLabel = (level: number) => RISK_LEVELS.find((r) => r.level === level)?.label ?? '--';

const rows: RowDef[] = [
  { label: '基金类型', get: (f) => safeString(f.type) },
  { label: '风险等级', get: (f) => riskLabel(safeNumber(f.riskLevel)) },
  {
    label: '基金规模',
    get: (f) => safeNumber(f.scale),
    format: (v) => formatScale(typeof v === 'number' ? v : 0),
    higherBetter: true,
  },
  {
    label: '成立日期',
    get: (f) => safeString(f.establishDate),
    format: (v) => formatDate(typeof v === 'string' ? v : ''),
  },
  {
    label: '单位净值',
    get: (f) => safeNumber(f.nav),
    format: (v) => formatNav(typeof v === 'number' ? v : 0),
  },
  {
    label: '累计净值',
    get: (f) => safeNumber(f.accumulatedNav),
    format: (v) => formatNav(typeof v === 'number' ? v : 0),
  },
  {
    label: '日涨跌',
    get: (f) => safeNumber(f.dailyChange),
    format: (v) => formatPercent(typeof v === 'number' ? v : 0),
    color: (v) => getChangeColor(typeof v === 'number' ? v : 0),
    higherBetter: true,
  },
  {
    label: '近1月收益',
    group: '业绩表现',
    get: (f) => safeNumber(f.performance?.month1),
    format: (v) => formatPercent(typeof v === 'number' ? v : 0),
    color: (v) => getChangeColor(typeof v === 'number' ? v : 0),
    higherBetter: true,
  },
  {
    label: '近3月收益',
    get: (f) => safeNumber(f.performance?.month3),
    format: (v) => formatPercent(typeof v === 'number' ? v : 0),
    color: (v) => getChangeColor(typeof v === 'number' ? v : 0),
    higherBetter: true,
  },
  {
    label: '近6月收益',
    get: (f) => safeNumber(f.performance?.month6),
    format: (v) => formatPercent(typeof v === 'number' ? v : 0),
    color: (v) => getChangeColor(typeof v === 'number' ? v : 0),
    higherBetter: true,
  },
  {
    label: '近1年收益',
    get: (f) => safeNumber(f.performance?.year1),
    format: (v) => formatPercent(typeof v === 'number' ? v : 0),
    color: (v) => getChangeColor(typeof v === 'number' ? v : 0),
    higherBetter: true,
  },
  {
    label: '近3年收益',
    get: (f) => safeNumber(f.performance?.year3),
    format: (v) => formatPercent(typeof v === 'number' ? v : 0),
    color: (v) => getChangeColor(typeof v === 'number' ? v : 0),
    higherBetter: true,
  },
  {
    label: '最大回撤',
    group: '风险指标',
    get: (f) => safeNumber(f.riskMetrics?.maxDrawdown),
    format: (v) => formatPercent(typeof v === 'number' ? v : 0),
    color: (v) => getChangeColor(typeof v === 'number' ? v : 0),
    higherBetter: false,
  },
  {
    label: '年化波动率',
    get: (f) => safeNumber(f.riskMetrics?.volatility),
    format: (v) => formatNumber(typeof v === 'number' ? v : 0) + '%',
    higherBetter: false,
  },
  {
    label: '夏普比率',
    get: (f) => safeNumber(f.riskMetrics?.sharpeRatio),
    format: (v) => formatNumber(typeof v === 'number' ? v : 0),
    higherBetter: true,
  },
  {
    label: 'Alpha',
    get: (f) => safeNumber(f.riskMetrics?.alpha),
    format: (v) => formatNumber(typeof v === 'number' ? v : 0),
    higherBetter: true,
  },
  {
    label: 'Beta',
    get: (f) => safeNumber(f.riskMetrics?.beta),
    format: (v) => formatNumber(typeof v === 'number' ? v : 0),
  },
  {
    label: '管理费',
    group: '费率',
    get: (f) => safeNumber(f.fees?.managementFee),
    format: (v) => formatNumber(typeof v === 'number' ? v : 0) + '%',
    higherBetter: false,
  },
  {
    label: '托管费',
    get: (f) => safeNumber(f.fees?.custodyFee),
    format: (v) => formatNumber(typeof v === 'number' ? v : 0) + '%',
    higherBetter: false,
  },
  {
    label: '申购费',
    get: (f) => safeNumber(f.fees?.purchaseFee),
    format: (v) => formatNumber(typeof v === 'number' ? v : 0) + '%',
    higherBetter: false,
  },
  {
    label: '赎回费',
    get: (f) => safeNumber(f.fees?.redemptionFee),
    format: (v) => formatNumber(typeof v === 'number' ? v : 0) + '%',
    higherBetter: false,
  },
  {
    label: '基金经理',
    group: '其他',
    get: (f) => safeString(f.managerDetail?.name || f.manager),
  },
  {
    label: '管理年限',
    get: (f) => safeNumber(f.managerDetail?.tenure),
    format: (v) => formatNumber(typeof v === 'number' ? v : 0) + ' 年',
    higherBetter: true,
  },
  {
    label: '任职回报',
    get: (f) => safeNumber(f.managerDetail?.tenureReturn),
    format: (v) => formatPercent(typeof v === 'number' ? v : 0),
    color: (v) => getChangeColor(typeof v === 'number' ? v : 0),
    higherBetter: true,
  },
];

function findBestIndex(funds: FundDetail[], row: RowDef): number | null {
  if (row.higherBetter === undefined) return null;
  const numericValues = funds.map((f) => {
    const v = row.get(f);
    return typeof v === 'number' ? v : NaN;
  });
  if (numericValues.every((v) => isNaN(v))) return null;
  // 所有基金数据相同时，没有"最优"（不显示皇冠）
  const validValues = numericValues.filter((v) => !isNaN(v));
  if (validValues.length > 1 && validValues.every((v) => v === validValues[0])) {
    return null;
  }
  let bestIdx = -1;
  let bestVal = NaN;
  for (let i = 0; i < numericValues.length; i++) {
    if (isNaN(numericValues[i])) continue;
    if (bestIdx === -1 || (row.higherBetter ? numericValues[i] > bestVal : numericValues[i] < bestVal)) {
      bestVal = numericValues[i];
      bestIdx = i;
    }
  }
  return bestIdx >= 0 ? bestIdx : null;
}

export default function CompareTable({ funds, onRemove }: CompareTableProps) {
  if (!funds || funds.length === 0) return null;

  let lastGroup = '';

  return (
    <div className="glass-table overflow-x-auto">
      <table className="w-full text-sm whitespace-nowrap">
        <thead>
          <tr className="border-b border-surface-divider">
            <th className="text-left font-medium px-4 py-3 text-muted sticky left-0 bg-surface-data z-10 min-w-[100px]">
              指标
            </th>
            {funds.map((fund, idx) => (
              <th key={fund.id ?? fund.code ?? idx} className="px-4 py-3 min-w-[140px]">
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/funds/${fund.code}`} className="block flex-1 min-w-0 group">
                    <div className="text-white font-medium truncate group-hover:text-gold-300 transition-colors">
                      {safeString(fund.name)}
                    </div>
                    <div className="text-muted text-xs font-mono mt-0.5">{safeString(fund.code)}</div>
                  </Link>
                  {onRemove && (
                    <button
                      type="button"
                      onClick={() => onRemove(fund.id ?? fund.code)}
                      className="glass-button flex-shrink-0 inline-flex items-center justify-center w-6 h-6 text-muted hover:text-gain"
                      title="移出对比"
                      aria-label="移出对比"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => {
            const showGroupHeader = row.group && row.group !== lastGroup;
            if (row.group) lastGroup = row.group;
            const bestIdx = findBestIndex(funds, row);
            return (
              <Fragment key={`row-${rIdx}-${row.label}`}>
                {showGroupHeader && (
                  <tr className="bg-surface-hover/50">
                    <td
                      colSpan={funds.length + 1}
                      className="px-4 py-2 text-xs uppercase tracking-wider text-gold-400/80 font-medium"
                    >
                      {row.group}
                    </td>
                  </tr>
                )}
                <tr className={`glass-table-row ${rIdx % 2 === 0 ? 'bg-surface-hover/20' : ''}`}>
                  <td className="px-4 py-2.5 text-secondary sticky left-0 bg-surface-data z-10 border-r border-surface-divider">
                    {row.label}
                  </td>
                  {funds.map((fund, idx) => {
                    const raw = row.get(fund);
                    const formatted = row.format ? row.format(raw) : safeString(raw);
                    const colorClass = row.color ? row.color(raw) : 'text-white';
                    const isBest = bestIdx === idx && funds.length > 1;
                    return (
                      <td key={fund.id ?? fund.code ?? idx} className="px-4 py-2.5 text-center">
                        <div className="relative inline-flex items-center gap-1">
                          {isBest && <Crown className="w-3 h-3 text-gold-400 flex-shrink-0" />}
                          <span className={`font-mono ${colorClass} ${isBest ? 'font-semibold' : ''}`}>
                            {formatted}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
