import { useState } from 'react';
import { motion } from 'framer-motion';

interface WeatherAppProps {
  onClose: () => void;
}

const hourlyData = [
  { time: '现在', temp: 26, icon: '☀️' },
  { time: '10:00', temp: 27, icon: '☀️' },
  { time: '11:00', temp: 28, icon: '🌤️' },
  { time: '12:00', temp: 29, icon: '⛅' },
  { time: '13:00', temp: 30, icon: '☀️' },
  { time: '14:00', temp: 30, icon: '☀️' },
  { time: '15:00', temp: 29, icon: '🌤️' },
  { time: '16:00', temp: 28, icon: '⛅' },
  { time: '17:00', temp: 27, icon: '🌥️' },
  { time: '18:00', temp: 25, icon: '🌆' },
];

const dailyData = [
  { day: '今天', icon: '☀️', high: 30, low: 22, condition: '晴' },
  { day: '周二', icon: '⛅', high: 29, low: 21, condition: '多云' },
  { day: '周三', icon: '🌧️', high: 25, low: 19, condition: '小雨' },
  { day: '周四', icon: '🌦️', high: 24, low: 18, condition: '阵雨' },
  { day: '周五', icon: '☀️', high: 27, low: 20, condition: '晴' },
  { day: '周六', icon: '🌤️', high: 28, low: 21, condition: '多云' },
  { day: '周日', icon: '☀️', high: 29, low: 22, condition: '晴' },
];

export default function WeatherApp({ onClose }: WeatherAppProps) {
  return (
    <div
      className="w-full h-full relative overflow-hidden text-white"
      style={{
        background: 'linear-gradient(180deg, #4A90D9 0%, #7EC8E3 50%, #B8E0F0 100%)'
      }}
    >
      <div className="h-full overflow-y-auto pb-20">
        <div className="sticky top-0 z-10 px-4 pt-3 pb-2">
          <div className="flex items-center justify-between">
            <button className="text-white/90 text-sm" onClick={onClose}>
              ← 返回
            </button>
            <span className="text-white/90 text-lg">🌤️</span>
          </div>
        </div>

        <div className="flex flex-col items-center pt-4 pb-8">
          <h1 className="text-4xl font-light">北京</h1>
          <div className="text-[90px] font-extralight leading-none my-2">26°</div>
          <p className="text-lg opacity-90">晴</p>
          <p className="text-sm opacity-70 mt-1">最高30° / 最低22°</p>
        </div>

        <div className="mx-4 mb-4 bg-white/20 backdrop-blur-xl rounded-2xl p-4">
          <p className="text-xs opacity-70 mb-3">今日小时预报</p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {hourlyData.map((hour, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <span className="text-xs opacity-80">{hour.time}</span>
                <span className="text-2xl">{hour.icon}</span>
                <span className="text-sm font-medium">{hour.temp}°</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mx-4 mb-4 bg-white/20 backdrop-blur-xl rounded-2xl p-4">
          <p className="text-xs opacity-70 mb-3">7日天气预报</p>
          <div className="space-y-3">
            {dailyData.map((day, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="w-12 text-sm opacity-80">{day.day}</span>
                <span className="text-xl w-8 text-center">{day.icon}</span>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs opacity-60 w-8 text-right">{day.low}°</span>
                  <div className="flex-1 h-1.5 bg-white/30 rounded-full relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 bg-white/70 rounded-full"
                      style={{
                        left: `${((day.low - 15) / 20) * 100}%`,
                        right: `${100 - ((day.high - 15) / 20) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs w-8">{day.high}°</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mx-4 mb-4 grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4">
            <p className="text-xs opacity-70 mb-1">紫外线指数</p>
            <p className="text-3xl font-light">5</p>
            <p className="text-xs opacity-80">中等</p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4">
            <p className="text-xs opacity-70 mb-1">湿度</p>
            <p className="text-3xl font-light">65%</p>
            <p className="text-xs opacity-80">体感28°</p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4">
            <p className="text-xs opacity-70 mb-1">风速</p>
            <p className="text-3xl font-light">12</p>
            <p className="text-xs opacity-80">km/h 东北风</p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4">
            <p className="text-xs opacity-70 mb-1">能见度</p>
            <p className="text-3xl font-light">15</p>
            <p className="text-xs opacity-80">公里</p>
          </div>
        </div>

        <div className="mx-4 bg-white/20 backdrop-blur-xl rounded-2xl p-4">
          <p className="text-xs opacity-70 mb-2">空气质量</p>
          <div className="flex items-end gap-2 mb-2">
            <p className="text-4xl font-light">45</p>
            <p className="text-sm pb-1 text-green-300">优</p>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full w-[22%] bg-gradient-to-r from-green-400 to-green-300 rounded-full" />
          </div>
          <p className="text-xs opacity-70 mt-2">空气质量令人满意，基本无空气污染</p>
        </div>
      </div>
    </div>
  );
}
