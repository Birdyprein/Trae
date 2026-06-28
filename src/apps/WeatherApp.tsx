import { motion } from 'framer-motion';

interface WeatherAppProps {
  onClose: () => void;
}

const hourlyData = [
  { time: '现在', temp: 26, icon: '☀️' },
  { time: '10', temp: 27, icon: '🌤️' },
  { time: '11', temp: 28, icon: '⛅' },
  { time: '12', temp: 29, icon: '☀️' },
  { time: '13', temp: 30, icon: '☀️' },
  { time: '14', temp: 30, icon: '🌤️' },
  { time: '15', temp: 29, icon: '⛅' },
  { time: '16', temp: 28, icon: '🌤️' },
  { time: '17', temp: 27, icon: '🌥️' },
];

const dailyData = [
  { day: '今天', icon: '☀️', high: 30, low: 22 },
  { day: '明天', icon: '⛅', high: 28, low: 20 },
  { day: '周三', icon: '🌧️', high: 24, low: 18 },
  { day: '周四', icon: '🌦️', high: 23, low: 17 },
  { day: '周五', icon: '☀️', high: 27, low: 19 },
];

export default function WeatherApp({ onClose }: WeatherAppProps) {
  return (
    <div
      className="w-full h-full relative overflow-hidden text-white"
      style={{
        background: 'linear-gradient(180deg, #5B8DEF 0%, #89C2F0 50%, #C3E4F7 100%)',
      }}
    >
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/20"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'blur(30px)' }}
        />
        <motion.div
          className="absolute bottom-20 right-5 w-60 h-60 rounded-full bg-yellow-300/20"
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'blur(40px)' }}
        />
      </div>

      <div className="relative z-10 h-full overflow-y-auto pb-20">
        <div className="flex items-center justify-between px-4 pt-3">
          <button className="text-white/90 text-sm" onClick={onClose}>
            返回
          </button>
          <span className="text-white/90 text-lg">☀️</span>
        </div>

        <div className="flex flex-col items-center pt-6 pb-4">
          <h1 className="text-3xl font-light">北京</h1>
          <motion.div
            className="text-[100px] leading-none my-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            26°
          </motion.div>
          <p className="text-xl opacity-90">晴</p>
          <p className="text-sm opacity-70 mt-1">最高30° · 最低22°</p>
        </div>

        <div className="mx-4 mb-3">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-4">
            <p className="text-xs opacity-70 mb-3">今日详情</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-2xl p-3">
                <p className="text-xs opacity-70 mb-1">紫外线</p>
                <p className="text-2xl font-light">中等</p>
                <p className="text-xs opacity-80">3级</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-3">
                <p className="text-xs opacity-70 mb-1">湿度</p>
                <p className="text-2xl font-light">65%</p>
                <p className="text-xs opacity-80">体感28°</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-3">
                <p className="text-xs opacity-70 mb-1">风速</p>
                <p className="text-2xl font-light">12km/h</p>
                <p className="text-xs opacity-80">东北风</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-3">
                <p className="text-xs opacity-70 mb-1">能见度</p>
                <p className="text-2xl font-light">15km</p>
                <p className="text-xs opacity-80">非常好</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-4 mb-3">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-4">
            <p className="text-xs opacity-70 mb-3">小时预报</p>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {hourlyData.map((hour, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                  <span className="text-xs opacity-80">{hour.time}</span>
                  <span className="text-2xl">{hour.icon}</span>
                  <span className="text-sm font-medium">{hour.temp}°</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-4">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-4">
            <p className="text-xs opacity-70 mb-3">7日预报</p>
            <div className="space-y-2">
              {dailyData.map((day, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 py-1"
                >
                  <span className="w-10 text-sm opacity-80">{day.day}</span>
                  <span className="text-xl w-8 text-center">{day.icon}</span>
                  <div className="flex-1 flex items-center">
                    <span className="text-xs opacity-60 w-8">{day.low}°</span>
                    <div className="flex-1 mx-2 h-1 bg-white/30 rounded-full">
                      <div
                        className="h-full bg-white/70 rounded-full"
                        style={{ width: `${((day.high - 15) / 20) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs w-8 text-right">{day.high}°</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
