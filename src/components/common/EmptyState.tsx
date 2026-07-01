import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * 空状态组件
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  message = '暂无数据',
  icon,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <div className="text-white/30 mb-3">
        {icon ?? <Inbox size={48} strokeWidth={1.2} />}
      </div>
      <p className="text-sm text-secondary">{message}</p>
    </div>
  );
};

export default EmptyState;
