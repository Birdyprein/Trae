import { useEffect, useState } from 'react';
import { fetchSectors } from '@/services/api';
import type { Sector } from '@/types';
import { formatPercent, formatVolume, getChangeColor } from '@/utils/formatters';

export default function SectorBoard() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const data = await fetchSectors();
      if (active) {
        setSectors(data);
        setLoading(false);
      }
    };
    load();
    const timer = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const gainers = sectors.filter((s) => (s.change ?? 0) > 0).sort((a, b) => (b.change ?? 0) - (a.change ?? 0));
  const losers = sectors.filter((s) => (s.change ?? 0) < 0).sort((a, b) => (a.change ?? 0) - (b.change ?? 0));

  const renderSector = (sector: Sector) => {
    const color = getChangeColor(sector.change);
    return (
      <div
        key={sector.code}
        className="flex items-center justify-between px-3 py-2 rounded-lg"
        style={{
          background:
            (sector.change ?? 0) > 0
              ? 'rgba(239, 68, 68, 0.08)'
              : (sector.change ?? 0) < 0
              ? 'rgba(34, 197, 94, 0.08)'
              : 'rgba(255, 255, 255, 0.03)',
        }}
      >
        <div className="min-w-0 flex-1">
          <div className="text-sm text-white truncate">{sector.name}</div>
          <div className="text-xs text-muted">
            成交 {formatVolume(sector.volume)}
            {sector.leadingStock ? ` · 领涨 ${sector.leadingStock}` : ''}
          </div>
        </div>
        <div className="text-right ml-2">
          <div className={`text-sm font-medium ${color}`}>{formatPercent(sector.change)}</div>
          {sector.leadingStockChange !== undefined && (
            <div className={`text-xs ${getChangeColor(sector.leadingStockChange)}`}>
              {formatPercent(sector.leadingStockChange)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium">热门板块</h3>
        <span className="text-xs text-muted">每30秒刷新</span>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : sectors.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-muted text-sm">
          暂无数据
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs text-gain">
              <span>▲</span>
              <span>涨幅榜 · {gainers.length}</span>
            </div>
            <div className="space-y-1.5">
              {gainers.length === 0 ? (
                <div className="text-xs text-muted py-4 text-center">无上涨板块</div>
              ) : (
                gainers.map(renderSector)
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs text-loss">
              <span>▼</span>
              <span>跌幅榜 · {losers.length}</span>
            </div>
            <div className="space-y-1.5">
              {losers.length === 0 ? (
                <div className="text-xs text-muted py-4 text-center">无下跌板块</div>
              ) : (
                losers.map(renderSector)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
