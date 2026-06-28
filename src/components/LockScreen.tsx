import { useState, useEffect } from 'react';
import StatusBar from './StatusBar';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [time, setTime] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);

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
    if (diff > 150) {
      onUnlock();
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setDragY(0);
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(120,119,198,0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,119,198,0.3) 0%, transparent 50%)'
        }}
      />

      <StatusBar isLockScreen />

      <div className="flex flex-col items-center pt-16 text-white">
        <p className="text-lg font-light mb-2">{formatDate()}</p>
        <h1 className="text-7xl font-thin tracking-tight">{formatTime()}</h1>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pb-10 px-8">
        <div className="flex justify-between mb-8">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4zm0 1.8A5 5 0 1 1 12 7a5 5 0 0 1 0 10zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div
            className="w-36 h-1 bg-white/40 rounded-full"
            style={{
              transform: isDragging ? `translateY(${(dragY - dragY) * 0.1}px)` : 'none'
            }}
          />
          <p className="text-white/70 text-sm">向上滑动解锁</p>
        </div>
      </div>
    </div>
  );
}
