import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LockScreen from './LockScreen';
import HomeScreen from './HomeScreen';
import ClockApp from '../apps/ClockApp';
import CalculatorApp from '../apps/CalculatorApp';
import SettingsApp from '../apps/SettingsApp';
import PhotosApp from '../apps/PhotosApp';
import { AppIcon } from '../data/apps';

type OSState = 'lock' | 'home';

export default function PhoneOS() {
  const [osState, setOsState] = useState<OSState>('lock');
  const [activeApp, setActiveApp] = useState<AppIcon | null>(null);

  const handleUnlock = useCallback(() => {
    setOsState('home');
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
      case 'clock':
        return <ClockApp onClose={handleAppClose} />;
      case 'calculator':
        return <CalculatorApp onClose={handleAppClose} />;
      case 'settings':
        return <SettingsApp onClose={handleAppClose} />;
      case 'photos':
        return <PhotosApp onClose={handleAppClose} />;
      default:
        return (
          <div className="w-full h-full bg-white flex flex-col">
            <div className="flex items-center px-4 h-12 border-b border-gray-200">
              <button
                className="text-blue-500 text-sm"
                onClick={handleAppClose}
              >
                ← 返回
              </button>
              <h1 className="flex-1 text-center font-semibold">{activeApp.name}</h1>
              <div className="w-12" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">{activeApp.icon}</div>
                <p className="text-gray-500">此应用正在开发中</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* 手机外框 - 用于在桌面端展示 */}
      <div className="hidden md:flex w-full h-full items-center justify-center bg-gray-900 p-8">
        <div className="relative">
          <div
            className="w-[380px] h-[780px] bg-black rounded-[50px] p-3 shadow-2xl"
            style={{ boxShadow: '0 0 60px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.05)' }}
          >
            <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-black">
              {/* 刘海 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-50" />

              <AnimatePresence mode="wait">
                {osState === 'lock' ? (
                  <motion.div
                    key="lock"
                    initial={{ opacity: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 1.1,
                      filter: 'blur(10px)',
                      transition: { duration: 0.5 }
                    }}
                    className="w-full h-full absolute inset-0"
                  >
                    <LockScreen onUnlock={handleUnlock} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full absolute inset-0"
                  >
                    <HomeScreen onAppOpen={handleAppOpen} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 应用打开动画 */}
              <AnimatePresence>
                {activeApp && (
                  <motion.div
                    key="app"
                    initial={{ scale: 0.2, opacity: 0, borderRadius: '50%' }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      borderRadius: '0%',
                      transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] }
                    }}
                    exit={{
                      scale: 0.2,
                      opacity: 0,
                      borderRadius: '50%',
                      transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] }
                    }}
                    className="absolute inset-0 z-40"
                  >
                    {renderApp()}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 主页指示器 */}
              {osState === 'home' && !activeApp && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-2 left-0 right-0 flex justify-center"
                >
                  <div className="w-32 h-1 bg-white rounded-full opacity-80" />
                </motion.div>
              )}
            </div>
          </div>

          {/* 侧边按钮装饰 */}
          <div className="absolute -left-1 top-24 w-1 h-8 bg-gray-700 rounded-l" />
          <div className="absolute -left-1 top-36 w-1 h-16 bg-gray-700 rounded-l" />
          <div className="absolute -left-1 top-56 w-1 h-16 bg-gray-700 rounded-l" />
          <div className="absolute -right-1 top-32 w-1 h-24 bg-gray-700 rounded-r" />
        </div>
      </div>

      {/* 移动端全屏展示 */}
      <div className="md:hidden w-full h-full relative">
        <AnimatePresence mode="wait">
          {osState === 'lock' ? (
            <motion.div
              key="lock"
              exit={{
                opacity: 0,
                scale: 1.1,
                filter: 'blur(10px)',
                transition: { duration: 0.4 }
              }}
              className="w-full h-full absolute inset-0"
            >
              <LockScreen onUnlock={handleUnlock} />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full absolute inset-0"
            >
              <HomeScreen onAppOpen={handleAppOpen} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeApp && (
            <motion.div
              key="app"
              initial={{ scale: 0.2, opacity: 0, borderRadius: '50%' }}
              animate={{
                scale: 1,
                opacity: 1,
                borderRadius: '0%',
                transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] }
              }}
              exit={{
                scale: 0.2,
                opacity: 0,
                borderRadius: '50%',
                transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] }
              }}
              className="absolute inset-0 z-40"
            >
              {renderApp()}
            </motion.div>
          )}
        </AnimatePresence>

        {osState === 'home' && !activeApp && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
            <div className="w-32 h-1 bg-white rounded-full opacity-80" />
          </div>
        )}
      </div>
    </div>
  );
}
