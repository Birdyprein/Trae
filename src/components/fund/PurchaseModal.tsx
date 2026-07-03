import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  ShieldAlert,
  Clock,
  ArrowRight,
} from 'lucide-react';
import GlassModal from '@/components/glass/GlassModal';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { formatNav, safeNumber } from '@/utils/formatters';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  fund: { name: string; code: string; nav: number; fees?: { purchaseFee?: number } };
}

type Step = 'input' | 'risk' | 'confirm' | 'success';

export default function PurchaseModal({ isOpen, onClose, fund }: PurchaseModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [step, setStep] = useState<Step>('input');
  const [agreed, setAgreed] = useState(false);
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

  const handleInputNext = () => {
    if (!amountNum || amountNum <= 0) return;
    setStep('risk');
  };

  const handleRiskNext = () => {
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
    setAgreed(false);
    setStep('input');
    onClose();
  };

  const reset = () => {
    setStep('input');
  };

  const stepTitles: Record<Step, string> = {
    input: '输入金额',
    risk: '风险提示',
    confirm: '确认订单',
    success: '购买成功',
  };

  const stepIndex = (['input', 'risk', 'confirm', 'success'] as Step[]).indexOf(step);

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'success' ? '购买成功' : `购买基金`}
      maxWidth="max-w-md"
    >
      {/* 步骤指示器 */}
      {step !== 'success' && (
        <div className="flex items-center gap-1 mb-4 px-1">
          {(['input', 'risk', 'confirm'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    stepIndex > i
                      ? 'bg-green-500 text-white'
                      : stepIndex === i
                        ? 'bg-gold-400 text-black'
                        : 'bg-white/10 text-white/40'
                  }`}
                >
                  {stepIndex > i ? '✓' : i + 1}
                </div>
                <span
                  className={`text-[11px] ${
                    stepIndex >= i ? 'text-white' : 'text-white/30'
                  }`}
                >
                  {stepTitles[s]}
                </span>
              </div>
              {i < 2 && (
                <div
                  className={`flex-1 h-px mx-1.5 ${
                    stepIndex > i ? 'bg-green-500/50' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

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

          {/* 交易规则提示 */}
          <div className="flex items-center gap-2 text-xs text-gold-400/80 bg-gold-400/5 rounded-lg px-3 py-2">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>15:00 前买入，按今日净值计算份额；15:00 后按下个交易日计算</span>
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
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span className="text-secondary">预计份额</span>
                <span className="text-gold-300 font-bold text-sm">
                  {estimated.shares.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 份
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleInputNext}
            disabled={!amountNum || amountNum <= 0}
            className="glass-button-gold w-full py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            下一步
          </button>
        </div>
      )}

      {step === 'risk' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-sm font-medium">风险提示与确认</span>
          </div>

          <div className="glass-card-inner p-3 rounded-lg space-y-3 text-xs text-secondary max-h-56 overflow-y-auto">
            <p>
              尊敬的投资者，您即将购买 <span className="text-white">{fund.name}</span>（{fund.code}）。
            </p>
            <div className="space-y-2">
              <p className="text-white/80 font-medium">投资风险提示：</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>基金投资有风险，过往业绩不预示未来表现</li>
                <li>本基金净值可能因市场波动而产生较大回撤</li>
                <li>投资者应充分了解自身风险承受能力后审慎决策</li>
                <li>基金合同中约定了申购、赎回的费率及限制条款</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-white/80 font-medium">交易规则提示：</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>交易日 15:00 前提交，按当日净值确认份额</li>
                <li>份额确认日：T+1（遇节假日顺延）</li>
                <li>7 日内赎回通常会收取较高赎回费</li>
              </ul>
            </div>
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 accent-gold-400"
            />
            <span className="text-xs text-secondary leading-relaxed">
              本人已仔细阅读并充分理解上述风险提示，确认已知晓投资风险，自愿承担基金投资可能带来的损失
            </span>
          </label>

          <button
            type="button"
            onClick={handleRiskNext}
            disabled={!agreed}
            className="glass-button-gold w-full py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            继续
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
          <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h4 className="text-white text-lg font-medium">购买成功！</h4>
            <p className="text-secondary text-sm mt-1">
              预计 T+1 日确认份额，届时可在持仓中查看
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
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="glass-button flex-1 py-2.5 text-sm text-secondary hover:text-white"
            >
              继续浏览
            </button>
            <Link
              to="/portfolio"
              onClick={handleClose}
              className="glass-button-gold flex-1 py-2.5 text-sm font-medium inline-flex items-center justify-center gap-1.5"
            >
              <span>查看持仓</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </GlassModal>
  );
}