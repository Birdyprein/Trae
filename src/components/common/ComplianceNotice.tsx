import React from 'react';
import { AlertCircle } from 'lucide-react';
import { COMPLIANCE_NOTICE } from '@/constants';

interface ComplianceNoticeProps {
  className?: string;
  showIcon?: boolean;
}

/**
 * 合规声明组件
 * 固定展示 COMPLIANCE_NOTICE 常量内容
 */
const ComplianceNotice: React.FC<ComplianceNoticeProps> = ({
  className = '',
  showIcon = true,
}) => {
  const notice: string = COMPLIANCE_NOTICE ?? '';

  return (
    <div
      className={`glass-data-card flex items-start gap-2 px-4 py-3 text-xs text-secondary ${className}`}
      role="note"
    >
      {showIcon ? (
        <AlertCircle
          size={14}
          className="text-gold-400 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
      ) : null}
      <span>{notice}</span>
    </div>
  );
};

export default ComplianceNotice;
