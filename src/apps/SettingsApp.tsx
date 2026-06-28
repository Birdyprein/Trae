import { useState } from 'react';

interface SettingsAppProps {
  onClose: () => void;
}

export default function SettingsApp({ onClose }: SettingsAppProps) {
  const [brightness, setBrightness] = useState(80);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [airplane, setAirplane] = useState(false);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      className={`w-12 h-7 rounded-full transition-colors ${value ? 'bg-green-500' : 'bg-gray-600'}`}
      onClick={() => onChange(!value)}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );

  const settingsGroups = [
    {
      title: '常用',
      items: [
        { icon: '✈️', label: '飞行模式', toggle: true, value: airplane, onChange: setAirplane },
        { icon: '📶', label: 'Wi-Fi', toggle: true, value: wifi, onChange: setWifi, detail: 'MyNetwork' },
        { icon: '🔷', label: '蓝牙', toggle: true, value: bluetooth, onChange: setBluetooth, detail: '已打开' },
        { icon: '📡', label: '蜂窝移动网络', toggle: false },
      ]
    },
    {
      title: '显示与亮度',
      items: [
        { icon: '☀️', label: '显示与亮度', slider: true, value: brightness, onChange: setBrightness },
        { icon: '🌙', label: '深色模式', toggle: true, value: darkMode, onChange: setDarkMode },
        { icon: '🔒', label: '自动锁定', detail: '30秒' },
      ]
    },
    {
      title: '通用',
      items: [
        { icon: '⚙️', label: '通用', detail: '关于 软件更新' },
        { icon: '🔔', label: '通知与专注模式' },
        { icon: '🔊', label: '声音与触感' },
        { icon: '🎮', label: '游戏' },
      ]
    },
    {
      title: '隐私',
      items: [
        { icon: '🔐', label: '隐私与安全性' },
        { icon: '📍', label: '定位服务' },
      ]
    }
  ];

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col overflow-hidden">
      <div className="bg-gray-200/80 backdrop-blur-sm px-4 pb-2 pt-2">
        <div className="flex justify-between items-center h-10">
          <button className="text-blue-500 text-base font-normal" onClick={onClose}>
            返回
          </button>
          <h1 className="text-lg font-semibold">设置</h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {settingsGroups.map((group, gi) => (
          <div key={gi} className="mt-6">
            {group.title && (
              <p className="text-gray-500 text-sm px-4 mb-2">{group.title}</p>
            )}
            <div className="bg-white mx-2 rounded-xl overflow-hidden">
              {group.items.map((item, ii) => (
                <div
                  key={ii}
                  className={`flex items-center justify-between px-4 py-3 ${
                    ii !== group.items.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.slider && (
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={item.value}
                        onChange={(e) => item.onChange?.(parseInt(e.target.value))}
                        className="w-28 accent-blue-500"
                      />
                    )}
                    {item.toggle && <Toggle value={item.value!} onChange={item.onChange!} />}
                    {!item.toggle && !item.slider && item.detail && (
                      <span className="text-gray-400 text-sm">{item.detail}</span>
                    )}
                    {!item.toggle && !item.slider && (
                      <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="h-20" />
      </div>
    </div>
  );
}
