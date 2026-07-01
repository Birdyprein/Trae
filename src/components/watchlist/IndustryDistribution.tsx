import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import type { IndustryAllocationItem } from '@/types';
import { formatNumber, safeNumber, safeString } from '@/utils/formatters';

interface IndustryDistributionProps {
  data: IndustryAllocationItem[];
}

const PIE_COLORS = [
  '#D4A853', '#EF4444', '#3B82F6', '#8B5CF6',
  '#10B981', '#F59E0B', '#EC4899', '#14B8A6',
  '#6366F1', '#A67C2A', '#22C55E', '#06B6D4',
];

export default function IndustryDistribution({ data }: IndustryDistributionProps) {
  const items = Array.isArray(data) ? data : [];
  const total = items.reduce((sum, item) => sum + safeNumber(item.ratio), 0);

  const chartData = items.map((item) => ({
    name: safeString(item.industry),
    value: Number(safeNumber(item.ratio).toFixed(2)),
  }));

  return (
    <div className="glass-data-card p-4 sm:p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <PieIcon className="w-4 h-4 text-gold-400" />
        <h3 className="text-white text-base font-medium">行业分布</h3>
      </div>

      {chartData.length === 0 ? (
        <div className="h-60 flex items-center justify-center text-muted text-sm">
          暂无行业分布数据
        </div>
      ) : (
        <>
          <div className="w-full h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth={1}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 15, 30, 0.92)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${formatNumber(value)}%`, '占比']}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', paddingTop: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {chartData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between glass-metric-box px-2.5 py-1.5"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="text-secondary truncate">{item.name}</span>
                </div>
                <span className="text-white font-mono ml-2">
                  {total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0'}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
