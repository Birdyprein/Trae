import { useState, useMemo, useCallback } from 'react';
import type { TooltipProps } from 'recharts';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { NavPoint, TimeRange } from '@/types';

interface Props {
  data: NavPoint[];
}

const ranges: { label: string; value: TimeRange }[] = [
  { label: '1月', value: '1m' },
  { label: '3月', value: '3m' },
  { label: '6月', value: '6m' },
  { label: '1年', value: '1y' },
  { label: '全部', value: 'all' },
];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-lg px-4 py-2.5 shadow-xl">
        <p className="text-xs text-muted mb-1">{label}</p>
        <p className="text-sm font-bold text-gold-400">{Number(payload[0].value).toFixed(4)}</p>
      </div>
    );
  }
  return null;
}

export default function NavChart({ data }: Props) {
  const [range, setRange] = useState<TimeRange>('1m');

  const filtered = useMemo(() => {
    const daysMap: Record<TimeRange, number> = { '1m': 30, '3m': 90, '6m': 180, '1y': 365, all: Infinity };
    return data.slice(-daysMap[range]);
  }, [data, range]);

  const { minVal, maxVal, padding } = useMemo(() => {
    if (filtered.length === 0) return { minVal: 0, maxVal: 1, padding: 0.1 };
    let min = Infinity;
    let max = -Infinity;
    for (const d of filtered) {
      if (d.value < min) min = d.value;
      if (d.value > max) max = d.value;
    }
    // 确保min和max有足够的差异
    if (max - min < 0.01) {
      min = min - 0.01;
      max = max + 0.01;
    }
    const pad = Math.max((max - min) * 0.1, 0.01);
    return { minVal: min, maxVal: max, padding: pad };
  }, [filtered]);

  const handleRangeChange = useCallback((value: TimeRange) => {
    setRange(value);
  }, []);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-bold text-white">净值走势</h3>
        <div className="flex gap-1">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => handleRangeChange(r.value)}
              className={`px-3 py-1 text-xs rounded-md transition-all duration-300 ${
                range === r.value
                  ? 'bg-gold-500 text-surface font-semibold'
                  : 'text-muted hover:text-white hover:bg-surface-hover'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      {filtered.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={filtered} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748B', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minVal - padding, maxVal + padding]}
              tick={{ fill: '#64748B', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => v.toFixed(2)}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#D4A853"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#D4A853', stroke: '#0A0E17', strokeWidth: 2 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-80 text-muted text-sm">暂无数据</div>
      )}
    </div>
  );
}