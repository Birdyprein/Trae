import { useState, useEffect } from 'react';

interface StatusBarProps {
  isDark?: boolean;
}

export default function StatusBar({ isDark = true }: StatusBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="w-full flex justify-between items-center px-6 py-2 text-white text-sm font-medium select-none">
      <span className="w-16">{formatTime()}</span>

      <div className="flex items-center gap-1.5">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="w-0.5 bg-white rounded-sm"
              style={{ height: 4 + i * 2.5 }}
            />
          ))}
        </div>
        <span className="text-xs ml-0.5">5G</span>
      </div>

      <div className="w-16 flex justify-end items-center gap-1.5">
        <span className="text-xs">{100}%</span>
        <div className="relative w-6 h-3 border border-white/80 rounded-sm">
          <div
            className="absolute inset-0.5 bg-white rounded-sm"
            style={{ width: '92%' }}
          />
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-white/80 rounded-r-sm" />
        </div>
      </div>
    </div>
  );
}
