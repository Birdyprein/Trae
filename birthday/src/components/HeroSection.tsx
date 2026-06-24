import { useBirthdayCountup } from '@/hooks/useAge';

const MOM_BIRTH_DATE = new Date(1987, 5, 5);
const CHILD_BIRTH_DATE = new Date(2007, 1, 5, 3, 48, 0);

export default function HeroSection() {
  const { years, days, hours, minutes, seconds } = useBirthdayCountup(CHILD_BIRTH_DATE);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative px-4 py-20">
      <div className="text-center z-10 max-w-4xl mx-auto">
        <div className="opacity-0-init animate-fade-in-up">
          <p className="text-rose-300 text-lg md:text-xl mb-4 tracking-[0.3em] font-serif">
            HAPPY BIRTHDAY
          </p>
        </div>

        <h1 className="opacity-0-init animate-fade-in-up animate-delay-200 font-display text-5xl md:text-7xl lg:text-8xl mb-6 text-gradient-rose leading-tight">
          妈妈，生日快乐
        </h1>

        <div className="opacity-0-init animate-fade-in-up animate-delay-400 mb-8">
          <p className="text-white/70 text-lg md:text-xl font-serif">
            1987年6月5日 · 最美的遇见
          </p>
        </div>

        <div className="opacity-0-init animate-fade-in-up animate-delay-600 glass-card-strong rounded-3xl p-8 md:p-10 mb-10 max-w-2xl mx-auto">
          <p className="text-rose-200 text-sm tracking-widest mb-6">您已经陪伴了我</p>
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {[
              { value: years, label: '年' },
              { value: days, label: '天' },
              { value: hours, label: '时' },
              { value: minutes, label: '分' },
              { value: seconds, label: '秒' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-gradient-gold font-display mb-2">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-white/60 text-xs md:text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="opacity-0-init animate-fade-in-up animate-delay-800">
          <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl mx-auto font-serif italic">
            "世界上有一种最美丽的声音，<br />
            那便是母亲的呼唤。"
          </p>
          <p className="text-white/50 text-sm mt-4">— 但丁</p>
        </div>

        <div className="opacity-0-init animate-fade-in-up animate-delay-1000 mt-16 animate-bounce-slow">
          <div className="text-white/40 text-sm mb-2">向下滑动</div>
          <svg className="w-6 h-6 mx-auto text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <div className="absolute top-20 left-10 w-32 h-32 md:w-48 md:h-48 bg-rose-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-16 w-24 h-24 md:w-40 md:h-40 bg-amber-400/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-40 left-1/4 w-40 h-40 md:w-56 md:h-56 bg-pink-500/15 rounded-full blur-3xl animate-float-fast" />
    </section>
  );
}
