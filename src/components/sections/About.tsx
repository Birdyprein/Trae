import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32">
      <div className="container px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">关于我</span>
          </h2>
          <p className="text-gray-400 font-body max-w-2xl mx-auto">
            了解更多关于我的信息
          </p>
        </motion.div>

        {/* 空白卡片网格 */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Array.from({ length: 3 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
              className={`glass rounded-2xl h-40 card-hover ${index === 2 ? 'md:col-span-2' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}