import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    app: '信息',
    icon: '💬',
    color: 'from-green-400 to-green-600',
    title: '张三',
    content: '晚上一起吃饭吗？',
    time: '刚刚',
    unread: true,
  },
  {
    id: 2,
    app: '微信',
    icon: '💬',
    color: 'from-green-500 to-green-700',
    title: '工作群',
    content: '明天上午10点开会',
    time: '5分钟前',
    unread: true,
  },
  {
    id: 3,
    app: '日历',
    icon: '📅',
    color: 'from-red-400 to-red-600',
    title: '会议提醒',
    content: '产品评审会将在30分钟后开始',
    time: '10分钟前',
    unread: false,
  },
  {
    id: 4,
    app: '邮件',
    icon: '📧',
    color: 'from-blue-400 to-blue-600',
    title: 'GitHub',
    content: '您的PR已被合并到main分支',
    time: '1小时前',
    unread: false,
  },
  {
    id: 5,
    app: '天气',
    icon: '🌤️',
    color: 'from-blue-300 to-blue-500',
    title: '明日天气',
    content: '明天有雨，记得带伞',
    time: '2小时前',
    unread: false,
  },
];

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = () => {
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const day = days[time.getDay()];
    return `${month}月${date}日 ${day}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/30"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: -500, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -500, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute top-0 left-0 right-0 z-50 h-full"
            onClick={onClose}
          >
            <div
              className="h-full overflow-y-auto pt-16 pb-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/70 text-sm">{formatDate()}</p>
                    <h2 className="text-white text-3xl font-semibold">通知</h2>
                  </div>
                  <button className="text-blue-400 text-sm">全部清除</button>
                </div>
              </div>

              <div className="px-4 space-y-3">
                {notifications.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 relative overflow-hidden"
                  >
                    {notif.unread && (
                      <div className="absolute top-3 left-3 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                    <div className="flex gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${notif.color} flex items-center justify-center text-lg flex-shrink-0`}
                      >
                        {notif.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <span className="text-white/70 text-xs">{notif.app}</span>
                          <span className="text-white/40 text-xs">{notif.time}</span>
                        </div>
                        <p className="text-white text-sm font-medium truncate">{notif.title}</p>
                        <p className="text-white/70 text-xs truncate">{notif.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
