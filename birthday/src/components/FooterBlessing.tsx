export default function FooterBlessing() {
  return (
    <section className="py-32 px-4 relative">
      <div className="max-w-3xl mx-auto text-center">
        <div className="glass-card-strong rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-rose-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <p className="text-rose-300 text-sm tracking-[0.3em] mb-6 opacity-0-init animate-fade-in-up">WITH LOVE</p>
            
            <h2 className="text-4xl md:text-6xl font-display text-white mb-8 leading-tight opacity-0-init animate-fade-in-up animate-delay-200">
              <span className="text-gradient-rose">生日快乐，</span>
              <br />
              <span className="text-gradient-gold">我最爱的妈妈</span>
            </h2>

            <div className="space-y-6 mb-10 opacity-0-init animate-fade-in-up animate-delay-400">
              <p className="text-white/80 text-lg md:text-xl font-serif leading-relaxed">
                感谢您不是超人，却为我变成了万能。
              </p>
              <p className="text-white/80 text-lg md:text-xl font-serif leading-relaxed">
                愿您被岁月温柔以待，<br className="md:hidden" />
                愿您的笑容永远灿烂如花。
              </p>
              <p className="text-white/80 text-lg md:text-xl font-serif leading-relaxed">
                往后的日子，换我来守护您。
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 opacity-0-init animate-fade-in-up animate-delay-600">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-rose-400/50" />
              <span className="text-3xl">❤️</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-rose-400/50" />
            </div>

            <div className="mt-10 opacity-0-init animate-fade-in-up animate-delay-800">
              <p className="text-white/60 font-serif italic text-lg">
                永远爱您的孩子
              </p>
              <p className="text-white/40 text-sm mt-2">
                {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-white/40 text-sm opacity-0-init animate-fade-in-up animate-delay-1000">
          Made with ❤️ for the best mom in the world
        </div>
      </div>
    </section>
  );
}
