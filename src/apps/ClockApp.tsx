import { useState, useEffect } from 'react';

interface ClockAppProps {
  onClose: () => void;
}

export default function ClockApp({ onClose }: ClockAppProps) {
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('world');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime();
  const secondDegrees = time.getSeconds() * 6;
  const minuteDegrees = time.getMinutes() * 6 + time.getSeconds() * 0.1;
  const hourDegrees = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;

  const tabs = [
    { id: 'world', label: '世界时钟' },
    { id: 'alarm', label: '闹钟' },
    { id: 'stopwatch', label: '秒表' },
    { id: 'timer', label: '计时器' },
  ];

  return (
    <div className="w-full h-full bg-black text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm mb-1">北京</p>
          <h1 className="text-5xl font-thin tracking-tight">
            {hours}:{minutes}
            <span className="text-3xl">{seconds}</span>
          </h1>
        </div>

        <div className="relative w-64 h-64 rounded-full border-4 border-gray-700 bg-black">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-3 bg-white left-1/2 -translate-x-1/2"
              style={{
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
                transformOrigin: '50% 128px',
                top: '4px'
              }}
            />
          ))}

          <div
            className="absolute w-1 h-16 bg-white rounded-full left-1/2 bottom-1/2 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${hourDegrees}deg)` }}
          />

          <div
            className="absolute w-0.5 h-20 bg-white rounded-full left-1/2 bottom-1/2 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${minuteDegrees}deg)` }}
          />

          <div
            className="absolute w-px h-24 bg-orange-500 left-1/2 bottom-1/2 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${secondDegrees}deg)` }}
          />

          <div className="absolute w-3 h-3 bg-orange-500 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="flex justify-around py-3 border-t border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`text-xs flex flex-col items-center gap-1 ${
              activeTab === tab.id ? 'text-orange-500' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.id === 'world' && <span>🌍</span>}
            {tab.id === 'alarm' && <span>⏰</span>}
            {tab.id === 'stopwatch' && <span>⏱️</span>}
            {tab.id === 'timer' && <span>⏲️</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
