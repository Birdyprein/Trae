import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LockScreen from './LockScreen';
import HomeScreen from './HomeScreen';
import DynamicIsland from './DynamicIsland';
import ControlCenter from './ControlCenter';
import NotificationCenter from './NotificationCenter';
import ClockApp from '../apps/ClockApp';
import CalculatorApp from '../apps/CalculatorApp';
import SettingsApp from '../apps/SettingsApp';
import PhotosApp from '../apps/PhotosApp';
import WeatherApp from '../apps/WeatherApp';
import NotesApp from '../apps/NotesApp';
import MapsApp from '../apps/MapsApp';
import { AppIcon } from '../data/apps';

type OSState = 'lock' | 'home';

export default function PhoneOS() {
  const [osState, setOsState] = useState<OSState>('lock');
  const [activeApp, setActiveApp] = useState<AppIcon | null>(null);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);
  const [recentApps, setRecentApps] = useState<AppIcon[]>([]);

  const handleUnlock = useCallback(() => {
    setOsState('home');
  }, []);

  const handleLock = useCallback(() => {
    setOsState('lock');
    setActiveApp(null);
  }, []);

  const handleAppOpen = useCallback((app: AppIcon) => {
    setActiveApp(app);
    setRecentApps(prev => {
      const filtered = prev.filter(a => a.id !== app.id);
      return [app, ...filtered].slice(0, 6);
    });
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
      case 'weather':
        return <WeatherApp onClose={handleAppClose} />;
      case 'notes':
        return <NotesApp onClose={handleAppClose} />;
      case 'maps':
        return <MapsApp onClose={handleAppClose} />;
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
                <p className="text-gray-500 text-sm">此应用正在开发中</p>
              </div>
            </div>
          </div>
        );
    }
  };

  const HomeIndicator = ({ onSwipeUp }: { onSwipeUp: () => void }) => (
    <div
      className="absolute bottom-1 left-0 right-0 flex justify-center z-50"
      onPointerDown={(e) => {
        const startY = e.clientY;
        const handleMove = (ev: PointerEvent) => {
          if (startY - ev.clientY > 50) {
            onSwipeUp();
            document.removeEventListener('pointermove', handleMove);
          }
        };
        const handleUp = () => {
          document.removeEventListener('pointermove', handleMove);
          document.removeEventListener('pointerup', handleUp);
        };
        document.addEventListener('pointermove', handleMove);
        document.addEventListener('pointerup', handleUp);
      }}
    >
      <div className="w-32 h-1 bg-white rounded-full opacity-60" />
    </div>
  );

  const phoneContent = (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <DynamicIsland isLockScreen={osState === 'lock'} />

      <AnimatePresence mode="wait">
        {osState === 'lock' ? (
          <motion.div
            key="lock"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.05,
              filter: 'blur(20px)',
              transition: { duration: 0.5 }
            }}
            className="w-full h-full absolute inset-0"
          >
            <LockScreen onUnlock={handleUnlock} />
            <HomeIndicator onSwipeUp={handleUnlock} />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full absolute inset-0"
          >
            <HomeScreen onAppOpen={handleAppOpen} />
            <HomeIndicator onSwipeUp={() => setAppSwitcherOpen(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeApp && (
          <motion.div
            key="app"
            initial={{ scale: 0.1, opacity: 0, borderRadius: '50%' }}
            animate={{
              scale: 1,
              opacity: 1,
              borderRadius: '0%',
              transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] }
            }}
            exit={{
              scale: 0.1,
              opacity: 0,
              borderRadius: '50%',
              transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] }
            }}
            className="absolute inset-0 z-30"
          >
            {renderApp()}
            <HomeIndicator onSwipeUp={handleAppClose} />
          </motion.div>
        )}
      </AnimatePresence>

      <ControlCenter
        isOpen={controlCenterOpen}
        onClose={() => setControlCenterOpen(false)}
      />
      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />

      {/* 顶部手势区域 - 右侧下滑打开控制中心，左侧下滑打开通知中心 */}
      <div
        className="absolute top-0 right-0 w-1/3 h-10 z-50"
        onPointerDown={(e) => {
          const startY = e.clientY;
          const handleMove = (ev: PointerEvent) => {
            if (ev.clientY - startY > 50) {
              setControlCenterOpen(true);
              document.removeEventListener('pointermove', handleMove);
            }
          };
          const handleUp = () => {
            document.removeEventListener('pointermove', handleMove);
            document.removeEventListener('pointerup', handleUp);
          };
          document.addEventListener('pointermove', handleMove);
          document.addEventListener('pointerup', handleUp);
        }}
      />
      <div
        className="absolute top-0 left-0 w-2/3 h-10 z-50"
        onPointerDown={(e) => {
          const startY = e.clientY;
          const handleMove = (ev: PointerEvent) => {
            if (ev.clientY - startY > 50) {
              setNotificationCenterOpen(true);
              document.removeEventListener('pointermove', handleMove);
            }
          };
          const handleUp = () => {
            document.removeEventListener('pointermove', handleMove);
            document.removeEventListener('pointerup', handleUp);
          };
          document.addEventListener('pointermove', handleMove);
          document.addEventListener('pointerup', handleUp);
        }}
      />

      {/* App Switcher */}
      <AnimatePresence>
        {appSwitcherOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setAppSwitcherOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-20 left-0 right-0 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-white/60 text-xs text-center mb-3">最近使用</p>
              <div className="flex gap-3 overflow-x-auto pb-4">
                {recentApps.length === 0 ? (
                  <div className="flex-1 text-center py-8">
                    <p className="text-white/40 text-sm">暂无最近使用的应用</p>
                  </div>
                ) : (
                  recentApps.map((app) => (
                    <motion.div
                      key={app.id}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0 w-32 bg-white/10 backdrop-blur-xl rounded-2xl p-3 cursor-pointer"
                      onClick={() => {
                        handleAppOpen(app);
                        setAppSwitcherOpen(false);
                      }}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-lg mb-2`}
                      >
                        {app.icon}
                      </div>
                      <p className="text-white text-xs font-medium">{app.name}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="w-full h-full relative">
      {/* 手机外框 - 桌面端展示 */}
      <div className="hidden md:flex w-full h-full items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="relative">
          <div
            className="w-[390px] h-[800px] bg-black rounded-[55px] p-[3px] shadow-2xl"
            style={{
              boxShadow: '0 30px 100px rgba(0,0,0,0.5), inset 0 0 30px rgba(255,255,255,0.03)',
              background: 'linear-gradient(145deg, #2a2a2a, #0a0a0a)'
            }}
          >
            <div className="relative w-full h-full rounded-[52px] overflow-hidden bg-black">
              {phoneContent}
            </div>
          </div>

          {/* 侧边按钮 */}
          <div className="absolute -left-0.5 top-28 w-0.5 h-8 bg-gray-600 rounded-l" />
          <div className="absolute -left-0.5 top-40 w-0.5 h-20 bg-gray-600 rounded-l" />
          <div className="absolute -left-0.5 top-64 w-0.5 h-20 bg-gray-600 rounded-l" />
          <div className="absolute -right-0.5 top-36 w-0.5 h-28 bg-gray-600 rounded-r" />

          {/* 使用说明 */}
          <div className="absolute -right-72 top-1/2 -translate-y-1/2 w-64">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 text-white space-y-4">
              <h3 className="font-semibold text-lg">操作指南</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <span className="text-lg">👆</span>
                  <div>
                    <p className="font-medium">向上滑动</p>
                    <p className="text-white/60 text-xs">解锁 / 返回主屏</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-lg">📲</span>
                  <div>
                    <p className="font-medium">右上角下滑</p>
                    <p className="text-white/60 text-xs">打开控制中心</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-lg">🔔</span>
                  <div>
                    <p className="font-medium">左上角下滑</p>
                    <p className="text-white/60 text-xs">打开通知中心</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-lg">📱</span>
                  <div>
                    <p className="font-medium">长按应用图标</p>
                    <p className="text-white/60 text-xs">编辑主屏幕</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端全屏 */}
      <div className="md:hidden w-full h-full relative">
        {phoneContent}
      </div>
    </div>
  );
}
