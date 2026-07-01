import React from 'react';
import { AlertCircle } from 'lucide-react';
import { COMPLIANCE_NOTICE } from '@/constants';

/**
 * 页脚组件（含合规声明）
 * - 包含 COMPLIANCE_NOTICE 常量
 * - 玻璃态样式
 */
const Footer: React.FC = () => {
  const notice: string = COMPLIANCE_NOTICE ?? '';
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="glass-nav mt-8 border-t border-white/5">
      <div className="section-container py-6 sm:py-8">
        {/* 合规声明 */}
        <div className="flex items-start gap-2 mb-4 text-xs text-secondary">
          <AlertCircle
            size={14}
            className="text-gold-400 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <span>{notice}</span>
        </div>

        {/* 链接 + 版权 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-sm text-secondary">
            <span className="w-6 h-6 rounded-md bg-gradient-to-br from-gold-300 to-gold-600 flex items-center justify-center">
              <span className="text-[10px] font-bold text-black">基</span>
            </span>
            <span className="gradient-text-gold font-medium">基金分析平台</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span>© {currentYear} Fund Glass</span>
            <span className="hidden sm:inline">·</span>
            <span>Liquid Glass Design</span>
            <span className="hidden sm:inline">·</span>
            <span>仅供学习研究</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
