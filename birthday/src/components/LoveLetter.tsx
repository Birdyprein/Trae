import { useState } from 'react';
import { Heart, Sparkles, Mail, ChevronDown } from 'lucide-react';

const letterContent = [
  {
    text: 'Happy Birthday🎂。院子里的月季花又开了🌸，红艳的花瓣在晨风中轻轻摇曳，像你年轻时的容颜，才惊觉原来你已经走到39岁的路口⏳。时间总在不经意间溜走⏱️，那些你为我奔波的日夜却像慢镜头般在记忆里格外清晰📽️，想郑重地对你说声谢谢——谢谢你二十多年来从未间断的付出💦，谢谢你把所有心事都系在我身上的操心❤️，更谢谢你用肩膀扛起整个家的操劳🏠。',
  },
  {
    text: '记得我读中学时住读🏫，每周末都有我喜欢吃的菜。这可这份支持有时也会变成我们争吵的导火索💥。我嫌你不懂年轻人的思维🌈；你念叨我熬夜伤身体🍱，我不耐烦地打断你的叮嘱🙅♀️。每次吵完架我摔门而去🚪，回头却看见你偷偷抹眼泪😭，第二天依旧笑脸相迎。现在才明白，那些观念碰撞的背后💥，都是你怕我走弯路的苦心🗺️，是你把所有担忧都嚼碎了咽进肚子里的隐忍🤍。',
  },
  {
    text: '这些年让你费了太多心思💭，也受了不少委屈😔。我总在你操心时说"别管我"🙅，却忘了你也曾是爱穿花裙子的少女👗，相册里还收藏着你年少岁时和同学在学校拍的照片📸，那时的你梳着麻花辫，笑起来眼睛像弯弯的月牙🌙；我总在你唠叨时皱眉头🤨，却没发现你的白发已经悄悄爬上鬓角👩。以前的你那么年轻，皮肤白皙，头发乌黑浓密✨，可现在眼角的细纹里👀，都刻着为我操劳的痕迹，像老树的年轮，一圈圈记录着岁月的故事🌳。对不起，以前总让你生气😞，以后我会学着做个让你省心的孩子👧。',
  },
  {
    text: '39岁的你依然是我眼里最美的女神👑，就像你总说"妈妈永远是你的后盾"🛡️。以后我会少让你为我操心💭，生日快乐，我最爱的妈妈🎂，愿你的每一天都像图片中的玫瑰一样，温柔又灿烂🌸。',
  },
  {
    text: '（头发加油长起来，身体加油好起来）',
    italic: true,
  },
];

export default function LoveLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);

  const handleOpen = () => {
    setIsOpen(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index < letterContent.length) {
        setCurrentParagraph(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  };

  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-rose-300 text-sm tracking-[0.3em] mb-4">LOVE LETTER</p>
          <h2 className="text-4xl md:text-5xl font-display text-white mb-6">
            <span className="text-gradient-rose">给我的女神的一封信</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-lg font-serif">
            藏在心底的话，想亲口对你说
          </p>
        </div>

        {!isOpen ? (
          <div 
            onClick={handleOpen}
            className="glass-card-strong rounded-3xl p-12 md:p-16 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-rose-500/20 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Mail className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-display text-white mb-4">点击打开信封</h3>
              <p className="text-white/60 font-serif">里面有我想对你说的话...</p>
              <div className="mt-8 flex items-center gap-2 text-rose-300 animate-bounce">
                <span className="text-sm">点击阅读</span>
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card-strong rounded-3xl p-8 md:p-12 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400 rounded-t-3xl" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display text-white">给我的女神的一封信</h3>
                <p className="text-white/50 text-sm">爱你的孩子</p>
              </div>
            </div>

            <div className="space-y-6">
              {letterContent.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-white/80 leading-relaxed font-serif text-base md:text-lg transition-all duration-700 ${
                    index <= currentParagraph 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  } ${paragraph.italic ? 'italic text-white/60 text-center' : ''}`}
                  style={{ transitionDelay: `${(index - currentParagraph + 1) * 100}ms` }}
                >
                  {paragraph.text}
                </p>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-2">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-rose-400/50" />
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-rose-400/50" />
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-1/4 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
