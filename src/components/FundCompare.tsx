import { useState } from 'react';
import { X, Plus, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import type { Fund } from '@/types';

interface FundCompareProps {
  funds: Fund[];
  onClose: () => void;
}

export default function FundCompare({ funds, onClose }: FundCompareProps) {
  const [selectedFunds, setSelectedFunds] = useState<Fund[]>([]);
  const [compareFunds, setCompareFunds] = useState<Fund[]>([]);

  const toggleFund = (fund: Fund) => {
    if (compareFunds.find(f => f.code === fund.code)) {
      setCompareFunds(compareFunds.filter(f => f.code !== fund.code));
    } else if (compareFunds.length < 4) {
      setCompareFunds([...compareFunds, fund]);
    }
  };

  const removeFund = (code: string) => {
    setCompareFunds(compareFunds.filter(f => f.code !== code));
  };

  const compareMetrics = [
    { label: '基金名称', key: 'name', render: (f: Fund) => f.name },
    { label: '基金代码', key: 'code', render: (f: Fund) => f.code },
    { label: '基金类型', key: 'type', render: (f: Fund) => f.type },
    { label: '单位净值', key: 'nav', render: (f: Fund) => f.nav?.toFixed(4) || '-' },
    { label: '累计净值', key: 'accumulatedNav', render: (f: Fund) => f.accumulatedNav?.toFixed(4) || '-' },
    { label: '日涨跌幅', key: 'dailyChange', render: (f: Fund) => (
      <span className={f.dailyChange >= 0 ? 'text-red-500' : 'text-green-500'}>
        {f.dailyChange >= 0 ? '+' : ''}{f.dailyChange?.toFixed(2)}%
      </span>
    )},
    { label: '近1月', key: 'month1', render: (f: Fund) => (
      <span className={getReturnColor(f.month1)}>
        {f.month1 !== undefined ? `${f.month1 >= 0 ? '+' : ''}${f.month1.toFixed(2)}%` : '-'}
      </span>
    )},
    { label: '近3月', key: 'month3', render: (f: Fund) => (
      <span className={getReturnColor(f.month3)}>
        {f.month3 !== undefined ? `${f.month3 >= 0 ? '+' : ''}${f.month3.toFixed(2)}%` : '-'}
      </span>
    )},
    { label: '近6月', key: 'month6', render: (f: Fund) => (
      <span className={getReturnColor(f.month6)}>
        {f.month6 !== undefined ? `${f.month6 >= 0 ? '+' : ''}${f.month6.toFixed(2)}%` : '-'}
      </span>
    )},
    { label: '近1年', key: 'yearlyReturn', render: (f: Fund) => (
      <span className={getReturnColor(f.yearlyReturn)}>
        {f.yearlyReturn !== undefined ? `${f.yearlyReturn >= 0 ? '+' : ''}${f.yearlyReturn.toFixed(2)}%` : '-'}
      </span>
    )},
    { label: '今年来', key: 'ytd', render: (f: Fund) => (
      <span className={getReturnColor(f.ytd)}>
        {f.ytd !== undefined ? `${f.ytd >= 0 ? '+' : ''}${f.ytd.toFixed(2)}%` : '-'}
      </span>
    )},
    { label: '成立来', key: 'totalReturn', render: (f: Fund) => (
      <span className={getReturnColor(f.totalReturn)}>
        {f.totalReturn !== undefined ? `${f.totalReturn >= 0 ? '+' : ''}${f.totalReturn.toFixed(2)}%` : '-'}
      </span>
    )},
    { label: '基金经理', key: 'manager', render: (f: Fund) => f.manager || '-' },
    { label: '基金公司', key: 'company', render: (f: Fund) => f.company || '-' },
    { label: '规模', key: 'scale', render: (f: Fund) => f.scale || '-' },
    { label: '风险等级', key: 'riskLevel', render: (f: Fund) => f.riskLevel || '-' },
    { label: '申购状态', key: 'subscribe', render: (f: Fund) => f.subscribe || '-' },
    { label: '赎回状态', key: 'redeem', render: (f: Fund) => f.redeem || '-' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6" />
            <h2 className="text-xl font-bold">基金对比</h2>
            <span className="text-blue-200 text-sm">最多对比4只基金</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Fund Selection */}
          <div className="mb-6">
            <h3 className="text-gray-700 font-semibold mb-3">选择基金（点击添加到对比）</h3>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-lg">
              {funds.slice(0, 50).map(fund => (
                <button
                  key={fund.code}
                  onClick={() => toggleFund(fund)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    compareFunds.find(f => f.code === fund.code)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border hover:bg-blue-50'
                  }`}
                >
                  {fund.name}
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          {compareFunds.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3 font-semibold text-gray-700 sticky left-0 bg-gray-100">指标</th>
                    {compareFunds.map(fund => (
                      <th key={fund.code} className="p-3 min-w-[150px]">
                        <div className="relative">
                          <div className="font-semibold text-blue-600 truncate">{fund.name}</div>
                          <div className="text-xs text-gray-500">{fund.code}</div>
                          <button
                            onClick={() => removeFund(fund.code)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareMetrics.map((metric, index) => (
                    <tr key={metric.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 font-medium text-gray-700 sticky left-0 bg-inherit">{metric.label}</td>
                      {compareFunds.map(fund => (
                        <td key={fund.code} className="p-3 text-center">
                          {metric.render(fund)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Plus className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>请从上方选择基金进行对比</p>
              <p className="text-sm">最多可以同时对比4只基金</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="px-6 pb-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-500" />
            <span className="text-red-500">红色表示上涨</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-green-500" />
            <span className="text-green-500">绿色表示下跌</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getReturnColor(value: number | undefined): string {
  if (value === undefined) return 'text-gray-400';
  return value >= 0 ? 'text-red-500' : 'text-green-500';
}
