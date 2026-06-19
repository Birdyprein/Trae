import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, BarChart3, Shield } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { marketIndices, marketTrendData, funds } from '@/data/mockData';
import MarketIndexCard from '@/components/MarketIndexCard';
import FundCard from '@/components/FundCard';

function useCountUp(end: number, duration: number = 2000) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const startTime = performance.now();
            const animate = (time: number) => {
              const elapsed = time - startTime;
              const progress = Math.min(elapsed / duration, 1);
              setVal(Math.round(end * progress));
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { val, ref };
}

function StatItem({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const { val, ref } = useCountUp(value);
  return (
    <div className="text-center">
      <span ref={ref} className="text-3xl lg:text-4xl font-bold font-display text-white">
        {val.toLocaleString()}{suffix}
      </span>
      <p className="text-sm text-muted mt-2">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const featuredFunds = funds.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,168,83,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-on-scroll">
              智慧投资，<span className="text-gradient">稳健未来</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 animate-on-scroll stagger-1">
              汇聚优质基金产品，以专业数据驱动投资决策，让每一份资产都焕发价值
            </p>
            <div className="flex items-center justify-center gap-4 animate-on-scroll stagger-2">
              <Link to="/funds" className="btn-primary inline-flex items-center gap-2">
                浏览基金 <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#overview" className="btn-outline">
                了解更多
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-on-scroll stagger-3">
            <StatItem label="基金总数" value={funds.length} suffix="+" />
            <StatItem label="累计规模" value={3860} suffix="亿" />
            <StatItem label="年化收益TOP1" value={25} suffix="%" />
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section id="overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-6 h-6 text-gold-400" />
          <h2 className="font-display text-2xl font-bold text-white">市场概览</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {marketIndices.map((index, i) => (
            <MarketIndexCard key={index.code} data={index} index={i} />
          ))}
        </div>
      </section>

      {/* Market Trend */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-6 h-6 text-gold-400" />
          <h2 className="font-display text-2xl font-bold text-white">市场趋势</h2>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm text-muted mb-4">上证指数 · 近30日走势</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={marketTrendData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #1E293B',
                  borderRadius: '8px',
                  color: '#D4A853',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#D4A853"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#D4A853', stroke: '#0A0E17', strokeWidth: 2 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Featured Funds */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-gold-400" />
            <h2 className="font-display text-2xl font-bold text-white">精选基金</h2>
          </div>
          <Link
            to="/funds"
            className="text-sm text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1"
          >
            查看全部 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredFunds.map((fund, i) => (
            <FundCard key={fund.id} fund={fund} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}