import { useState, useEffect } from 'react';

interface Confetti {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

const COLORS = ['#FFB6C1', '#FF69B4', '#FFD700', '#FFA500', '#FF1493', '#FFC0CB'];

export default function BirthdayCake() {
  const [candlesLit, setCandlesLit] = useState([true, true, true, true, true]);
  const [allBlown, setAllBlown] = useState(false);
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  const blowCandle = (index: number) => {
    if (!candlesLit[index]) return;
    
    const newCandles = [...candlesLit];
    newCandles[index] = false;
    setCandlesLit(newCandles);

    if (newCandles.every(c => !c)) {
      setAllBlown(true);
      launchConfetti();
    }
  };

  const launchConfetti = () => {
    const newConfetti: Confetti[] = [];
    for (let i = 0; i < 80; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 1,
        duration: 2 + Math.random() * 2,
        size: 6 + Math.random() * 10,
      });
    }
    setConfetti(newConfetti);
  };

  const relightCandles = () => {
    setCandlesLit([true, true, true, true, true]);
    setAllBlown(false);
    setConfetti([]);
  };

  const litCount = candlesLit.filter(Boolean).length;

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-rose-300 text-sm tracking-[0.3em] mb-4">BIRTHDAY CAKE</p>
          <h2 className="text-4xl md:text-5xl font-display text-white mb-6">
            <span className="text-gradient-gold">许个愿吧</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-lg font-serif">
            点击蜡烛，吹灭它们，许下你的心愿
          </p>
        </div>

        <div className="relative flex flex-col items-center">
          {confetti.map((c) => (
            <div
              key={c.id}
              className="absolute top-0 z-20 rounded-sm"
              style={{
                left: `${c.x}%`,
                width: `${c.size}px`,
                height: `${c.size}px`,
                backgroundColor: c.color,
                animation: `confettiFall ${c.duration}s ease-out ${c.delay}s forwards`,
                opacity: 0,
              }}
            />
          ))}

          <div className="relative" style={{ perspective: '800px' }}>
            <div className="relative cursor-pointer transform hover:scale-105 transition-transform duration-500">
              <div className="flex justify-center gap-3 md:gap-4 mb-0 relative z-10">
                {candlesLit.map((lit, index) => (
                  <div
                    key={index}
                    onClick={() => blowCandle(index)}
                    className="flex flex-col items-center"
                  >
                    {lit && (
                      <div className="relative mb-1">
                        <div 
                          className="w-3 h-5 md:w-4 md:h-6 rounded-full bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 animate-candle-flicker"
                          style={{ filter: 'blur(1px)' }}
                        />
                        <div 
                          className="absolute -inset-2 rounded-full bg-orange-400/30 animate-candle-flicker"
                          style={{ filter: 'blur(8px)' }}
                        />
                      </div>
                    )}
                    <div className="w-2 h-12 md:h-14 bg-gradient-to-b from-pink-200 via-pink-300 to-pink-400 rounded-full relative">
                      <div className="absolute inset-x-0 top-1/4 h-px bg-white/30" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative mt-0">
                <div className="w-64 md:w-80 h-16 md:h-20 bg-gradient-to-b from-rose-300 via-rose-400 to-rose-500 rounded-t-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-white/10" />
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="w-3 h-3 rounded-full bg-white/40" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="w-72 md:w-96 h-20 md:h-24 bg-gradient-to-b from-pink-200 via-pink-300 to-pink-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-white/10" />
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-3">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="w-4 h-4 rounded-full bg-white/50" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="w-80 md:w-[28rem] h-24 md:h-28 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 rounded-b-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4">
                    {[...Array(11)].map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-white/40" />
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-6 right-6 flex justify-between">
                    <div className="w-8 h-8 rounded-full bg-rose-400/60" />
                    <div className="w-8 h-8 rounded-full bg-pink-400/60" />
                    <div className="w-8 h-8 rounded-full bg-rose-400/60" />
                    <div className="w-8 h-8 rounded-full bg-pink-400/60" />
                    <div className="w-8 h-8 rounded-full bg-rose-400/60" />
                  </div>
                </div>
              </div>

              <div className="w-[28rem] md:w-[32rem] h-6 bg-gradient-to-b from-amber-600 to-amber-700 rounded-b-lg mx-auto -mt-1 shadow-lg" />
              <div className="w-[30rem] md:w-[34rem] h-4 bg-gradient-to-b from-amber-700 to-amber-800 rounded-b-xl mx-auto shadow-xl" />
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/70 mb-4 font-serif">
              {allBlown 
                ? '🎉 愿望成真！祝你生日快乐！' 
                : `还剩 ${litCount} 根蜡烛，点击吹灭吧`
              }
            </p>
            {allBlown && (
              <button
                onClick={relightCandles}
                className="glass-button px-8 py-3 rounded-full text-white font-semibold"
              >
                再点一次 ✨
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-10 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute bottom-20 right-16 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none animate-float" />
    </section>
  );
}
