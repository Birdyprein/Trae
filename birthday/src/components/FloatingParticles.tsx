import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'heart' | 'star' | 'petal';
  color: string;
}

const COLORS = [
  '#FFB6C1',
  '#FF69B4',
  '#FF1493',
  '#FFD700',
  '#FFA500',
  '#FFC0CB',
  '#FFE4E1',
  '#FFB347',
];

const TYPES: Particle['type'][] = ['heart', 'star', 'petal'];

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createParticle = (): Particle => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 16 + 8,
        speedY: Math.random() * 1.5 + 0.5,
        speedX: Math.random() * 1 - 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        opacity: Math.random() * 0.6 + 0.2,
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    };

    const drawHeart = (x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
      ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
      ctx.fill();
      ctx.restore();
    };

    const drawStar = (x: number, y: number, size: number, color: string, opacity: number, rotation: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      const spikes = 5;
      const outerRadius = size / 2;
      const innerRadius = size / 4;
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawPetal = (x: number, y: number, size: number, color: string, opacity: number, rotation: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, size / 3, size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    for (let i = 0; i < 60; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      particlesRef.current.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          particle.speedX -= (dx / dist) * force * 0.5;
          particle.speedY -= (dy / dist) * force * 0.3;
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;
        particle.speedX += (Math.random() - 0.5) * 0.02;
        particle.speedX *= 0.99;

        if (particle.y > canvas.height + 50) {
          particlesRef.current[index] = createParticle();
          particlesRef.current[index].y = -50;
        }
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;

        if (particle.type === 'heart') {
          drawHeart(particle.x, particle.y, particle.size, particle.color, particle.opacity);
        } else if (particle.type === 'star') {
          drawStar(particle.x, particle.y, particle.size, particle.color, particle.opacity, particle.rotation);
        } else {
          drawPetal(particle.x, particle.y, particle.size, particle.color, particle.opacity, particle.rotation);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ touchAction: 'none' }}
    />
  );
}
