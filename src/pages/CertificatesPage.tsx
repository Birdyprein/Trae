import { motion } from 'framer-motion';

export default function CertificatesPage() {
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
            <span className="text-gradient">证书</span>
          </h2>
          <p className="text-gray-400 font-body max-w-2xl mx-auto">
            我获得的证书和荣誉
          </p>
        </motion.div>

        {/* 证书展示 */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass rounded-2xl p-6 md:p-8 card-hover"
          >
            {/* 证书图片 */}
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://s41.ax1x.com/2026/07/01/pmdj5z4.png"
                alt="药理学结课证书"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}