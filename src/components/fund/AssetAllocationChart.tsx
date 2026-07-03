import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { AssetAllocation } from '@/types';
import { formatPercent, safeNumber } from '@/utils/formatters';

interface AssetAllocationChartProps {
  allocation: AssetAllocation;
}

const ASSET_COLORS: Record<string, string> = {
  stock: '#EF4444',
  bond: '#3B82F6',
  cash: '#22C55E',
  other: '#8B5CF6',
};

const ASSET_LABELS: Record<string, string> = {
  stock: '股票',
  bond: '债券',
  cash: '现金',
  other: '其他',
};

export default function AssetAllocationChart({ allocation }: AssetAllocationChartProps) {
  const assetData = (['stock', 'bond', 'cash', 'other'] as const)
    .map((key) => ({
      name: ASSET_LABELS[key],
      key,
      value: safeNumber(allocation?.[key]),
    }))
    .filter((d) => d.value > 0);

  const totalAsset = assetData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="glass-card p-4 sm:p-6">
      <h3 className="text-base font-medium mb-4">资产配置</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 资产配置饼图 */}
        <div>
          {assetData.length === 0 ? (
            <div className="flex items-center justify-center h-[240px] text-muted text-sm">
              暂无配置数据
            </div>
          ) : (
            <div className="h-[240px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    isAnimationActive
                  >
                    {assetData.map((entry) => (
                      <Cell key={entry.key} fill={ASSET_COLORS[entry.key]} stroke="rgba(0,0,0,0.2)" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(20,20,35,0.9)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value: number) => [
                      `${formatPercent(totalAsset > 0 ? (value / totalAsset) * 100 : 0)}`,
                      '占比',
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-xs text-muted">总仓位</div>
                <div className="text-lg font-display font-bold text-gold-300">
                  {formatPercent(totalAsset)}
                </div>
              </div>
            </div>
          )}
          {/* 图例 */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {assetData.map((d) => (
              <div key={d.key} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-secondary">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ background: ASSET_COLORS[d.key] }}
                  />
                  {d.name}
                </span>
                <span className="text-white font-mono">
                  {formatPercent(totalAsset > 0 ? (d.value / totalAsset) * 100 : 0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
