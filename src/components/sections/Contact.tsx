import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { personalInfo, socialLinks } from '../../data/portfolio';

export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="container px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">联系我</span>
          </h2>
          <p className="text-gray-400 font-body max-w-2xl mx-auto">
            有任何问题或想法？欢迎随时联系我
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8 text-center"
          >
            {/* 邮箱图标 */}
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0, 245, 255, 0.3)',
                  '0 0 40px rgba(168, 85, 247, 0.5)',
                  '0 0 20px rgba(0, 245, 255, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </motion.div>

            {/* 邮箱地址 */}
            <h3 className="font-display text-xl font-semibold text-white mb-2">
              电子邮箱
            </h3>
            <p className="text-accent-cyan font-body text-lg mb-6">
              {personalInfo.email}
            </p>

            {/* 发送邮件按钮 */}
            <Button href={`mailto:${personalInfo.email}`} variant="primary" size="lg">
              发送邮件
            </Button>

            {/* 提示 */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 text-sm font-body mt-6"
            >
              点击按钮直接发送邮件给我
            </motion.p>
          </motion.div>

          {/* 其他联系方式 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 font-body text-sm">
              也可以通过以下方式联系我：
            </p>
            <div className="flex justify-center gap-4 mt-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.icon === 'mail' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}