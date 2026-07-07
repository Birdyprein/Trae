import { motion } from 'framer-motion';

export default function SkillsPage() {
  return (
    <section className="py-20 md:py-32 min-h-screen">
      <div className="container px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">技能</span>
          </h2>
          <p className="text-gray-400 font-body max-w-2xl mx-auto">
            我正在学习和掌握的技术栈
          </p>
        </motion.div>

        {/* 空白卡片网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-2xl h-48 card-hover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}