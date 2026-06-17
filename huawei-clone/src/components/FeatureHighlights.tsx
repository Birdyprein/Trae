"use client";
import { useEffect, useRef, useState } from "react";

interface Feature {
  icon: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
}

const features: Feature[] = [
  {
    icon: "camera",
    title: "XMAGE 影像系统",
    description: "物理可变光圈，AI 影像引擎，让每一拍都成为大片。从超广角到长焦，全焦段覆盖。",
    stat: "50MP",
    statLabel: "超感知主摄",
  },
  {
    icon: "battery",
    title: "超大容量电池",
    description: "硅碳负极电池技术，轻薄机身容纳更大电量。智能省电算法，续航更持久。",
    stat: "5800mAh",
    statLabel: "典型容量",
  },
  {
    icon: "satellite",
    title: "卫星通信",
    description: "支持天通卫星通话与北斗卫星消息，无地面网络也能保持联络。",
    stat: "双卫星",
    statLabel: "通信方案",
  },
  {
    icon: "shield",
    title: "昆仑玻璃",
    description: "第二代昆仑玻璃，整机耐摔能力提升至 2 倍。IP68 级防尘抗水。",
    stat: "2x",
    statLabel: "耐摔提升",
  },
];

export default function FeatureHighlights() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll(".feature-card");
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.classList.add("opacity-100", "translate-y-0");
                card.classList.remove("opacity-0", "translate-y-8");
              }, i * 120);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-[var(--surface)]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">
            旗舰实力
          </h2>
          <p className="text-[var(--text-secondary)] mt-3 max-w-[480px]">
            每一项技术突破，都为更好的体验而生
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="feature-card opacity-0 translate-y-8 transition-all duration-500 ease-out group relative rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-8 hover:border-[var(--accent)]/30 hover:bg-[var(--surface-elevated)]/80"
              onMouseEnter={() => setActiveIndex(i)}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mb-6 group-hover:bg-[var(--accent)]/20 transition-colors">
                <FeatureIcon type={feature.icon} />
              </div>

              {/* Text */}
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 max-w-[400px]">
                {feature.description}
              </p>

              {/* Stat */}
              <div className="pt-6 border-t border-[var(--border)]">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white font-mono tracking-tight">
                    {feature.stat}
                  </span>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {feature.statLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureIcon({ type }: { type: string }) {
  switch (type) {
    case "camera":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent)]">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    case "battery":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent)]">
          <rect x="1" y="6" width="18" height="12" rx="2" />
          <line x1="23" y1="10" x2="23" y2="14" />
          <line x1="7" y1="10" x2="7" y2="14" />
          <line x1="11" y1="10" x2="11" y2="14" />
        </svg>
      );
    case "satellite":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent)]">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
        </svg>
      );
    case "shield":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent)]">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    default:
      return null;
  }
}