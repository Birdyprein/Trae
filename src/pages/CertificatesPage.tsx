import { motion } from 'framer-motion';

export default function CertificatesPage() {
  return (
    <section className="py-20 md:py-32 min-h-screen">
      <div className="container px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">证书</span>
          </h2>
          <p className="text-gray-400 font-body max-w-2xl mx-auto">
            我获得的证书和荣誉
          </p>
        </motion.div>

        {/* 证书展示 */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass rounded-2xl p-6 md:p-8 card-hover"
          >
            {/* 证书主体 */}
            <div
              className="relative bg-gradient-to-b from-pink-50 to-amber-50 rounded-sm overflow-hidden aspect-[3/4] shadow-2xl"
              style={{
                backgroundImage: `
                  radial-gradient(ellipse at 20% 30%, rgba(251, 207, 232, 0.15) 0%, transparent 50%),
                  radial-gradient(ellipse at 80% 70%, rgba(253, 230, 138, 0.15) 0%, transparent 50%)
                `,
              }}
            >
              {/* 羽毛纹理背景 */}
              <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <pattern id="feather" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M10 0 Q15 5 10 10 Q5 15 10 20" fill="none" stroke="#d4a574" strokeWidth="0.3" />
                      <path d="M0 10 Q5 15 10 10 Q15 5 20 10" fill="none" stroke="#d4a574" strokeWidth="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#feather)" />
                </svg>
              </div>

              {/* 顶部丝带 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 md:w-64 h-20 md:h-24 z-10">
                <div className="w-full h-full bg-gradient-to-b from-red-800 via-red-900 to-red-950 flex flex-col items-center justify-center text-white">
                  <div className="flex items-center gap-2 md:gap-3">
                    {/* Logo */}
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 md:w-6 md:h-6">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.5 0 2.92-.34 4.2-.94-1.2-.85-2.2-1.95-2.96-3.24-.76-1.29-1.24-2.77-1.24-4.32 0-1.55.48-3.03 1.24-4.32.76-1.29 1.76-2.39 2.96-3.24C14.92 2.34 13.5 2 12 2z" />
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.5 0 2.92-.34 4.2-.94-1.2-.85-2.2-1.95-2.96-3.24-.76-1.29-1.24-2.77-1.24-4.32 0-1.55.48-3.03 1.24-4.32.76-1.29 1.76-2.39 2.96-3.24C14.92 2.34 13.5 2 12 2z" opacity="0.5" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-lg md:text-xl font-bold tracking-wide">终身教育平台</div>
                      <div className="text-[10px] md:text-xs opacity-80 tracking-wider">Lifelong Education Platform</div>
                    </div>
                  </div>
                </div>
                {/* 丝带尖角 */}
                <div className="absolute -bottom-4 left-0 w-0 h-0 border-l-[112px] md:border-l-[128px] border-l-transparent border-t-[16px] border-t-red-950"></div>
                <div className="absolute -bottom-4 right-0 w-0 h-0 border-r-[112px] md:border-r-[128px] border-r-transparent border-t-[16px] border-t-red-950"></div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[112px] md:border-l-[128px] border-l-transparent border-b-[16px] border-b-red-900" style={{ transform: 'rotate(180deg) translateX(50%)' }}></div>
              </div>

              {/* 装饰花纹 - 顶部 */}
              <div className="absolute top-24 md:top-28 left-6 md:left-10 right-6 md:right-10">
                <svg viewBox="0 0 400 30" className="w-full h-8">
                  <path
                    d="M0 15 Q20 15 30 5 Q40 -5 50 5 Q60 15 70 15 Q80 15 90 5 Q100 -5 110 5 Q120 15 130 15 Q140 15 150 5 Q160 -5 170 5 Q180 15 190 15 Q200 15 210 5 Q220 -5 230 5 Q240 15 250 15 Q260 15 270 5 Q280 -5 290 5 Q300 15 310 15 Q320 15 330 5 Q340 -5 350 5 Q360 15 370 15 Q380 15 390 5 Q400 -5 400 15"
                    fill="none"
                    stroke="#8B4513"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* 螺旋装饰 */}
                  <circle cx="30" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="70" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="110" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="150" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="190" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="230" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="270" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="310" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="350" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="390" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  {/* 端点螺旋 */}
                  <path d="M0 15 Q10 10 5 5 Q0 0 5 -2" fill="none" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M400 15 Q390 10 395 5 Q400 0 395 -2" fill="none" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* 证书内容 */}
              <div className="absolute inset-0 flex flex-col items-center pt-32 md:pt-36">
                {/* 标题 */}
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 md:mb-6 tracking-wider">
                  结课证书
                </h1>

                {/* 英文标题 */}
                <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-10">
                  {/* 左侧星星 */}
                  <div className="flex gap-1 md:gap-1.5">
                    {[1, 2, 3].map((i) => (
                      <svg key={`l-${i}`} viewBox="0 0 24 24" fill="#374151" className="w-4 h-4 md:w-5 md:h-5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  {/* 英文标签 */}
                  <div className="bg-gray-800 text-white px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-sm tracking-[0.2em] font-medium">
                    COURSE COMPLETION CERTIFICATE
                  </div>
                  {/* 右侧星星 */}
                  <div className="flex gap-1 md:gap-1.5">
                    {[1, 2, 3].map((i) => (
                      <svg key={`r-${i}`} viewBox="0 0 24 24" fill="#374151" className="w-4 h-4 md:w-5 md:h-5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* 姓名 */}
                <p className="text-4xl md:text-6xl font-black text-gray-600 mb-6 md:mb-8 tracking-widest">
                  王嘉诚
                </p>

                {/* 点状分隔线 */}
                <div className="flex items-center w-4/5 mb-6 md:mb-10">
                  <div className="w-3 h-1.5 bg-gray-700 rounded-full"></div>
                  <div className="flex-1 border-t-2 border-dotted border-gray-500 mx-1"></div>
                  <div className="w-3 h-1.5 bg-gray-700 rounded-full"></div>
                </div>

                {/* 课程名称 */}
                <p className="text-2xl md:text-4xl font-black text-gray-900 mb-6 md:mb-10">
                  药理学
                </p>

                {/* 讲师 */}
                <p className="text-gray-600 text-sm md:text-base">
                  课程讲师：王福刚
                </p>
              </div>

              {/* 底部信息区 */}
              <div className="absolute bottom-20 md:bottom-24 left-6 md:left-12 right-6 md:right-12 flex justify-between items-end">
                {/* 证书编号 */}
                <div className="text-center">
                  <p className="text-gray-600 text-base md:text-lg mb-2">证书编号</p>
                  <div className="w-20 md:w-28 h-px bg-gray-400 mb-2 mx-auto"></div>
                  <p className="text-gray-700 font-mono text-sm md:text-base">2606100668392</p>
                </div>

                {/* 二维码 */}
                <div className="w-20 h-20 md:w-28 md:h-28 bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 100 100" className="w-full h-full p-1">
                    {/* 二维码定位图案 - 左上 */}
                    <rect x="5" y="5" width="25" height="25" fill="white" />
                    <rect x="10" y="10" width="15" height="15" fill="#1a1a1a" />
                    <rect x="13" y="13" width="9" height="9" fill="white" />
                    <rect x="15" y="15" width="5" height="5" fill="#1a1a1a" />
                    {/* 二维码定位图案 - 右上 */}
                    <rect x="70" y="5" width="25" height="25" fill="white" />
                    <rect x="75" y="10" width="15" height="15" fill="#1a1a1a" />
                    <rect x="78" y="13" width="9" height="9" fill="white" />
                    <rect x="80" y="15" width="5" height="5" fill="#1a1a1a" />
                    {/* 二维码定位图案 - 左下 */}
                    <rect x="5" y="70" width="25" height="25" fill="white" />
                    <rect x="10" y="75" width="15" height="15" fill="#1a1a1a" />
                    <rect x="13" y="78" width="9" height="9" fill="white" />
                    <rect x="15" y="80" width="5" height="5" fill="#1a1a1a" />
                    {/* 数据点 - 随机分布模拟 */}
                    {Array.from({ length: 80 }).map((_, i) => {
                      const x = 35 + (i % 10) * 3;
                      const y = 35 + Math.floor(i / 10) * 3;
                      const isData = (i * 7 + 3) % 5 < 3;
                      return isData ? (
                        <rect key={i} x={x} y={y} width="2.5" height="2.5" fill="#1a1a1a" />
                      ) : null;
                    })}
                    {/* 右下区域数据点 */}
                    {Array.from({ length: 60 }).map((_, i) => {
                      const x = 45 + (i % 8) * 4;
                      const y = 70 + Math.floor(i / 8) * 3;
                      const isData = (i * 11 + 5) % 4 < 2;
                      return isData && x < 95 && y < 95 ? (
                        <rect key={`b-${i}`} x={x} y={y} width="2.5" height="2.5" fill="#1a1a1a" />
                      ) : null;
                    })}
                  </svg>
                </div>

                {/* 获得日期 */}
                <div className="text-center">
                  <p className="text-gray-600 text-base md:text-lg mb-2">获得日期:</p>
                  <div className="w-20 md:w-28 h-px bg-gray-400 mb-2 mx-auto"></div>
                  <p className="text-gray-700 font-mono text-sm md:text-base">2026-06-10</p>
                </div>
              </div>

              {/* 装饰花纹 - 底部 */}
              <div className="absolute bottom-6 md:bottom-8 left-6 md:left-10 right-6 md:right-10">
                <svg viewBox="0 0 400 30" className="w-full h-8" style={{ transform: 'rotate(180deg)' }}>
                  <path
                    d="M0 15 Q20 15 30 5 Q40 -5 50 5 Q60 15 70 15 Q80 15 90 5 Q100 -5 110 5 Q120 15 130 15 Q140 15 150 5 Q160 -5 170 5 Q180 15 190 15 Q200 15 210 5 Q220 -5 230 5 Q240 15 250 15 Q260 15 270 5 Q280 -5 290 5 Q300 15 310 15 Q320 15 330 5 Q340 -5 350 5 Q360 15 370 15 Q380 15 390 5 Q400 -5 400 15"
                    fill="none"
                    stroke="#8B4513"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="30" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="70" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="110" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="150" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="190" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="230" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="270" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="310" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="350" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <circle cx="390" cy="15" r="3" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                  <path d="M0 15 Q10 10 5 5 Q0 0 5 -2" fill="none" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M400 15 Q390 10 395 5 Q400 0 395 -2" fill="none" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* 证书信息 */}
            <div className="mt-6 text-center">
              <h3 className="font-display text-xl font-semibold text-white mb-2">
                药理学结课证书
              </h3>
              <p className="text-gray-400 font-body text-sm">
                终身教育平台 · 2026年6月10日
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}