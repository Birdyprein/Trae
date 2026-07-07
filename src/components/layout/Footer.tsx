import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="py-8 border-t border-white/10">
      <div className="container px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-sm font-body"
          >
            © 2024 LLL. All rights reserved.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-500 text-xs font-body"
          >
            Made with ❤️ by a passionate learner
          </motion.p>
        </div>
      </div>
    </footer>
  );
}