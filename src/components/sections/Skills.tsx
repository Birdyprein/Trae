import { motion } from 'framer-motion';
import { skills } from '../../data/portfolio';

export default function Skills() {
  // 按类别分组
  const categories = ['前端', '后端', '工具', '设计'];
  const groupedSkills = categories.map((cat) => ({
    category: cat,
    skills: skills.filter((s) => s.category === cat),
  }));

  return (
    <section id="skills" className="py-20 md:py-32">
      <div className="container px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {groupedSkills.map((group, groupIndex) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              {/* 类别标题 */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    groupIndex === 0
                      ? 'bg-gradient-to-br from-accent-cyan to-accent-purple'
                      : groupIndex === 1
                      ? 'bg-gradient-to-br from-accent-purple to-accent-pink'
                      : groupIndex === 2
                      ? 'bg-gradient-to-br from-accent-pink to-accent-cyan'
                      : 'bg-gradient-to-br from-green-400 to-emerald-500'
                  }`}
                >
                  <span className="text-white text-lg">
                    {groupIndex === 0 ? '💻' : groupIndex === 1 ? '⚙️' : groupIndex === 2 ? '🔧' : '🎨'}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-white">
                  {group.category}
                </h3>
              </div>

              {/* 技能列表 */}
              <div className="space-y-4">
                {group.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: groupIndex * 0.1 + skillIndex * 0.05 }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300 font-body">{skill.name}</span>
                      <span className="text-xs text-gray-500 font-body">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: groupIndex * 0.1 + skillIndex * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}