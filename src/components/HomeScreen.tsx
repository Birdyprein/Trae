import { motion } from 'framer-motion';
import StatusBar from './StatusBar';
import { apps, dockApps, AppIcon } from '../data/apps';

interface HomeScreenProps {
  onAppOpen: (app: AppIcon) => void;
  onLock: () => void;
}

export default function HomeScreen({ onAppOpen, onLock }: HomeScreenProps) {
  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden">
      <StatusBar />

      {/* 主屏幕应用网格 */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4">
        <div className="grid grid-cols-4 gap-y-6">
          {apps.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-2xl shadow-lg cursor-pointer`}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onAppOpen(app)}
                style={{
                  boxShadow: `0 8px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}
              >
                {app.icon}
              </motion.div>
              <span className="text-white text-xs font-medium drop-shadow-md">
                {app.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 底部Dock栏 */}
      <div className="px-4 pb-3">
        <div className="bg-white/15 backdrop-blur-2xl rounded-[28px] px-3 py-2 border border-white/10">
          <div className="grid grid-cols-4 gap-1">
            {dockApps.map((app) => (
              <motion.div
                key={app.id}
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-xl cursor-pointer`}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onAppOpen(app)}
                style={{
                  boxShadow: `0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}
              >
                {app.icon}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 底部指示条 */}
        <div className="flex justify-center mt-3">
          <motion.div
            className="w-32 h-1 bg-white/50 rounded-full"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>

      {/* 锁屏按钮 */}
      <motion.button
        className="absolute top-14 right-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white/70 text-xs flex items-center gap-1"
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onLock}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
        锁屏
      </motion.button>
    </div>
  );
}
