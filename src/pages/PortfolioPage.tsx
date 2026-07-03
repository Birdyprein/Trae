import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Trash2, PlusCircle, ShoppingCart } from 'lucide-react';
import type { Fund } from '@/types';
import { fetchFundDetail } from '@/services/api';
import { usePortfolioStore } from '@/stores/portfolioStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import ComplianceNotice from '@/components/common/ComplianceNotice';
import PurchaseModal from '@/components/fund/PurchaseModal';

interface PortfolioFund extends Fund {
  shares: number;
  avgCost: number;
  buyDate: string;
  currentValue: number;
  profit: number;
  profitRate: number;
}

export default function PortfolioPage() {
  const { holdings, removeHolding, clearHoldings } = usePortfolioStore();
  const [funds, setFunds] = useState<PortfolioFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseFund, setPurchaseFund] = useState<PortfolioFund | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!holdings || holdings.length === 0) {
        setFunds([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const results = await Promise.all(
        holdings.map(async (h) => {
          const fund = await fetchFundDetail(h.code).catch(() => null);
          if (!fund) return null;
          const currentValue = h.shares * fund.nav;
          const costValue = h.shares * h.avgCost;
          const profit = currentValue - costValue;
          const profitRate = costValue > 0 ? (profit / costValue) * 100 : 0;
          return {
            ...fund,
            shares: h.shares,
            avgCost: h.avgCost,
            buyDate: h.buyDate,
            currentValue,
            profit,
            profitRate,
          };
        })
      );
      if (cancelled) return;
      setFunds(results.filter((r): r is PortfolioFund => r !== null));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [holdings]);

  const totalValue = funds.reduce((sum, f) => sum + f.currentValue, 0);
  const totalCost = funds.reduce((sum, f) => sum + f.shares * f.avgCost, 0);
  const totalProfit = totalValue - totalCost;
  const totalProfitRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  const hasFunds = funds.length > 0;

  return (
    <div className="section-container section-padding space-y-5">
      {/* 头部 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-gold-400" />
            我的持仓
          </h1>
          <p className="text-secondary text-sm mt-1">
            跟踪基金持仓，实时计算盈亏
          </p>
        </div>
        {hasFunds && (
          <button
            onClick={clearHoldings}
            className="glass-button px-3 py-1.5 text-sm text-red-400 hover:text-red-300"
          >
            清空持仓
          </button>
        )}
      </div>

      {/* 汇总卡片 */}
      {hasFunds && (
        <div className="glass-card p-4 sm:p-5 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-secondary text-xs mb-1">总市值</div>
              <div className="text-white text-lg font-bold">
                ¥{totalValue.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div className="text-secondary text-xs mb-1">总成本</div>
              <div className="text-white text-lg font-bold">
                ¥{totalCost.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div className="text-secondary text-xs mb-1">总盈亏</div>
              <div className={`text-lg font-bold ${totalProfit >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                {totalProfit >= 0 ? '+' : ''}¥{totalProfit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div className="text-secondary text-xs mb-1">收益率</div>
              <div className={`text-lg font-bold ${totalProfitRate >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                {totalProfitRate >= 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : !hasFunds ? (
        <>
          <EmptyState
            icon={<Briefcase className="w-10 h-10 text-secondary" />}
            title="暂无持仓"
            description="从基金列表或详情页添加基金到持仓，跟踪投资收益"
          />
          <div className="flex justify-center -mt-3">
            <Link
              to="/funds"
              className="glass-button-gold inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              购买基金
            </Link>
          </div>
        </>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-secondary font-medium">基金信息</th>
                  <th className="text-right p-3 text-secondary font-medium">持有份额</th>
                  <th className="text-right p-3 text-secondary font-medium">成本净值</th>
                  <th className="text-right p-3 text-secondary font-medium">当前净值</th>
                  <th className="text-right p-3 text-secondary font-medium">市值</th>
                  <th className="text-right p-3 text-secondary font-medium">盈亏</th>
                  <th className="text-right p-3 text-secondary font-medium">收益率</th>
                  <th className="text-center p-3 text-secondary font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((fund) => (
                  <tr
                    key={fund.code}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-3">
                      <Link
                        to={`/funds/${fund.code}`}
                        className="flex items-center gap-2 group"
                      >
                        <div>
                          <div className="text-white group-hover:text-gold-300 transition-colors">
                            {fund.name}
                          </div>
                          <div className="text-xs text-secondary">{fund.code}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="text-right p-3 text-white">
                      {fund.shares.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="text-right p-3 text-white">
                      {fund.avgCost.toFixed(4)}
                    </td>
                    <td className="text-right p-3 text-white">
                      {fund.nav.toFixed(4)}
                    </td>
                    <td className="text-right p-3 text-white">
                      ¥{fund.currentValue.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`text-right p-3 ${fund.profit >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {fund.profit >= 0 ? '+' : ''}¥{fund.profit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`text-right p-3 ${fund.profitRate >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {fund.profitRate >= 0 ? '+' : ''}{fund.profitRate.toFixed(2)}%
                    </td>
                    <td className="text-center p-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setPurchaseFund(fund)}
                          className="glass-button p-1.5 text-secondary hover:text-gold-400"
                          title="加仓"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeHolding(fund.code)}
                          className="glass-button p-1.5 text-secondary hover:text-red-400"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ComplianceNotice />

      <PurchaseModal
        isOpen={purchaseFund !== null}
        onClose={() => setPurchaseFund(null)}
        fund={purchaseFund ?? { name: '', code: '', nav: 0 }}
      />
    </div>
  );
}
