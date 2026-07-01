import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

/**
 * 玻璃态弹窗
 * - 遮罩层 glass-overlay + 弹窗 glass-modal
 * - 点击遮罩关闭、ESC 关闭
 * - 包含关闭按钮
 */
const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}) => {
  // ESC 关闭 + 锁定滚动
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="glass-overlay fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`glass-modal w-full ${maxWidth} max-h-[90vh] overflow-y-auto animate-slide-up`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* 标题栏（始终展示关闭按钮） */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/5">
          <h3 className="text-base sm:text-lg font-medium text-white truncate">
            {title ?? ''}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="glass-button p-1.5 text-white/70 hover:text-white flex-shrink-0"
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        </div>

        {/* 内容区 */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

export default GlassModal;
