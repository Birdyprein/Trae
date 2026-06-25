import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Instagram } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#4a5568] hover:text-[#c73e3a] transition-colors mb-12"
        >
          <ArrowLeft size={16} />
          <span className="text-sm tracking-widest">返回</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#c73e3a] text-xs tracking-[0.3em] uppercase mb-4">About</p>
          <h1 className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-8">墨韵</h1>

          <div className="space-y-6 text-[#4a5568] leading-relaxed">
            <p>
              墨韵是一个融合东方水墨美学与现代数字艺术的实验性画廊项目。
              我们探索传统艺术在数字时代的表现可能性，让水墨的灵动与留白的意境
              在屏幕间流淌。
            </p>
            <p>
              每一件作品都配以古典诗词，旨在营造一个可以让观者沉思、冥想的空间。
              在这里，时间仿佛慢了下来，让我们得以在喧嚣中寻得一方宁静。
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 pt-12 border-t border-[#e8e4dc]"
        >
          <h2 className="text-lg font-light text-[#1a1a1a] mb-6">创作历程</h2>
          <div className="space-y-4 text-[#4a5568]">
            <div className="flex gap-4">
              <span className="text-[#c73e3a] text-sm">2024</span>
              <p>开启数字水墨实验项目</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#c73e3a] text-sm">2023</span>
              <p>完成首批六幅数字水墨作品</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[#c73e3a] text-sm">2022</span>
              <p>探索传统水墨画的数字化表达</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-lg font-light text-[#1a1a1a] mb-6">联系方式</h2>
          <div className="space-y-3">
            <a
              href="mailto:contact@moyun.art"
              className="flex items-center gap-3 text-[#4a5568] hover:text-[#c73e3a] transition-colors"
            >
              <Mail size={18} />
              <span className="text-sm">contact@moyun.art</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-[#4a5568] hover:text-[#c73e3a] transition-colors"
            >
              <Instagram size={18} />
              <span className="text-sm">@moyun_art</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
