import { motion } from 'framer-motion';

const basicInfo = [
  { icon: 'birthday', label: '生日', value: '2008年2月5日' },
  { icon: 'zodiac', label: '星座', value: '水瓶座' },
  { icon: 'mbti', label: 'MBTI', value: 'INFP 调停者' },
  { icon: 'hometown', label: '家乡', value: '四川眉山' },
];

const hobbies = [
  { name: 'AI', icon: '🤖' },
  { name: '编程', icon: '💻' },
  { name: '游戏', icon: '🎮' },
  { name: '音乐', icon: '🎵' },
  { name: '羽毛球', icon: '🏸' },
  { name: '摄影', icon: '📷' },
];

const sports = [
  { name: '羽毛球', desc: '每一次挥拍都是释放活力的仪式', icon: '🏸' },
  { name: '骑行', desc: '车轮碾过道路的痕迹，都是探索日记', icon: '🚴' },
];

export default function AboutPage() {
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
            <span className="text-gradient">关于我</span>
          </h2>
          <p className="text-gray-400 font-body max-w-2xl mx-auto">
            了解更多关于我的信息
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* 个人简介 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-2xl p-8 card-hover"
          >
            <h3 className="font-display text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> 个人简介
            </h3>
            <p className="text-gray-300 font-body leading-relaxed text-base">
              一个2008年2月5日出生的水瓶座男生，一枚典型的INFP调停者。
              骨子里带着水瓶的独立与好奇，灵魂里藏着INFP的理想与细腻。
              热爱用羽毛球与风对话——每一次挥拍都是释放活力的仪式；
              也迷恋骑着单车追逐自由，车轮碾过道路的痕迹，都是我对世界的探索日记。
              安静时享受与自己对话，热闹时也能和同频的人聊到星空。
              如果你也爱运动、爱生活、或只是想找个树洞分享奇思妙想，欢迎来敲我的窗口，期待与有趣的灵魂相遇！🌿🚴
            </p>
          </motion.div>

          {/* 座右铭 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass rounded-2xl p-8 card-hover text-center"
          >
            <p className="text-accent-cyan font-display text-2xl md:text-3xl font-bold mb-2">
              「 休恋逝水，早悟兰因 」
            </p>
            <p className="text-gray-500 font-body text-sm">—— 我的座右铭</p>
          </motion.div>

          {/* 基本信息 + 教育背景 */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* 基本信息 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass rounded-2xl p-8 card-hover"
            >
              <h3 className="font-display text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">📋</span> 基本信息
              </h3>
              <div className="space-y-4">
                {basicInfo.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-gray-400 font-body text-sm">
                      {item.label}
                    </div>
                    <div className="flex-1 text-white font-body">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 教育背景 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="glass rounded-2xl p-8 card-hover"
            >
              <h3 className="font-display text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🎓</span> 教育背景
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-accent-cyan mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-body font-medium">
                      四川眉山田家炳实验中学
                    </p>
                    <p className="text-gray-400 font-body text-sm">高中</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-accent-purple mt-1.5 flex-shrink-0 opacity-50"></div>
                  <div>
                    <p className="text-white font-body font-medium">准大学生</p>
                    <p className="text-gray-400 font-body text-sm">即将开启大学之旅</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 兴趣爱好 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass rounded-2xl p-8 card-hover"
          >
            <h3 className="font-display text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">🎯</span> 兴趣爱好
            </h3>
            <div className="flex flex-wrap gap-3">
              {hobbies.map((hobby, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <span className="text-xl">{hobby.icon}</span>
                  <span className="text-gray-300 font-body text-sm">{hobby.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 运动 + 正在学习 */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* 运动 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="glass rounded-2xl p-8 card-hover"
            >
              <h3 className="font-display text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">⚡</span> 热爱的运动
              </h3>
              <div className="space-y-4">
                {sports.map((sport, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3 rounded-xl bg-white/5"
                  >
                    <span className="text-3xl">{sport.icon}</span>
                    <div>
                      <p className="text-white font-body font-medium">{sport.name}</p>
                      <p className="text-gray-400 font-body text-sm">{sport.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 正在学习 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass rounded-2xl p-8 card-hover"
            >
              <h3 className="font-display text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">📚</span> 正在学习
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                  <span className="text-3xl">🐍</span>
                  <div>
                    <p className="text-white font-body font-medium">Python</p>
                    <p className="text-gray-400 font-body text-sm">持续学习中...</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}