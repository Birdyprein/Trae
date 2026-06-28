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

  const formatTime = () => {
    const hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return { hours, minutes };
  };

  const { hours, minutes } = formatTime();

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
      <StatusBar />

      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.p
            className="text-white/70 text-lg mb-3 font-light tracking-wide"
            key={formatDate()}
          >
            {formatDate()}
          </motion.p>
          <motion.h1
            className="text-[88px] font-extralight tracking-tight text-white drop-shadow-2xl"
            style={{ textShadow: '0 4px 40px rgba(0,0,0,0.3)' }}
          >
            {hours}
            <motion.span
              key={minutes}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[72px] text-white/90"
            >
              :{minutes}
            </motion.span>
          </motion.h1>
        </motion.div>

        <motion.div
          className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl"
          animate={{ scale: [1, 1.1, 1], x: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'blur(20px)' }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/15 to-transparent backdrop-blur-xl"
          animate={{ scale: [1, 1.2, 1], x: [0, -15, 0], y: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'blur(25px)' }}
        />
      </div>

      <motion.div
        className="relative z-10 px-8 pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="flex justify-center gap-6 mb-8">
          <motion.div
            className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4zm0 1.8A5 5 0 1 1 12 7a5 5 0 0 1 0 10z"/>
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </motion.div>
          <motion.div
            className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </motion.div>
          <motion.div
            className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </motion.div>
        </div>

        <motion.button
          className="w-full py-4 rounded-3xl bg-white/15 backdrop-blur-2xl border border-white/20 text-white text-lg font-medium shadow-2xl overflow-hidden relative"
          onClick={handleUnlock}
          disabled={isUnlocking}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.2)' }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
            style={{ width: '50%' }}
          />
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isUnlocking ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                解锁中...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                按下解锁
              </>
            )}
          </span>
        </motion.button>

        <p className="text-white/40 text-xs text-center mt-4">
          点击上方按钮或使用 Face ID 解锁
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
