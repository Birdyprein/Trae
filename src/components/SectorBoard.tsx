import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface SectorData {
  name: string;
  code: string;
  change: number;
  volume: string;
}

export default function SectorBoard() {
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSectorData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/market/sectors');
      const data = await res.json();
      if (data.success) {
        setSectors(data.data);
      } else {
        generateMockSectors();
      }
    } catch {
      generateMockSectors();
    }
    setLoading(false);
  }, []);

  // 生成随机波动的模拟数据
  const generateMockSectors = () => {
    const baseSectors = [
      { name: '半导体', code: 'BK0425' },
      { name: '人工智能', code: 'BK0854' },
      { name: '新能源汽车', code: 'BK0741' },
      { name: '医药生物', code: 'BK0465' },
      { name: '白酒', code: 'BK0367' },
      { name: '银行', code: 'BK0404' },
      { name: '房地产', code: 'BK0363' },
      { name: '煤炭', code: 'BK0419' },
      { name: '光伏', code: 'BK0532' },
      { name: '芯片', code: 'BK0548' },
      { name: '5G通信', code: 'BK0610' },
      { name: '云计算', code: 'BK0578' },
    ];
    const mockData = baseSectors.map(s => {
      const change = (Math.random() - 0.5) * 8;
      const volume = (Math.random() * 400 + 50).toFixed(1);
      return {
        name: s.name,
        code: s.code,
        change: Math.round(change * 100) / 100,
        volume: `${volume}亿`,
      };
    });
    setSectors(mockData);
  };

  useEffect(() => {
    fetchSectorData();
  }, [fetchSectorData]);

  // 每30秒自动刷新一次
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSectorData();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchSectorData]);

  const sortedSectors = [...sectors].sort((a, b) => b.change - a.change);
  const risingSectors = sortedSectors.filter(s => s.change >= 0).slice(0, 4);
  const fallingSectors = sortedSectors.filter(s => s.change < 0).slice(-4);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">热门板块</h3>
        <button
          onClick={fetchSectorData}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Rising Sectors */}
            {risingSectors.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-medium text-red-500">涨幅板块</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {risingSectors.map(sector => (
                    <div
                      key={sector.code}
                      className="p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-800 text-sm">{sector.name}</span>
                        <span className="text-red-500 font-semibold text-sm">
                          +{sector.change.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">成交 {sector.volume}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Falling Sectors */}
            {fallingSectors.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-medium text-green-500">跌幅板块</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {fallingSectors.map(sector => (
                    <div
                      key={sector.code}
                      className="p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-800 text-sm">{sector.name}</span>
                        <span className="text-green-500 font-semibold text-sm">
                          {sector.change.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">成交 {sector.volume}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
