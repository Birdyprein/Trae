import { useEffect, useState } from 'react';
import { BarChart3, RefreshCw, AlertCircle } from 'lucide-react';
import type { PortfolioAnalysis as PortfolioAnalysisType } from '@/types';
import { fetchPortfolioAnalysis } from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import IndustryDistribution from './IndustryDistribution';
import HoldingsOverlap from './HoldingsOverlap';
import StyleExposure from './StyleExposure';

interface PortfolioAnalysisProps {
  fundIds: string[];
}

export default function PortfolioAnalysis({ fundIds }: PortfolioAnalysisProps) {
  const [data, setData] = useState<PortfolioAnalysisType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (ids: string[]) => {
    if (!ids || ids.length < 2) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPortfolioAnalysis(ids);
      if (result) {
        setData(result);
      } else {
        setError('分析数据加载失败');
      }
    } catch {
      setError('分析数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(fundIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundIds?.join(',')]);

  if (!fundIds || fundIds.length < 2) {
    return (
      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gold-400" />
          <h2 className="text-lg font-medium text-white">组合穿透分析</h2>
        </div>
        <div className="py-10 text-center">
          <AlertCircle className="w-10 h-10 text-muted mx-auto mb-3" />
          <p className="text-secondary text-sm">
            至少添加 2 只基金至自选列表，即可解锁组合穿透分析
          </p>
          <p className="text-muted text-xs mt-1">
            分析行业分布、重仓股重叠与风格暴露，优化投资组合
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gold-400" />
          <h2 className="text-lg font-medium text-white">组合穿透分析</h2>
          <span className="glass-badge">{fundIds.length} 只基金</span>
        </div>
        <button
          type="button"
          onClick={() => load(fundIds)}
          disabled={loading}
          className="glass-button inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-secondary disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </button>
      </div>

      {loading ? (
        <div className="py-20">
          <LoadingSpinner label="正在分析组合..." />
        </div>
      ) : error ? (
        <div className="py-10 text-center">
          <AlertCircle className="w-10 h-10 text-gain mx-auto mb-3" />
          <p className="text-secondary text-sm">{error}</p>
          <button
            type="button"
            onClick={() => load(fundIds)}
            className="glass-button-gold mt-4 px-4 py-1.5 text-xs"
          >
            重新加载
          </button>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <IndustryDistribution data={data.industryDistribution ?? []} />
          <HoldingsOverlap
            overlappedStocks={data.holdingsOverlap?.overlappedStocks ?? []}
            overlapRate={data.holdingsOverlap?.overlapRate ?? 0}
          />
          <StyleExposure
            styleExposure={data.styleExposure}
            portfolioRisk={data.portfolioRisk}
          />
        </div>
      ) : null}
    </div>
  );
}
