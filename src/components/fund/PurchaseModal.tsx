import { useState, useMemo } from 'react';
import { ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';
import GlassModal from '@/components/glass/GlassModal';
import type { FundDetail } from '@/types';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { formatNav, safeNumber } from '@/utils/formatters';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  fund: FundDetail;
}

export default function PurchaseModal({ isOpen, onClose, fund }: PurchaseModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');
  const addHolding = usePortfolioStore((s) => s.addHolding);

  const nav = fund.nav;
  const purchaseFee = safeNumber(fund.fees?.purchaseFee, 0.15);
  const amountNum = parseFloat(amount) || 0;

  const estimated = useMemo(() => {
    if (!amountNum || amountNum <= 0 || !nav) return null;
    const fee = amountNum * purchaseFee / 100;
    const netAmount = amountNum - fee;
    const shares = netAmount / nav;
    return { fee, netAmount, shares };
  }, [amountNum, nav, purchaseFee]);

  const handleNext = () => {
    if (!amountNum || amountNum <= 0) return;
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (!estimated) return;
    const today = new Date().toISOString().slice(0, 10);
    addHolding({
      code: fund.code,
      name: fund.name,
      shares: estimated.shares,
      avgCost: nav,
      buyDate: today,
    });
    setStep('success');
  };

  const handleClose = () => {
    setAmount('');
    setStep('input');
    onClose();
  };

  const reset = () => {
    setAmount('');
    setStep('input');
  };

  return (
    <GlassModal isOpen={isOpen} onClose={handleClose} title="购买基金" maxWidth="max-w-md">
      {step === 'input' && (
        <div className="space-y-4">
          {/* 基金信息 */}
          <div className="glass-card-inner p-3 rounded-lg space-y-1.5">
            <div className="text-white font-medium text-sm">{fund.name}</div>
            <div className="text-xs text-secondary">{fund.code}</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary">当前净值</span>
              <span className="text-white font-mono font-bold">{formatNav(nav)}</span>
            </div>
          </div>

          {/* 金额输入 */}
          <div>
            <label className="text-xs text-secondary block mb-1.5">购买金额（元）</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">¥</span>
              <input
                type="number"
                min="1"
                step="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="最低 1 元起购"
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold-400/50 transition-colors"
              />
            </div>
            {/* 快捷金额 */}
            <div className="flex gap-2 mt-2">
              {[100, 1000, 5000, 10000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(String(v))}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    amount === String(v)
                      ? 'glass-button-gold'
                      : 'glass-button text-secondary hover:text-white'
                  }`}
                >
                  {v >= 10000 ? `${v / 10000}万` : v}
                </button>
              ))}
            </div>
          </div>

          {/* 费用预估 */}
          {estimated && (
            <div className="glass-card-inner p-3 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-secondary">申购费率</span>
                <span className="text-white">{purchaseFee}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">申购费用</span>
                <span className="text-white">¥{estimated.fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">净申购金额</span>
                <span className="text-white">¥{estimated.netAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span className="text-secondary">预计份额</span>
                <span className="text-gold-300 font-bold">
                  {estimated.shares.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 份
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={!amountNum || amountNum <= 0}
            className="glass-button-gold w-full py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            下一步
          </button>
        </div>
      )}

      {step === 'confirm' && estimated && (
        <div className="space-y-4">
          <div className="glass-card-inner p-4 rounded-lg space-y-3">
            <h4 className="text-white text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-gold-400" />
              确认购买信息
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">基金名称</span>
                <span className="text-white">{fund.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">基金代码</span>
                <span className="text-white font-mono">{fund.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">当前净值</span>
                <span className="text-white font-mono">{formatNav(nav)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">购买金额</span>
                <span className="text-white">¥{amountNum.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">申购费率</span>
                <span className="text-white">{purchaseFee}%</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span className="text-secondary">预计份额</span>
                <span className="text-gold-300 font-bold">
                  {estimated.shares.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 份
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="glass-button flex-1 py-2.5 text-sm text-secondary hover:text-white"
            >
              返回修改
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="glass-button-gold flex-1 py-2.5 text-sm font-medium"
            >
              确认购买
            </button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center space-y-4 py-4">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
          <div>
            <h4 className="text-white text-lg font-medium">购买成功！</h4>
            <p className="text-secondary text-sm mt-1">
              已成功购买 {fund.name}，持仓已自动更新
            </p>
          </div>
          <div className="glass-card-inner p-3 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary">购买金额</span>
              <span className="text-white">¥{amountNum.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">获得份额</span>
              <span className="text-gold-300 font-bold">
                {estimated?.shares.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 份
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="glass-button-gold w-full py-2.5 text-sm font-medium"
          >
            完成
          </button>
        </div>
      )}
    </GlassModal>
  );
}