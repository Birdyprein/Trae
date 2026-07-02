import { useState } from 'react';
import { Save, Trash2, FolderOpen, RotateCcw, X } from 'lucide-react';
import { useFilterStore } from '@/stores/filterStore';

interface SliderRowProps {
  label: string;
  value: number | undefined;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number | undefined) => void;
}

function SliderRow({ label, value, min, max, step, unit, onChange }: SliderRowProps) {
  const v = value ?? min;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-secondary">{label}</span>
        <span className="text-xs text-gold-300 font-mono">
          {value === undefined ? '不限' : `${v}${unit ?? ''}`}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={v}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-gold-400"
        />
        <button
          onClick={() => onChange(undefined)}
          className="text-xs text-muted hover:text-white transition-colors shrink-0"
          title="清除"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

export default function FundAdvancedFilter() {
  const {
    advanced,
    setAdvanced,
    resetAdvanced,
    savedSchemes,
    saveScheme,
    loadScheme,
    deleteScheme,
  } = useFilterStore();

  const [schemeName, setSchemeName] = useState('');
  const [showSchemeList, setShowSchemeList] = useState(false);

  const handleSave = () => {
    const name = schemeName.trim();
    if (!name) return;
    saveScheme(name);
    setSchemeName('');
  };

  return (
    <div className="glass-data-card p-4 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">多因子高级筛选</h3>
        <button
          onClick={resetAdvanced}
          className="flex items-center gap-1 text-xs text-muted hover:text-white transition-colors"
        >
          <RotateCcw size={12} />
          重置
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <SliderRow
          label="近1年收益 ≥"
          value={advanced.minYear1Return}
          min={-50}
          max={100}
          step={1}
          unit="%"
          onChange={(v) => setAdvanced({ minYear1Return: v })}
        />
        <SliderRow
          label="最大回撤 ≤"
          value={advanced.maxDrawdown === undefined ? undefined : Math.abs(advanced.maxDrawdown)}
          min={0}
          max={60}
          step={1}
          unit="%"
          onChange={(v) => setAdvanced({ maxDrawdown: v === undefined ? undefined : -v })}
        />
        <SliderRow
          label="波动率 ≤"
          value={advanced.maxVolatility}
          min={0}
          max={60}
          step={1}
          unit="%"
          onChange={(v) => setAdvanced({ maxVolatility: v })}
        />
        <SliderRow
          label="夏普比率 ≥"
          value={advanced.minSharpeRatio}
          min={-3}
          max={5}
          step={0.1}
          onChange={(v) => setAdvanced({ minSharpeRatio: v })}
        />
        <SliderRow
          label="规模 ≥"
          value={advanced.minScale}
          min={0}
          max={500}
          step={5}
          unit="亿"
          onChange={(v) => setAdvanced({ minScale: v })}
        />
        <SliderRow
          label="成立年限 ≥"
          value={advanced.minEstablishYears}
          min={0}
          max={20}
          step={1}
          unit="年"
          onChange={(v) => setAdvanced({ minEstablishYears: v })}
        />
      </div>

      {/* 排除选项 */}
      <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-surface-divider">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={advanced.excludeNewFunds ?? false}
            onChange={(e) => setAdvanced({ excludeNewFunds: e.target.checked })}
            className="glass-input"
          />
          <span className="text-xs text-secondary">排除新基金（&lt;1年）</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={advanced.excludeSmallScale ?? false}
            onChange={(e) => setAdvanced({ excludeSmallScale: e.target.checked })}
            className="glass-input"
          />
          <span className="text-xs text-secondary">排除迷你基金（&lt;2亿）</span>
        </label>
      </div>

      {/* 保存/加载方案 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={schemeName}
            onChange={(e) => setSchemeName(e.target.value)}
            placeholder="输入方案名称"
            className="glass-input flex-1 px-3 py-1.5 text-xs"
            maxLength={20}
          />
          <button
            onClick={handleSave}
            disabled={!schemeName.trim()}
            className="glass-button-gold flex items-center gap-1 px-3 py-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save size={12} />
            保存
          </button>
          <button
            onClick={() => setShowSchemeList((v) => !v)}
            className="glass-button flex items-center gap-1 px-3 py-1.5 text-xs text-secondary"
          >
            <FolderOpen size={12} />
            方案
            {savedSchemes.length > 0 && (
              <span className="text-gold-300">{savedSchemes.length}</span>
            )}
          </button>
        </div>

        {showSchemeList && (
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {savedSchemes.length === 0 ? (
              <div className="text-xs text-muted py-2 text-center">暂无保存的方案</div>
            ) : (
              savedSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="flex items-center justify-between glass-button px-3 py-2"
                >
                  <button
                    onClick={() => {
                      loadScheme(scheme.id);
                      setShowSchemeList(false);
                    }}
                    className="flex-1 text-left min-w-0"
                  >
                    <div className="text-xs text-white truncate">{scheme.name}</div>
                    <div className="text-[10px] text-muted">
                      {scheme.createdAt.slice(0, 10)}
                    </div>
                  </button>
                  <button
                    onClick={() => deleteScheme(scheme.id)}
                    className="p-1 text-muted hover:text-gain transition-colors shrink-0"
                    title="删除方案"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
