import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Eye, EyeOff } from 'lucide-react';
import type { NavPoint, BenchmarkHistory } from '@/types';
import { formatNav } from '@/utils/formatters';

interface NavChartProps {
  fundNav: NavPoint[];
  benchmarks: BenchmarkHistory[];
  loading: boolean;
}

const BENCHMARK_COLORS = [
  'rgba(229, 192, 104, 0.6)',
  'rgba(96, 165, 250, 0.6)',
  'rgba(167, 139, 250, 0.6)',
  'rgba(244, 114, 182, 0.6)',
];

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  color?: string;
  dataKey?: string;
}

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="glass-data-card px-3 py-2 text-xs min-w-[120px]">
      <div className="text-muted mb-1.5">{label ?? '--'}</div>
      {payload.map((item, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: item.color }}
            />
            <span className="text-secondary">{item.name}</span>
          </span>
          <span className="text-white font-mono">{formatNav(item.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function NavChart({ fundNav, benchmarks, loading }: NavChartProps) {
  const [showBenchmarks, setShowBenchmarks] = useState<boolean>(true);
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  const merged = useMemo(() => {
    const map = new Map<string, Record<string, number | string>>();
    fundNav.forEach((p) => {
      const entry = map.get(p.date) ?? { date: p.date };
      entry.value = p.value;
      map.set(p.date, entry);
    });
    benchmarks.forEach((bh) => {
      bh.data.forEach((p) => {
        const entry = map.get(p.date) ?? { date: p.date };
        entry[bh.benchmark.code] = p.value;
        map.set(p.date, entry);
      });
    });
    return Array.from(map.values()).sort((a, b) =>
      String(a.date).localeCompare(String(b.date))
    );
  }, [fundNav, benchmarks]);

  const yDomain = useMemo<[number, number]>(() => {
    const values: number[] = [];
    fundNav.forEach((p) => values.push(p.value));
    if (showBenchmarks) {
      benchmarks.forEach((bh) => {
        if (!hidden[bh.benchmark.code]) {
          bh.data.forEach((p) => values.push(p.value));
        }
      });
    }
    if (values.length === 0) return [0, 1];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || max * 0.05 || 0.1;
    return [min - padding, max + padding];
  }, [fundNav, benchmarks, showBenchmarks, hidden]);

  const toggleBenchmark = (code: string) => {
    setHidden((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const hasData = fundNav.length > 0;

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-base font-medium">净值走势</h3>
        {benchmarks.length > 0 && (
          <button
            onClick={() => setShowBenchmarks((v) => !v)}
            className="glass-button flex items-center gap-1.5 px-2.5 py-1 text-xs text-secondary"
          >
            {showBenchmarks ? <Eye size={14} /> : <EyeOff size={14} />}
            基准对比
          </button>
        )}
      </div>

      {/* 基准切换 chips */}
      {showBenchmarks && benchmarks.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {benchmarks.map((bh, i) => {
            const isHidden = hidden[bh.benchmark.code];
            const color = BENCHMARK_COLORS[i % BENCHMARK_COLORS.length];
            return (
              <button
                key={bh.benchmark.code}
                onClick={() => toggleBenchmark(bh.benchmark.code)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-all ${
                  isHidden ? 'text-muted opacity-50' : 'text-secondary'
                }`}
                style={{
                  background: isHidden ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span
                  className="inline-block w-3 h-0.5"
                  style={{
                    background: isHidden ? 'rgba(255,255,255,0.2)' : color,
                  }}
                />
                {bh.benchmark.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="h-[260px] sm:h-[360px] w-full">
        {loading ? (
          <div className="skeleton h-full w-full rounded-lg" />
        ) : !hasData ? (
          <div className="flex items-center justify-center h-full text-muted text-sm">
            暂无净值数据
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={merged} margin={{ top: 5, right: 12, left: 0, bottom: 5 }}>
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
                domain={yDomain}
                tickFormatter={(v: number) => formatNav(v)}
                width={56}
              />
              <Tooltip content={<ChartTooltip />} />
              {showBenchmarks && benchmarks.length > 0 && (
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value: string) => <span className="text-secondary">{value}</span>}
                />
              )}
              <Line
                type="monotone"
                dataKey="value"
                name="单位净值"
                stroke="#D4A853"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: '#E5C068' }}
                connectNulls
                isAnimationActive
              />
              {showBenchmarks &&
                benchmarks.map((bh, i) =>
                  hidden[bh.benchmark.code] ? null : (
                    <Line
                      key={bh.benchmark.code}
                      type="monotone"
                      dataKey={bh.benchmark.code}
                      name={bh.benchmark.name}
                      stroke={BENCHMARK_COLORS[i % BENCHMARK_COLORS.length]}
                      strokeWidth={1.5}
                      strokeDasharray="5 4"
                      dot={false}
                      connectNulls
                      isAnimationActive
                    />
                  )
                )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
