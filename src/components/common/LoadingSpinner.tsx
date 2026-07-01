import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

/**
 * 加载指示器（简单旋转动画）
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  className = '',
  label,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className="rounded-full border-2 border-white/10 border-t-gold-400 animate-spin"
        style={{ width: size, height: size }}
      />
      {label ? (
        <span className="text-sm text-secondary">{label}</span>
      ) : null}
      <span className="sr-only">加载中...</span>
    </div>
  );
};

export default LoadingSpinner;
