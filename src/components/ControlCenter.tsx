import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ControlCenter({ isOpen, onClose }: ControlCenterProps) {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airplane, setAirplane] = useState(false);
  const [cellular, setCellular] = useState(true);
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(60);
  const [flashlight, setFlashlight] = useState(false);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [rotationLock, setRotationLock] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  const ToggleButton = ({ active, onClick, children, color = 'blue' }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  }) => {
    const colors = {
      blue: active ? 'bg-blue-500 text-white' : 'bg-white/20 text-white',
      green: active ? 'bg-green-500 text-white' : 'bg-white/20 text-white',
      orange: active ? 'bg-orange-500 text-white' : 'bg-white/20 text-white',
      purple: active ? 'bg-purple-500 text-white' : 'bg-white/20 text-white',
      red: active ? 'bg-red-500 text-white' : 'bg-white/20 text-white',
    };

    return (
      <button
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${colors[color]}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: -400, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute top-0 left-0 right-0 z-50 px-3 pt-12"
          >
            <div className="bg-white/20 backdrop-blur-2xl rounded-[40px] p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-2xl p-3 space-y-2">
                  <div className="flex gap-2">
                    <ToggleButton active={airplane} onClick={() => setAirplane(!airplane)} color="orange">
                      ✈️
                    </ToggleButton>
                    <ToggleButton active={cellular} onClick={() => setCellular(!cellular)} color="green">
                      📶
                    </ToggleButton>
                  </div>
                  <div className="flex gap-2">
                    <ToggleButton active={wifi} onClick={() => setWifi(!wifi)} color="blue">
                      📡
                    </ToggleButton>
                    <ToggleButton active={bluetooth} onClick={() => setBluetooth(!bluetooth)} color="blue">
                      🔷
                    </ToggleButton>
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                      🎵
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">夜曲</div>
                      <div className="text-white/60 text-xs truncate">周杰伦</div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-6 text-white">
                    <span>⏮️</span>
                    <span>⏸️</span>
                    <span>⏭️</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-3 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-white text-sm w-6">☀️</span>
                  <div className="flex-1 h-8 bg-white/20 rounded-full relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-white rounded-full"
                      style={{ width: `${brightness}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="text-white/60 text-xs w-8 text-right">{brightness}%</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-white text-sm w-6">🔊</span>
                  <div className="flex-1 h-8 bg-white/20 rounded-full relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-white rounded-full"
                      style={{ width: `${volume}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="text-white/60 text-xs w-8 text-right">{volume}%</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="flex flex-col items-center gap-1">
                  <ToggleButton active={flashlight} onClick={() => setFlashlight(!flashlight)} color="orange">
                    🔦
                  </ToggleButton>
                  <span className="text-white/70 text-xs">手电筒</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ToggleButton active={doNotDisturb} onClick={() => setDoNotDisturb(!doNotDisturb)} color="purple">
                    🌙
                  </ToggleButton>
                  <span className="text-white/70 text-xs">专注</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ToggleButton active={rotationLock} onClick={() => setRotationLock(!rotationLock)} color="red">
                    🔒
                  </ToggleButton>
                  <span className="text-white/70 text-xs">旋转锁定</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ToggleButton active={lowPower} onClick={() => setLowPower(!lowPower)} color="green">
                    🔋
                  </ToggleButton>
                  <span className="text-white/70 text-xs">低电量</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                    📷
                  </div>
                  <span className="text-white/70 text-xs">相机</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                    🧭
                  </div>
                  <span className="text-white/70 text-xs">指南针</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                    📱
                  </div>
                  <span className="text-white/70 text-xs">镜像</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                    🎙️
                  </div>
                  <span className="text-white/70 text-xs">录音</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
