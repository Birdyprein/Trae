import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { NavPoint } from '@/types';
import { formatNumber } from '@/utils/formatters';

interface MarketTrendChartProps {
  data: NavPoint[];
  title: string;
  loading: boolean;
}

interface TooltipPayloadItem {
  value?: number;
}

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="glass-data-card px-3 py-2 text-xs">
      <div className="text-muted mb-1">{label ?? '--'}</div>
      <div className="text-gold-400 font-medium">
        {formatNumber(payload[0]?.value)}
      </div>
    </div>
  );
}

export default function MarketTrendChart({ data, title, loading }: MarketTrendChartProps) {
  return (
    <div className="glass-card p-4 sm:p-6 chart-fade-in">
      <h3 className="text-base font-medium mb-4">{title}</h3>
      <div className="h-[200px] sm:h-[300px] w-full">
        {loading ? (
          <div className="skeleton h-full w-full rounded-lg" />
        ) : !data || data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted text-sm">
            暂无数据
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 12, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.4)"
                fontSize={11}
                tickFormatter={(v: string) => (v ? String(v).slice(5) : '')}
                minTickGap={30}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                fontSize={11}
                domain={['auto', 'auto']}
                tickFormatter={(v: number) => formatNumber(v, 0)}
                width={48}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#D4A853"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#E5C068' }}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
