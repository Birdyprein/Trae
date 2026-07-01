import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Info, X, AlertTriangle } from 'lucide-react';

interface SIPCalculatorProps {
  onClose: () => void;
}

export default function SIPCalculator({ onClose }: SIPCalculatorProps) {
  const [monthlyInvestment, setMonthlyInvestment] = useState(1000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(5);
  const [showResult, setShowResult] = useState(false);
  const [errors, setErrors] = useState<{ monthly?: string; return?: string; years?: string }>({});

  // 验证输入
  const validateInputs = () => {
    const newErrors: { monthly?: string; return?: string; years?: string } = {};
    
    if (monthlyInvestment < 100) {
      newErrors.monthly = '最低定投金额为100元';
    } else if (monthlyInvestment > 100000) {
      newErrors.monthly = '最高定投金额为10万元';
    }
    
    if (annualReturn < 0) {
      newErrors.return = '收益率不能为负数';
    } else if (annualReturn > 50) {
      newErrors.return = '收益率设置过高，请理性投资';
    }
    
    if (years < 1) {
      newErrors.years = '定投时长至少1年';
    } else if (years > 40) {
      newErrors.years = '定投时长最长40年';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const results = useMemo(() => {
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;

    // Future Value of annuity formula
    // FV = P × [(1 + r)^n - 1] / r
    const futureValue = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    const totalInvested = monthlyInvestment * months;
    const totalReturn = futureValue - totalInvested;
    const returnRate = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    return {
      totalInvested: Math.round(totalInvested),
      futureValue: Math.round(futureValue),
      totalReturn: Math.round(totalReturn),
      returnRate: returnRate.toFixed(2),
      months,
    };
  }, [monthlyInvestment, annualReturn, years]);

  const handleCalculate = () => {
    if (validateInputs()) {
      setShowResult(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="glass-card w-full max-w-md sm:max-w-lg md:max-w-xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white p-4 sm:p-5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
              <h2 className="text-lg sm:text-xl font-bold">定投收益计算器</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="关闭"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Monthly Investment */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              每月定投金额（元）
            </label>
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => {
                setMonthlyInvestment(Number(e.target.value));
                setShowResult(false);
              }}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-hover border rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white ${
                errors.monthly ? 'border-red-500' : 'border-surface-border'
              }`}
              min="100"
              max="100000"
              step="100"
            />
            {errors.monthly && (
              <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.monthly}
              </div>
            )}
            <div className="flex gap-2 mt-2 flex-wrap">
              {[500, 1000, 2000, 5000].map(amount => (
                <button
                  key={amount}
                  onClick={() => {
                    setMonthlyInvestment(amount);
                    setShowResult(false);
                    setErrors({});
                  }}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition-colors ${
                    monthlyInvestment === amount
                      ? 'bg-gold-500 text-white'
                      : 'bg-surface-hover text-muted hover:bg-surface-border hover:text-white'
                  }`}
                >
                  {amount}元
                </button>
              ))}
            </div>
          </div>

          {/* Annual Return */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              预期年化收益率（%）
            </label>
            <input
              type="range"
              value={annualReturn}
              onChange={(e) => {
                setAnnualReturn(Number(e.target.value));
                setShowResult(false);
              }}
              className="w-full accent-gold-500 h-2"
              min="0"
              max="30"
              step="0.5"
            />
            <div className="flex justify-between text-xs sm:text-sm text-muted mt-1">
              <span>0%</span>
              <span className="text-gold-400 font-semibold text-base sm:text-lg">{annualReturn}%</span>
              <span>30%</span>
            </div>
            {annualReturn > 20 && (
              <div className="text-amber-400 text-xs mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                高收益率伴随高风险，请理性预期
              </div>
            )}
          </div>

          {/* Years */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              定投时长（年）
            </label>
            <input
              type="range"
              value={years}
              onChange={(e) => {
                setYears(Number(e.target.value));
                setShowResult(false);
              }}
              className="w-full accent-gold-500 h-2"
              min="1"
              max="30"
              step="1"
            />
            <div className="flex justify-between text-xs sm:text-sm text-muted mt-1">
              <span>1年</span>
              <span className="text-gold-400 font-semibold text-base sm:text-lg">{years}年</span>
              <span>30年</span>
            </div>
          </div>

          {/* Result */}
          {showResult && Object.keys(errors).length === 0 && (
            <div className="bg-gold-500/10 border border-gold-500/20 rounded-2xl p-4 sm:p-5 space-y-3 sm:space-y-4 animate-fade-in">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
                计算结果
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-surface-card rounded-xl p-3 sm:p-4 border border-surface-border">
                  <div className="text-xs sm:text-sm text-muted mb-1">累计投入</div>
                  <div className="text-lg sm:text-xl font-bold text-white">
                    ¥{results.totalInvested.toLocaleString()}
                  </div>
                </div>

                <div className="bg-surface-card rounded-xl p-3 sm:p-4 border border-surface-border">
                  <div className="text-xs sm:text-sm text-muted mb-1">预期总收益</div>
                  <div className="text-lg sm:text-xl font-bold text-gold-400">
                    ¥{results.totalReturn.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-surface-card rounded-xl p-3 sm:p-4 border border-surface-border">
                <div className="text-xs sm:text-sm text-muted mb-1">预期总资产</div>
                <div className="text-2xl sm:text-3xl font-bold text-gold-400">
                  ¥{results.futureValue.toLocaleString()}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs sm:text-sm text-muted">
                    {years}年共{results.months}个月
                  </div>
                  <div className="text-xs sm:text-sm text-gold-400">
                    收益率: {results.returnRate}%
                  </div>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-muted flex items-start gap-2">
                <Info className="w-3 h-4 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                <p>
                  以上结果仅供参考，实际收益会因市场波动、基金业绩、申赎费用等因素而有所不同。历史业绩不代表未来表现。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <button
            onClick={handleCalculate}
            className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-xl font-semibold hover:from-gold-600 hover:to-gold-700 transition-colors shadow-lg"
          >
            计算收益
          </button>
        </div>
      </div>
    </div>
  );
}