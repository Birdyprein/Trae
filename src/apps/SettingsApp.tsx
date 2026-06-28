import { useState } from 'react';
import { motion } from 'framer-motion';

interface SettingsAppProps {
  onClose: () => void;
}

export default function SettingsApp({ onClose }: SettingsAppProps) {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airplane, setAirplane] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [brightness, setBrightness] = useState(80);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <motion.button
      className={`w-12 h-7 rounded-full transition-colors ${value ? 'bg-green-500' : 'bg-gray-500'}`}
      onClick={() => onChange(!value)}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-5 h-5 bg-white rounded-full shadow-md"
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );

  const settingsGroups = [
    {
      title: '网络连接',
      items: [
        { icon: '✈️', label: '飞行模式', toggle: airplane, onChange: setAirplane },
        { icon: '📶', label: 'Wi-Fi', toggle: wifi, onChange: setWifi, detail: '已连接' },
        { icon: '🔷', label: '蓝牙', toggle: bluetooth, onChange: setBluetooth, detail: '已打开' },
      ]
    },
    {
      title: '显示与亮度',
      items: [
        {
          icon: '☀️', label: '亮度', slider: true, value: brightness, onChange: setBrightness
        },
        { icon: '🌙', label: '深色模式', toggle: darkMode, onChange: setDarkMode },
      ]
    },
    {
      title: '通用',
      items: [
        { icon: '⚙️', label: '关于本机', detail: '→' },
        { icon: '🔔', label: '通知', detail: '→' },
        { icon: '🔊', label: '声音与触感', detail: '→' },
        { icon: '🎯', label: '隐私与安全', detail: '→' },
      ]
    },
    {
      title: '应用',
      items: [
        { icon: '📱', label: 'App Store', detail: '→' },
        { icon: '📷', label: '相机', detail: '→' },
        { icon: '🖼️', label: '照片', detail: '→' },
      ]
    },
  ];

  return (
    <div className="w-full h-full bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 h-12 border-b border-white/10">
        <button className="text-blue-500 text-sm" onClick={onClose}>
          返回
        </button>
        <span className="text-white font-medium">设置</span>
        <div className="w-12" />
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {settingsGroups.map((group, gi) => (
          <div key={gi} className="mt-6">
            {group.title && (
              <p className="text-gray-400 text-sm px-4 mb-2">{group.title}</p>
            )}
            <div className="bg-white/5 mx-2 rounded-2xl overflow-hidden">
              {group.items.map((item, ii) => (
                <div
                  key={ii}
                  className={`flex items-center justify-between px-4 py-3.5 ${
                    ii !== group.items.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-white text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.slider && (
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="opacity-50">
                          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
                        </svg>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={item.value}
                          onChange={(e) => item.onChange?.(parseInt(e.target.value))}
                          className="w-24 accent-blue-500"
                        />
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="opacity-50">
                          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z"/>
                        </svg>
                      </div>
                    )}
                    {item.toggle && <Toggle value={item.toggle} onChange={item.onChange!} />}
                    {!item.toggle && !item.slider && (
                      <span className="text-gray-500 text-sm">{item.detail}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
