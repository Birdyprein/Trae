import { useState, useEffect } from 'react';

export default function StatusBar({ isLockScreen = false }: { isLockScreen?: boolean }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div
      className={`w-full flex justify-between items-center px-6 py-1.5 text-white text-sm font-semibold ${
        isLockScreen ? 'bg-transparent' : 'bg-black/20 backdrop-blur-sm'
      }`}
    >
      <span className="w-16 text-left">{formatTime()}</span>
      <div className="flex items-center gap-1">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.5" />
          <rect x="5" y="6" width="3" height="6" rx="0.5" />
          <rect x="10" y="4" width="3" height="8" rx="0.5" />
          <rect x="15" y="2" width="3" height="10" rx="0.5" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" className="ml-0.5">
          <path d="M8 2.5C5.5 2.5 3.2 3.4 1.5 5L0 3.5C2 1.7 4.9 0.5 8 0.5s6 1.2 8 3L14.5 5C12.8 3.4 10.5 2.5 8 2.5zM8 6.5C6.3 6.5 4.7 7.2 3.5 8.3L2 6.8C3.7 5.1 5.8 4.2 8 4.2s4.3 0.9 6 2.6L12.5 8.3C11.3 7.2 9.7 6.5 8 6.5zM8 10.5c-0.8 0-1.5 0.3-2 0.8L6 12.8C6.6 13.3 7.3 13.6 8 13.6s1.4-0.3 2-0.8L10 11.3C9.5 10.8 8.8 10.5 8 10.5z" />
        </svg>
      </div>
      <div className="w-16 flex justify-end items-center gap-1">
        <span className="text-xs">{100}%</span>
        <div className="relative w-6 h-3 border border-white rounded-sm">
          <div className="absolute inset-0.5 bg-white rounded-sm" style={{ width: '90%' }} />
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-white rounded-r-sm" />
        </div>
      </div>
    </div>
  );
}
