import { useState } from 'react';
import { motion } from 'framer-motion';

const categories = ['全部', '前端', '后端', '设计'];
const placeholderCount = 3;

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('全部');

  return (
    <section id="projects" className="py-20 md:py-32">
      <div className="container px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">作品</span>
          </h2>
          <p className="text-gray-400 font-body max-w-2xl mx-auto">
            我完成的一些项目作品
          </p>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-4 mb-12"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-body text-sm transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white'
                  : 'glass text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* 空白项目网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Array.from({ length: placeholderCount }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-2xl h-64 card-hover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}