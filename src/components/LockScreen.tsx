import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatusBar from './StatusBar';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [time, setTime] = useState(new Date());
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = () => {
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const day = days[time.getDay()];
    return `${month}月${date}日 ${day}`;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragY(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = dragY - e.clientY;
    if (diff > 0 && diff < 300) {
      setDragY(e.clientY);
    }
    if (diff > 200) {
      onUnlock();
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const dragOffset = isDragging ? Math.max(0, dragY - dragY) : 0;

  return (
    <div
      className="w-full h-full relative overflow-hidden select-none"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="absolute inset-0 bg-black/25" />

      <StatusBar isLockScreen />

      <div
        className="w-full h-full flex flex-col"
        style={{ transform: `translateY(-${dragOffset * 0.3}px)`, opacity: isDragging ? 1 - dragOffset * 0.002 : 1 }}
      >
        <div className="flex flex-col items-center pt-20 text-white">
          <p className="text-base font-medium mb-1">{formatDate()}</p>
          <h1 className="text-7xl font-thin tracking-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            {formatTime()}
          </h1>
        </div>

        <div className="flex-1" />

        <div className="px-6 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">☀️</span>
                <span className="text-white text-xs">北京</span>
              </div>
              <div className="text-white text-2xl font-light">26°</div>
              <div className="text-white/70 text-xs">晴 · 最高29°</div>
            </div>

            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📊</span>
                <span className="text-white text-xs">健身记录</span>
              </div>
              <div className="text-white text-2xl font-light">528</div>
              <div className="text-white/70 text-xs">千卡 / 目标600</div>
            </div>

            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-3 col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎵</span>
                <span className="text-white text-xs">正在播放</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  🎧
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">夜曲</div>
                  <div className="text-white/70 text-xs truncate">周杰伦</div>
                </div>
                <div className="flex gap-2 text-white">
                  <span>⏮️</span>
                  <span>▶️</span>
                  <span>⏭️</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between px-8 pb-4">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4zm0 1.8A5 5 0 1 1 12 7a5 5 0 0 1 0 10zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
            </svg>
          </motion.div>
        </div>

        <div className="flex flex-col items-center pb-6 gap-2">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-white/70 rounded-full" />
          </motion.div>
          <p className="text-white/60 text-xs">向上滑动解锁</p>
        </div>
      </div>
    </div>
  );
}
