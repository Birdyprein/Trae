import { User, Award } from 'lucide-react';
import type { FundDetail } from '@/types';
import { formatPercent, formatScale, getChangeColor, safeString, safeNumber } from '@/utils/formatters';

interface ManagerCardProps {
  manager: FundDetail['managerDetail'];
}

export default function ManagerCard({ manager }: ManagerCardProps) {
  if (!manager) {
    return (
      <div className="glass-card p-4 sm:p-6 flex items-center justify-center py-12">
        <div className="text-sm text-muted">暂无基金经理信息</div>
      </div>
    );
  }

  const tenureReturn = safeNumber(manager.tenureReturn);
  const returnColor = getChangeColor(tenureReturn);

  const stats = [
    { label: '任职年限', value: `${safeNumber(manager.tenure).toFixed(1)}年` },
    { label: '管理基金', value: `${safeNumber(manager.managedFunds)}只` },
    { label: '管理规模', value: formatScale(manager.totalScale) },
  ];

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="shrink-0 w-12 h-12 rounded-full bg-gold-400/15 border border-gold-400/30 flex items-center justify-center">
          <User size={22} className="text-gold-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-medium text-white">{safeString(manager.name)}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Award size={12} className="text-gold-400" />
            <span className="text-xs text-secondary">{safeString(manager.style, '投资风格未标注')}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-muted mb-0.5">任职回报</div>
          <div className={`text-lg font-display font-bold ${returnColor}`}>
            {formatPercent(tenureReturn)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="glass-metric-box p-3 text-center">
            <div className="text-xs text-muted mb-1">{s.label}</div>
            <div className="text-sm font-display font-medium text-white">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
