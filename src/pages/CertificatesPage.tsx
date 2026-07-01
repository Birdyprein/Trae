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
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass rounded-2xl p-8 card-hover"
          >
            {/* 证书主体 */}
            <div className="relative bg-white rounded-lg overflow-hidden aspect-[3/4] shadow-2xl">
              {/* 顶部丝带 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-gradient-to-b from-red-800 to-red-900 flex flex-col items-center justify-center text-white z-10">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold">终身教育平台</div>
                    <div className="text-xs opacity-80">Lifelong Education Platform</div>
                  </div>
                </div>
                {/* 丝带尖角 */}
                <div className="absolute -bottom-3 left-0 w-0 h-0 border-l-[128px] border-l-red-900 border-b-[12px] border-b-transparent"></div>
                <div className="absolute -bottom-3 right-0 w-0 h-0 border-r-[128px] border-r-red-900 border-b-[12px] border-b-transparent"></div>
              </div>

              {/* 装饰花纹 - 顶部 */}
              <div className="absolute top-28 left-8 right-8 flex items-center justify-center">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-700 to-transparent"></div>
                <div className="mx-4 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="1.5" className="w-6 h-6">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    <path d="M12 6v12M6 12h12" />
                  </svg>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-700 to-transparent"></div>
              </div>

              {/* 证书内容 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 pt-20">
                {/* 标题 */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 tracking-widest">
                  结课证书
                </h1>

                {/* 英文标题 */}
                <div className="flex items-center gap-3 mb-10">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <svg key={i} viewBox="0 0 24 24" fill="#374151" className="w-5 h-5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <div className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm tracking-widest">
                    COURSE COMPLETION CERTIFICATE
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <svg key={i} viewBox="0 0 24 24" fill="#374151" className="w-5 h-5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* 姓名 */}
                <p className="text-5xl md:text-6xl font-bold text-gray-700 mb-8">
                  王嘉诚
                </p>

                {/* 分隔线 */}
                <div className="flex items-center w-full mb-10">
                  <div className="w-4 h-2 bg-gray-800 rounded-full"></div>
                  <div className="flex-1 border-t-2 border-dotted border-gray-400 mx-2"></div>
                  <div className="w-4 h-2 bg-gray-800 rounded-full"></div>
                </div>

                {/* 课程名称 */}
                <p className="text-3xl font-bold text-gray-800 mb-8">
                  药理学
                </p>

                {/* 讲师 */}
                <p className="text-gray-600 mb-12">
                  课程讲师：王福刚
                </p>

                {/* 底部信息 */}
                <div className="absolute bottom-20 left-0 right-0 flex justify-between items-end px-12">
                  <div className="text-center">
                    <p className="text-gray-600 text-lg mb-2">证书编号</p>
                    <div className="w-32 h-px bg-gray-400 mb-2"></div>
                    <p className="text-gray-700 font-mono">2606100668392</p>
                  </div>

                  {/* 二维码 */}
                  <div className="w-28 h-28 bg-white border-2 border-gray-200 rounded flex items-center justify-center">
                    <div className="grid grid-cols-7 gap-px p-2">
                      {Array.from({ length: 49 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 ${
                            Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-600 text-lg mb-2">获得日期:</p>
                    <div className="w-32 h-px bg-gray-400 mb-2"></div>
                    <p className="text-gray-700 font-mono">2026-06-10</p>
                  </div>
                </div>
              </div>

              {/* 装饰花纹 - 底部 */}
              <div className="absolute bottom-8 left-8 right-8 flex items-center justify-center">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-700 to-transparent"></div>
                <div className="mx-4 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="1.5" className="w-6 h-6">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    <path d="M12 6v12M6 12h12" />
                  </svg>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-700 to-transparent"></div>
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