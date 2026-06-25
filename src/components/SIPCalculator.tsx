import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Info } from 'lucide-react';

interface SIPCalculatorProps {
  onClose: () => void;
}

export default function SIPCalculator({ onClose }: SIPCalculatorProps) {
  const [monthlyInvestment, setMonthlyInvestment] = useState(1000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(5);
  const [showResult, setShowResult] = useState(false);

  const results = useMemo(() => {
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;

    // Future Value of annuity formula
    const futureValue = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    const totalInvested = monthlyInvestment * months;
    const totalReturn = futureValue - totalInvested;

    return {
      totalInvested: Math.round(totalInvested),
      futureValue: Math.round(futureValue),
      totalReturn: Math.round(totalReturn),
      monthlyRate: (annualReturn / 12).toFixed(2),
    };
  }, [monthlyInvestment, annualReturn, years]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6" />
              <h2 className="text-xl font-bold">定投收益计算器</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Monthly Investment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              每月定投金额（元）
            </label>
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => {
                setMonthlyInvestment(Number(e.target.value));
                setShowResult(true);
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="100"
              max="100000"
            />
            <div className="flex gap-2 mt-2">
              {[500, 1000, 2000, 5000].map(amount => (
                <button
                  key={amount}
                  onClick={() => {
                    setMonthlyInvestment(amount);
                    setShowResult(true);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    monthlyInvestment === amount
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {amount}元
                </button>
              ))}
            </div>
          </div>

          {/* Annual Return */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              预期年化收益率（%）
            </label>
            <input
              type="range"
              value={annualReturn}
              onChange={(e) => {
                setAnnualReturn(Number(e.target.value));
                setShowResult(true);
              }}
              className="w-full accent-green-600"
              min="0"
              max="30"
              step="1"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>0%</span>
              <span className="text-green-600 font-semibold text-lg">{annualReturn}%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Years */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              定投时长（年）
            </label>
            <input
              type="range"
              value={years}
              onChange={(e) => {
                setYears(Number(e.target.value));
                setShowResult(true);
              }}
              className="w-full accent-green-600"
              min="1"
              max="30"
              step="1"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>1年</span>
              <span className="text-green-600 font-semibold text-lg">{years}年</span>
              <span>30年</span>
            </div>
          </div>

          {/* Result */}
          {showResult && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 space-y-4 animate-fade-in">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                计算结果
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">累计投入</div>
                  <div className="text-xl font-bold text-gray-800">
                    ¥{results.totalInvested.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">预期总收益</div>
                  <div className="text-xl font-bold text-green-600">
                    ¥{results.totalReturn.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-sm text-gray-500 mb-1">预期总资产</div>
                <div className="text-3xl font-bold text-green-600">
                  ¥{results.futureValue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {years}年共{years * 12}个月
                </div>
              </div>

              <div className="text-sm text-gray-500 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  以上结果仅供参考，实际收益会因市场波动、基金业绩、申赎费用等因素而有所不同。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={() => setShowResult(true)}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-colors"
          >
            计算收益
          </button>
        </div>
      </div>
    </div>
  );
}
