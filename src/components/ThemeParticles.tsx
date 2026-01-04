import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
  duration: number;
  opacity: number;
}

type ParticleType = 'flower' | 'snow' | 'leaf' | 'confetti' | 'heart' | 'firework' | 'lantern' | 'lucky-money';

const useParticles = (count: number, type: ParticleType) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const generateParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        size: type === 'confetti' ? 8 + Math.random() * 8 : 10 + Math.random() * 15,
        rotation: Math.random() * 360,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 7,
        opacity: 0.6 + Math.random() * 0.4,
      });
    }
    setParticles(newParticles);
  }, [count, type]);

  useEffect(() => {
    generateParticles();
  }, [generateParticles]);

  return particles;
};

// Flower particles for Spring
const FlowerParticle = ({ particle }: { particle: Particle }) => {
  const flowerColors = ['#FFB7C5', '#FFC0CB', '#FFE4E9', '#FFDEE6', '#FF69B4'];
  const color = flowerColors[particle.id % flowerColors.length];

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
      initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
      animate={{
        y: ['0vh', '110vh'],
        x: [0, Math.sin(particle.id) * 100],
        rotate: [0, 360 * (particle.id % 2 === 0 ? 1 : -1)],
        opacity: [0, particle.opacity, particle.opacity, 0],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg width={particle.size} height={particle.size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2C12 2 14 6 14 8C14 10 12 12 12 12C12 12 10 10 10 8C10 6 12 2 12 2Z" />
        <path d="M12 12C12 12 16 10 18 10C20 10 22 12 22 12C22 12 20 14 18 14C16 14 12 12 12 12Z" />
        <path d="M12 12C12 12 14 16 14 18C14 20 12 22 12 22C12 22 10 20 10 18C10 16 12 12 12 12Z" />
        <path d="M12 12C12 12 8 10 6 10C4 10 2 12 2 12C2 12 4 14 6 14C8 14 12 12 12 12Z" />
        <circle cx="12" cy="12" r="2" fill="#FFD700" />
      </svg>
    </motion.div>
  );
};

// Snow particles for Winter/Christmas
const SnowParticle = ({ particle }: { particle: Particle }) => (
  <motion.div
    className="fixed pointer-events-none z-50"
    style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
    initial={{ y: 0, x: 0, opacity: 0 }}
    animate={{
      y: ['0vh', '110vh'],
      x: [0, Math.sin(particle.id * 0.5) * 50],
      opacity: [0, particle.opacity, particle.opacity, 0],
    }}
    transition={{
      duration: particle.duration,
      delay: particle.delay,
      repeat: Infinity,
      ease: 'linear',
    }}
  >
    <svg width={particle.size} height={particle.size} viewBox="0 0 24 24" fill="white">
      <circle cx="12" cy="12" r="4" opacity="0.9" />
      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" 
        stroke="white" strokeWidth="1" opacity="0.5" />
    </svg>
  </motion.div>
);

// Leaf particles for Autumn
const LeafParticle = ({ particle }: { particle: Particle }) => {
  const leafColors = ['#D2691E', '#CD853F', '#8B4513', '#A0522D', '#FF6347', '#DAA520'];
  const color = leafColors[particle.id % leafColors.length];

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
      initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
      animate={{
        y: ['0vh', '110vh'],
        x: [0, Math.sin(particle.id) * 150, Math.cos(particle.id) * 100],
        rotate: [0, 180, 360, 540],
        opacity: [0, particle.opacity, particle.opacity, 0],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg width={particle.size} height={particle.size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2C8 6 4 10 4 14C4 18 8 22 12 22C16 22 20 18 20 14C20 10 16 6 12 2Z" />
        <path d="M12 6V18" stroke={color} strokeWidth="1" opacity="0.5" />
        <path d="M8 10L12 14L16 10" stroke={color} strokeWidth="1" opacity="0.3" fill="none" />
      </svg>
    </motion.div>
  );
};

// Confetti particles for New Year
const ConfettiParticle = ({ particle }: { particle: Particle }) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
  const color = colors[particle.id % colors.length];
  const shapes = ['rect', 'circle', 'triangle'];
  const shape = shapes[particle.id % shapes.length];

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
      initial={{ y: 0, x: 0, rotate: 0, opacity: 0, scale: 0 }}
      animate={{
        y: ['0vh', '110vh'],
        x: [0, (Math.random() - 0.5) * 200],
        rotate: [0, 720 * (particle.id % 2 === 0 ? 1 : -1)],
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0.5],
      }}
      transition={{
        duration: particle.duration * 0.7,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    >
      <svg width={particle.size} height={particle.size} viewBox="0 0 20 20">
        {shape === 'rect' && <rect x="2" y="2" width="16" height="16" fill={color} rx="2" />}
        {shape === 'circle' && <circle cx="10" cy="10" r="8" fill={color} />}
        {shape === 'triangle' && <polygon points="10,2 18,18 2,18" fill={color} />}
      </svg>
    </motion.div>
  );
};

// Heart particles for Valentine
const HeartParticle = ({ particle }: { particle: Particle }) => {
  const heartColors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FF6B6B', '#E91E63'];
  const color = heartColors[particle.id % heartColors.length];

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
      initial={{ y: 0, scale: 0, opacity: 0 }}
      animate={{
        y: [0, -200 - Math.random() * 300],
        x: [0, (Math.random() - 0.5) * 100],
        scale: [0, 1, 1.2, 1, 0],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    >
      <svg width={particle.size} height={particle.size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </motion.div>
  );
};

// Lucky money for Tet
const LuckyMoneyParticle = ({ particle }: { particle: Particle }) => (
  <motion.div
    className="fixed pointer-events-none z-50"
    style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
    initial={{ y: 0, rotate: -10, opacity: 0 }}
    animate={{
      y: ['0vh', '110vh'],
      x: [0, Math.sin(particle.id) * 50],
      rotate: [-10, 10, -10],
      opacity: [0, particle.opacity, particle.opacity, 0],
    }}
    transition={{
      duration: particle.duration,
      delay: particle.delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    <svg width={particle.size * 1.5} height={particle.size * 2} viewBox="0 0 30 40">
      <rect x="2" y="2" width="26" height="36" rx="3" fill="#DC143C" />
      <rect x="4" y="4" width="22" height="32" rx="2" fill="#FF0000" />
      <circle cx="15" cy="20" r="8" fill="#FFD700" />
      <text x="15" y="24" textAnchor="middle" fontSize="10" fill="#DC143C" fontWeight="bold">福</text>
    </svg>
  </motion.div>
);

interface ThemeParticlesProps {
  theme: string;
}

const ThemeParticles = ({ theme }: ThemeParticlesProps) => {
  const getParticleConfig = (): { type: ParticleType; count: number } | null => {
    switch (theme) {
      case 'spring':
        return { type: 'flower', count: 20 };
      case 'winter':
      case 'christmas':
        return { type: 'snow', count: 35 };
      case 'autumn':
        return { type: 'leaf', count: 25 };
      case 'new-year':
        return { type: 'confetti', count: 40 };
      case 'valentine':
        return { type: 'heart', count: 15 };
      case 'tet':
        return { type: 'lucky-money', count: 12 };
      default:
        return null;
    }
  };

  const config = getParticleConfig();
  const particles = useParticles(config?.count || 0, config?.type || 'snow');

  if (!config) return null;

  const renderParticle = (particle: Particle) => {
    switch (config.type) {
      case 'flower':
        return <FlowerParticle key={particle.id} particle={particle} />;
      case 'snow':
        return <SnowParticle key={particle.id} particle={particle} />;
      case 'leaf':
        return <LeafParticle key={particle.id} particle={particle} />;
      case 'confetti':
        return <ConfettiParticle key={particle.id} particle={particle} />;
      case 'heart':
        return <HeartParticle key={particle.id} particle={particle} />;
      case 'lucky-money':
        return <LuckyMoneyParticle key={particle.id} particle={particle} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
        {particles.map(renderParticle)}
      </div>
    </AnimatePresence>
  );
};

export default ThemeParticles;
