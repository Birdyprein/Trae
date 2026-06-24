const timelineData = [
  {
    year: '1987',
    date: '6月5日',
    title: '你来到这个世界',
    description: '在一个美好的夏日，你呱呱坠地，成为这个世界上最珍贵的礼物。从那一刻起，你就是爸妈的掌上明珠。',
    icon: '🌸',
  },
  {
    year: '...',
    date: '成长岁月',
    title: '快乐的少女时光',
    description: '从懵懂孩童到亭亭玉立，你用笑容感染身边每一个人。那些青葱岁月，是你最美好的青春记忆。',
    icon: '🌺',
  },
  {
    year: '...',
    date: '爱的抉择',
    title: '组建了自己的小家',
    description: '你遇见了生命中的他，携手步入婚姻殿堂。从此，两个人的温暖变成了一个家的幸福。',
    icon: '💒',
  },
  {
    year: '...',
    date: '爱的延续',
    title: '我来到了你的身边',
    description: '你成为了妈妈，这是你最伟大的角色。你用全部的爱呵护我长大，教我认识这个美丽的世界。',
    icon: '👶',
  },
  {
    year: '今天',
    date: '6月5日',
    title: '生日快乐，妈妈',
    description: '岁月流转，但你的爱从未改变。今天，让我为你庆祝，愿你永远年轻，永远幸福。',
    icon: '🎂',
    highlight: true,
  },
];

export default function Timeline() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-rose-300 text-sm tracking-[0.3em] mb-4 opacity-0-init animate-fade-in-up">TIMELINE</p>
          <h2 className="text-4xl md:text-5xl font-display text-white mb-6 opacity-0-init animate-fade-in-up animate-delay-200">
            <span className="text-gradient-rose">时光的印记</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-lg font-serif opacity-0-init animate-fade-in-up animate-delay-300">
            每一段岁月，都是爱的痕迹
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-500/50 via-pink-500/30 to-amber-400/50 transform md:-translate-x-1/2" />

          {timelineData.map((item, index) => (
            <div
              key={index}
              className={`relative flex mb-12 md:mb-16 last:mb-0 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className="flex-1 hidden md:block" />

              <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 transform -translate-x-1/2 mt-6 z-10 ring-4 ring-[#1a0a1f]">
                <div className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-40" />
              </div>

              <div className="flex-1 ml-16 md:ml-0">
                <div
                  className={`glass-card rounded-2xl p-6 md:p-8 transition-all duration-500 hover:scale-[1.02] ${
                    item.highlight ? 'ring-2 ring-rose-400/50 glow-rose' : ''
                  } ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p className="text-rose-300 text-sm font-semibold">{item.year}</p>
                      <p className="text-white/50 text-xs">{item.date}</p>
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-display text-white mb-3">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed font-serif">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
