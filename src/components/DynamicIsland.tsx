import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DynamicIslandProps {
  isLockScreen?: boolean;
}

export default function DynamicIsland({ isLockScreen = false }: DynamicIslandProps) {
  const [expanded, setExpanded] = useState(false);
  const [notification, setNotification] = useState<{
    title: string;
    subtitle: string;
    icon: string;
  } | null>(null);

  useEffect(() => {
    const notifications = [
      { title: '信息', subtitle: '新消息', icon: '💬' },
      { title: '音乐', subtitle: '正在播放', icon: '🎵' },
      { title: '日历', subtitle: '会议提醒', icon: '📅' },
    ];

    const showNotification = () => {
      const random = notifications[Math.floor(Math.random() * notifications.length)];
      setNotification(random);
      setExpanded(true);
      setTimeout(() => {
        setExpanded(false);
        setTimeout(() => setNotification(null), 300);
      }, 2000);
    };

    const timer = setTimeout(showNotification, 3000);
    const interval = setInterval(showNotification, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        {expanded && notification ? (
          <motion.div
            key="expanded"
            initial={{ width: 120, height: 35, borderRadius: 20 }}
            animate={{ width: 320, height: 60, borderRadius: 30 }}
            exit={{ width: 120, height: 35, borderRadius: 20 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="bg-black rounded-[30px] overflow-hidden shadow-lg"
          >
            <div className="w-full h-full flex items-center px-4 gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm"
              >
                {notification.icon}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="flex-1 min-w-0"
              >
                <p className="text-white text-xs font-medium truncate">{notification.title}</p>
                <p className="text-white/70 text-[10px] truncate">{notification.subtitle}</p>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-3 h-3 rounded-full bg-green-500 animate-pulse"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ width: 320, height: 60 }}
            animate={{ width: 120, height: 35 }}
            className="bg-black rounded-full shadow-lg"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
