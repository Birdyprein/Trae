import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

/**
 * 展示型玻璃卡片
 * 用于低信息密度、强调视觉美感的展示场景
 * - 默认使用 glass-card 类
 * - hover=false 时关闭悬浮效果与指针样式
 */
const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  hover = true,
}) => {
  const classes = [
    'glass-card',
    onClick && hover ? 'cursor-pointer' : '',
    hover ? '' : '[&:hover]:!border-white/[0.08] [&:hover]:!shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = onClick
    ? (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onClick();
      }
    : undefined;

  return (
    <div className={classes} onClick={handleClick}>
      {children}
    </div>
  );
};

export default GlassCard;
