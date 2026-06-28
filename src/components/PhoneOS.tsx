import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiquidGlassBackground from './LiquidGlassBackground';
import LockScreen from './LockScreen';
import HomeScreen from './HomeScreen';
import CalculatorApp from '../apps/CalculatorApp';
import WeatherApp from '../apps/WeatherApp';
import SettingsApp from '../apps/SettingsApp';
import { AppIcon } from '../data/apps';

type OSState = 'lock' | 'home';

export default function PhoneOS() {
  const [osState, setOsState] = useState<OSState>('lock');
  const [activeApp, setActiveApp] = useState<AppIcon | null>(null);

  const handleUnlock = useCallback(() => {
    setOsState('home');
  }, []);

  const handleLock = useCallback(() => {
    setOsState('lock');
    setActiveApp(null);
  }, []);

  const handleAppOpen = useCallback((app: AppIcon) => {
    setActiveApp(app);
  }, []);

  const handleAppClose = useCallback(() => {
    setActiveApp(null);
  }, []);

  const renderApp = () => {
    if (!activeApp) return null;

    switch (activeApp.type) {
      case 'calculator':
        return <CalculatorApp onClose={handleAppClose} />;
      case 'weather':
        return <WeatherApp onClose={handleAppClose} />;
      case 'settings':
        return <SettingsApp onClose={handleAppClose} />;
      default:
        return (
          <div className="w-full h-full bg-black flex flex-col">
            <div className="flex items-center px-4 h-12 border-b border-white/10">
              <button className="text-blue-500 text-sm" onClick={handleAppClose}>
                ← 返回
              </button>
              <h1 className="flex-1 text-center font-medium text-white">{activeApp.name}</h1>
              <div className="w-12" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">{activeApp.icon}</div>
                <p className="text-gray-400 text-sm">此应用即将到来</p>
              </div>
            </div>
          </div>
        );
    }
  };

  const phoneContent = (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* 液态玻璃背景 */}
      <div className="absolute inset-0">
        <LiquidGlassBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* 内容层 */}
      <div className="relative z-10 h-full">
        <AnimatePresence mode="wait">
          {osState === 'lock' ? (
            <motion.div
              key="lock"
              initial={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 1.1,
                filter: 'blur(30px)',
                transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] }
              }}
              className="w-full h-full absolute inset-0"
            >
              <LockScreen onUnlock={handleUnlock} />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] }
              }}
              className="w-full h-full absolute inset-0"
            >
              <HomeScreen onAppOpen={handleAppOpen} onLock={handleLock} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 应用打开动画 */}
        <AnimatePresence>
          {activeApp && (
            <motion.div
              key="app"
              initial={{
                scale: 0.1,
                opacity: 0,
                borderRadius: '50%',
                filter: 'blur(20px)',
              }}
              animate={{
                scale: 1,
                opacity: 1,
                borderRadius: '0%',
                filter: 'blur(0px)',
                transition: {
                  duration: 0.5,
                  ease: [0.32, 0.72, 0, 1],
                }
              }}
              exit={{
                scale: 0.1,
                opacity: 0,
                borderRadius: '50%',
                filter: 'blur(20px)',
                transition: {
                  duration: 0.4,
                  ease: [0.32, 0.72, 0, 1],
                }
              }}
              className="w-full h-full absolute inset-0"
            >
              {renderApp()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 玻璃态光泽层 */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
        }}
      />
    </div>
  );

  return (
    <div className="w-full h-full relative">
      {/* 桌面端手机外框 */}
      <div className="hidden md:flex w-full h-full items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)'
        }}
      >
        <div className="relative">
          {/* 手机外框 - 玻璃态质感 */}
          <div
            className="w-[390px] h-[800px] rounded-[55px] p-[3px] relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              boxShadow: `
                0 50px 120px rgba(0,0,0,0.6),
                0 0 0 1px rgba(255,255,255,0.1),
                inset 0 1px 0 rgba(255,255,255,0.2),
                inset 0 -1px 0 rgba(0,0,0,0.3)
              `,
            }}
          >
            {/* 外框内边距的玻璃层 */}
            <div
              className="absolute inset-[2px] rounded-[53px] overflow-hidden"
              style={{
                background: 'rgba(10,10,15,0.95)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {phoneContent}
            </div>

            {/* 灵动岛 */}
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-full z-50"
              style={{
                boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.5)'
              }}
            >
              <div className="absolute inset-1 bg-black rounded-full">
                <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* 侧边按钮 */}
          <div className="absolute -left-0.5 top-32 w-0.5 h-10 bg-gradient-to-b from-gray-500 to-gray-700 rounded-l" />
          <div className="absolute -left-0.5 top-46 w-0.5 h-16 bg-gradient-to-b from-gray-500 to-gray-700 rounded-l" />
          <div className="absolute -left-0.5 top-66 w-0.5 h-16 bg-gradient-to-b from-gray-500 to-gray-700 rounded-l" />
          <div className="absolute -right-0.5 top-40 w-0.5 h-24 bg-gradient-to-l from-gray-500 to-gray-700 rounded-r" />

          {/* 操作提示 */}
          <motion.div
            className="absolute -right-80 top-1/2 -translate-y-1/2 w-64"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div
              className="rounded-3xl p-6 border border-white/10"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <h3 className="text-white font-medium text-lg mb-4">操作指南</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-white/80">
                  <span className="text-xl">🔘</span>
                  <div>
                    <p className="font-medium text-white">按下解锁</p>
                    <p className="text-white/50 text-xs">点击锁屏按钮进入系统</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <span className="text-xl">📱</span>
                  <div>
                    <p className="font-medium text-white">点击应用</p>
                    <p className="text-white/50 text-xs">打开计算器、天气、设置等</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <span className="text-xl">🔙</span>
                  <div>
                    <p className="font-medium text-white">返回主屏</p>
                    <p className="text-white/50 text-xs">点击应用内的返回按钮</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 移动端全屏 */}
      <div className="md:hidden w-full h-full">
        {phoneContent}
      </div>
    </div>
  );
}
