import { useEffect, useState } from 'react';

const COLORS = ['#6366f1', '#8b5cf6', '#ff2d95', '#00d4ff', '#fbbf24', '#34d399', '#f87171'];
const SHAPES = ['●', '■', '▲', '★', '♦', '♥'];

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  shape: string;
  size: number;
  speed: number;
  rotation: number;
}

export default function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      size: 12 + Math.random() * 16,
      speed: 1 + Math.random() * 2,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(timer);
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            color: p.color,
            fontSize: `${p.size}px`,
            animationDuration: `${2 + p.speed}s`,
            animationDelay: `${p.id * 0.03}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        >
          {p.shape}
        </div>
      ))}
    </div>
  );
}
