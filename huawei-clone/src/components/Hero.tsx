"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface)]/80 via-transparent to-[var(--background)] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(206,14,45,0.08),transparent_70%)]" />
        {/* Product image placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-b from-[var(--surface-elevated)] to-transparent opacity-40 blur-3xl" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="flex flex-col gap-6">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] font-medium">
              全新发布
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1] text-white">
              HUAWEI Mate 70
              <br />
              <span className="text-[var(--text-secondary)] font-light">
                领势而上
              </span>
            </h1>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-[480px]">
              搭载 HarmonyOS NEXT，XMAGE 影像系统，昆仑玻璃，卫星通信。
              以非凡实力，开启智慧新篇章。
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--background)] text-sm font-medium rounded-full hover:bg-gray-200 transition-all duration-200 active:scale-[0.98]"
              >
                了解更多
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border)] text-white text-sm font-medium rounded-full hover:bg-[var(--surface)] transition-all duration-200 active:scale-[0.98]"
              >
                立即购买
              </a>
            </div>
          </div>

          {/* Right: Product visual */}
          <div className="relative flex items-center justify-center">
            {/* Simulated phone render */}
            <div className="relative w-[280px] h-[560px]">
              {/* Phone body */}
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#111] border-2 border-[var(--border)] shadow-2xl overflow-hidden">
                {/* Screen */}
                <div className="absolute inset-[8px] rounded-[33px] bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden">
                  {/* Camera hole */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-10" />
                  {/* Screen content hints */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pt-12">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[var(--accent)]/40" />
                    </div>
                    <div className="text-center">
                      <p className="text-white text-xs font-medium tracking-wide">HarmonyOS</p>
                      <p className="text-[var(--text-secondary)] text-[10px] mt-1">NEXT</p>
                    </div>
                  </div>
                </div>
                {/* Side buttons */}
                <div className="absolute right-[-2px] top-28 w-[3px] h-12 bg-[#333] rounded-r" />
                <div className="absolute right-[-2px] top-44 w-[3px] h-20 bg-[#333] rounded-r" />
                <div className="absolute left-[-2px] top-32 w-[3px] h-8 bg-[#333] rounded-l" />
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-20 bg-[var(--accent)]/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}