import { useState, useMemo, useEffect } from 'react';
import { Calculator, TrendingUp, Wallet, Coins, Percent } from 'lucide-react';
import GlassModal from '@/components/glass/GlassModal';
import { calcSIP } from '@/utils/calculations';
import { formatMoney, formatPercent, safeNumber } from '@/utils/formatters';
import { COMPLIANCE_NOTICE } from '@/constants';

interface SIPCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export default function SIPCalculator({ isOpen, onClose }: SIPCalculatorProps) {
  const [monthlyAmount, setMonthlyAmount] = useState(1000);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [years, setYears] = useState(10);

  // 每次打开弹窗时重置参数
  useEffect(() => {
    if (isOpen) {
      setMonthlyAmount(1000);
      setAnnualReturn(8);
      setYears(10);
    }
  }, [isOpen]);

  const result = useMemo(
    () => calcSIP(safeNumber(monthlyAmount), safeNumber(annualReturn), safeNumber(years)),
    [monthlyAmount, annualReturn, years]
  );

  const returnRateNum = safeNumber(parseFloat(result.returnRate));

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="定投计算器" maxWidth="max-w-2xl">
      <div className="space-y-5">
        {/* 输入区 */}
        <div className="space-y-5">
          {/* 每月定投金额 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-secondary text-sm flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-gold-400" />
                每月定投金额
              </label>
              <span className="text-gold-300 font-mono text-lg font-semibold">
                ¥{safeNumber(monthlyAmount).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setMonthlyAmount(amt)}
                  className={`glass-button px-3 py-1.5 text-xs ${
                    monthlyAmount === amt ? '!bg-gold-400/20 !border-gold-400/40 !text-gold-300' : ''
                  }`}
                >
                  ¥{amt.toLocaleString()}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={100}
              step={100}
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(Math.max(100, Number(e.target.value) || 0))}
              className="glass-input w-full px-3 py-2 text-sm"
              placeholder="请输入每月定投金额"
            />
          </div>

          {/* 预期年化收益率 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-secondary text-sm flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-gold-400" />
                预期年化收益率
              </label>
              <span className="text-gold-300 font-mono text-lg font-semibold">
                {formatPercent(safeNumber(annualReturn)).replace('+', '')}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={0.5}
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-full accent-gold-400"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>0%</span>
              <span>15%</span>
              <span>30%</span>
            </div>
          </div>

          {/* 定投时长 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-secondary text-sm flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-gold-400" />
                定投时长
              </label>
              <span className="text-gold-300 font-mono text-lg font-semibold">
                {safeNumber(years)} 年
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-gold-400"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>1 年</span>
              <span>15 年</span>
              <span>30 年</span>
            </div>
          </div>
        </div>

        {/* 结果区 */}
        <div className="glass-metric-box p-4 sm:p-5">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="w-4 h-4 text-gold-400" />
            <span className="text-secondary text-sm font-medium">计算结果</span>
          </div>

          {/* 主结果 - 总资产 */}
          <div className="text-center py-3 mb-3 border-b border-surface-divider">
            <div className="text-muted text-xs">预期总资产</div>
            <div className="text-3xl font-bold gradient-text-gold mt-1">
              {formatMoney(result.futureValue)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="glass-metric-box p-3 text-center">
              <div className="text-muted text-xs">累计投入</div>
              <div className="text-white text-sm sm:text-base font-mono mt-1">
                {formatMoney(result.totalInvested)}
              </div>
            </div>
            <div className="glass-metric-box p-3 text-center">
              <div className="text-muted text-xs">预期收益</div>
              <div className={`text-sm sm:text-base font-mono mt-1 ${returnRateNum >= 0 ? 'text-gain' : 'text-loss'}`}>
                {formatMoney(result.totalReturn)}
              </div>
            </div>
            <div className="glass-metric-box p-3 text-center">
              <div className="text-muted text-xs">收益率</div>
              <div className={`text-sm sm:text-base font-mono mt-1 ${returnRateNum >= 0 ? 'text-gain' : 'text-loss'}`}>
                {formatPercent(returnRateNum)}
              </div>
            </div>
          </div>
        </div>

        {/* 说明 */}
        <div className="flex items-start gap-2 text-xs text-muted">
          <Calculator className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>
            按「月定投复利」模型估算，假设每月等额投入且收益均匀再投资。实际收益受市场波动影响，{COMPLIANCE_NOTICE}
          </span>
        </div>

        {/* 关闭按钮 */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="glass-button-gold px-6 py-2 text-sm font-medium"
          >
            完成
          </button>
        </div>
      </div>
    </GlassModal>
  );
}
