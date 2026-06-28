import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBar from './StatusBar';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [time, setTime] = useState(new Date());
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');

  const formatDate = () => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const day = days[time.getDay()];
    return `${month}月${date}日 ${day}`;
  };

  const handleUnlock = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      onUnlock();
    }, 800);
  };

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden">
      {/* 装饰性液态玻璃圆 - 放在内容后面 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-0 w-64 h-64 rounded-full bg-purple-500/20"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'blur(50px)' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-56 h-56 rounded-full bg-blue-500/20"
          animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'blur(50px)' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-pink-500/10"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'blur(60px)' }}
        />
      </div>

      <StatusBar />

      {/* 内容层 - z-10 确保在光球前面 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.p
            className="text-white/80 text-lg mb-2 font-light"
            key={formatDate()}
          >
            {formatDate()}
          </motion.p>
          <motion.h1
            className="text-[96px] font-thin text-white leading-none"
            style={{ textShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
          >
            {hours}
            <span className="text-[72px] text-white/90">:{minutes}</span>
          </motion.h1>
        </motion.div>
      </div>

      {/* 解锁按钮区域 */}
      <motion.div
        className="relative z-10 px-8 pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="flex justify-center gap-8 mb-8">
          <motion.div
            className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-xl">🔦</span>
          </motion.div>
          <motion.div
            className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-xl">📷</span>
          </motion.div>
        </div>

        <motion.button
          className="w-full py-4 rounded-3xl bg-white/20 backdrop-blur-2xl border border-white/30 text-white text-base font-medium relative overflow-hidden"
          onClick={handleUnlock}
          disabled={isUnlocking}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.25)' }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
            style={{ width: '40%' }}
          />
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isUnlocking ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                解锁中...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM6 10h12v10H6V10zm6-5c1.66 0 3 1.34 3 3v2H9V8c0-1.66 1.34-3 3-3z"/>
                </svg>
                按下解锁
              </>
            )}
          </span>
        </motion.button>

        <p className="text-white/50 text-xs text-center mt-3">
          点击按钮解锁进入系统
        </p>
      </motion.div>

      <AnimatePresence>
        {isUnlocking && (
          <motion.div
            className="absolute inset-0 bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
