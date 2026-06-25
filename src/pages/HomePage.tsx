import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ArtworkGrid from '../components/ArtworkGrid';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="relative h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="text-6xl md:text-8xl font-light text-[#1a1a1a] tracking-wider"
          style={{ fontFamily: '"Noto Serif SC", serif' }}
        >
          墨韵
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-6 text-[#2d4a5e] text-lg md:text-xl font-light tracking-widest"
        >
          数字诗意画廊
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12"
        >
          <Link
            to="/about"
            className="text-[#4a5568] text-sm tracking-widest hover:text-[#c73e3a] transition-colors"
          >
            关于
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#2d4a5e] to-transparent" />
          </motion.div>
        </motion.div>
      </header>

      <section className="py-24 md:py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-[#c73e3a] text-xs tracking-[0.3em] uppercase mb-4">Collection</p>
            <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a]">作品欣赏</h2>
          </motion.div>

          <ArtworkGrid />
        </div>
      </section>

      <footer className="py-12 text-center">
        <p className="text-[#4a5568] text-sm">© 2024 墨韵画廊</p>
      </footer>
    </div>
  );
}
