import { Heart, Sparkles, Gift, Sun } from 'lucide-react';

const cards = [
  {
    icon: Heart,
    title: '感谢养育之恩',
    content: '您用十月怀胎的辛苦，换我来到这个世界；用无数个不眠之夜，换我健康成长。每一顿饭、每一件衣、每一句叮咛，都是您用爱编织的温暖。',
    color: 'from-rose-400 to-pink-500',
    delay: 'animate-delay-100',
  },
  {
    icon: Sparkles,
    title: '感谢无私付出',
    content: '您总是把最好的留给我，自己却默默承担着生活的重担。您的爱是那么深沉，那么无私，让我在每一个艰难的时刻，都能感受到力量与勇气。',
    color: 'from-amber-400 to-orange-500',
    delay: 'animate-delay-300',
  },
  {
    icon: Sun,
    title: '感谢温暖陪伴',
    content: '无论我走多远，您永远是我最坚实的后盾。在我成功时为我高兴，在我失落时给我安慰。谢谢您，一直在我身边，用爱照亮我前行的路。',
    color: 'from-rose-300 to-red-400',
    delay: 'animate-delay-500',
  },
  {
    icon: Gift,
    title: '祝愿幸福安康',
    content: '愿岁月温柔以待，愿您永远健康快乐。愿您的每一天都充满阳光，愿您的每一个愿望都能实现。妈妈，余生换我来守护您。',
    color: 'from-pink-400 to-rose-500',
    delay: 'animate-delay-700',
  },
];

export default function GratitudeCards() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-rose-300 text-sm tracking-[0.3em] mb-4 opacity-0-init animate-fade-in-up">GRATITUDE</p>
          <h2 className="text-4xl md:text-5xl font-display text-white mb-6 opacity-0-init animate-fade-in-up animate-delay-200">
            <span className="text-gradient-rose">想对您说</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-lg font-serif opacity-0-init animate-fade-in-up animate-delay-300">
            千言万语，道不尽的感恩
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`opacity-0-init animate-fade-in-up ${card.delay} glass-card rounded-2xl p-8 md:p-10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-rose-500/10 group cursor-default`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-display text-white mb-4">{card.title}</h3>
                <p className="text-white/70 leading-relaxed font-serif text-base md:text-lg">
                  {card.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute top-1/3 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
