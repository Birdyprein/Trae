import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { personalInfo } from '../data/portfolio';

// 根据出生日期动态计算年龄和身份
function getAgeAndStatus() {
  const birthDate = new Date(2008, 1, 5); // 2008年2月5日
  const now = new Date();

  // 计算年龄
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }

  // 计算身份状态
  const enrollmentDate = new Date(2026, 8, 1); // 2026年9月1日
  const yearDiff = now.getFullYear() - enrollmentDate.getFullYear();

  let status = '准大学生';

  if (now >= enrollmentDate) {
    const month = now.getMonth() + 1;
    const semester = month >= 9 || month <= 1 ? 1 : 2;

    if (yearDiff === 0) {
      status = semester === 1 ? '大一新生' : '大一';
    } else if (yearDiff === 1) {
      status = '大二';
    } else if (yearDiff === 2) {
      status = '大三';
    } else if (yearDiff === 3) {
      status = '大四';
    } else {
      status = '已毕业';
    }
  }

  return { age, status };
}

// 粒子背景组件
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];
    const numParticles = 50;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.color = ['#00f5ff', '#a855f7', '#ec4899'][Math.floor(Math.random() * 3)];
        this.alpha = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      particles.length = 0;
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#00f5ff';
            ctx.globalAlpha = 0.1 * (1 - distance / 150);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}

export default function HomePage() {
  const { age, status } = getAgeAndStatus();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0 gradient-bg">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent-cyan/20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'blur(80px)' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent-purple/20"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'blur(80px)' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-accent-pink/10"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'blur(100px)' }}
        />
      </div>

      {/* 粒子效果 */}
      <ParticleBackground />

      {/* 内容 */}
      <div className="relative z-10 container px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 标签 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
            </span>
            <span className="text-sm text-gray-400 font-body">
              {status} · {age}岁
            </span>
          </motion.div>

          {/* 名字 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl font-bold mb-4"
          >
            <span className="text-gradient">{personalInfo.name}</span>
          </motion.h1>

          {/* 描述 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 font-body mb-8 max-w-2xl mx-auto"
          >
            热爱编程与设计
            <br />
            <span className="text-accent-cyan">不断学习，不断成长</span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}