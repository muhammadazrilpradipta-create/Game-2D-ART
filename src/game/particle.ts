/**
 * Particle & Visual Effects Engine
 * ROBOT MINI GAMES: Dust, Energy Sparkles, Electric Sparks & Floating HUD Text
 */

import { Particle } from '../types/game';

let particleIdCounter = 0;

export function createDustParticle(x: number, y: number): Particle {
  return {
    id: particleIdCounter++,
    x,
    y,
    vx: (Math.random() - 0.5) * 60,
    vy: -Math.random() * 35 - 10,
    color: 'rgba(203, 213, 225, 0.7)',
    size: Math.random() * 4 + 3,
    life: 0,
    maxLife: 0.35,
    type: 'dust',
  };
}

export function createSparkleParticle(x: number, y: number, color: string = '#FBBF24'): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 80 + 40;
  return {
    id: particleIdCounter++,
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    color,
    size: Math.random() * 5 + 3,
    life: 0,
    maxLife: 0.5,
    type: 'sparkle',
  };
}

export function createSparkParticle(x: number, y: number, color: string = '#38BDF8'): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 140 + 60;
  return {
    id: particleIdCounter++,
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    color,
    size: Math.random() * 4 + 2,
    life: 0,
    maxLife: 0.4,
    type: 'spark',
  };
}

export function createElectricParticle(x: number, y: number): Particle {
  return {
    id: particleIdCounter++,
    x,
    y,
    vx: (Math.random() - 0.5) * 110,
    vy: -Math.random() * 90 - 30,
    color: Math.random() > 0.5 ? '#22D3EE' : '#F43F5E',
    size: Math.random() * 5 + 3,
    life: 0,
    maxLife: 0.55,
    type: 'electric',
  };
}

export function createFloatingTextParticle(x: number, y: number, text: string, color: string): Particle {
  return {
    id: particleIdCounter++,
    x,
    y,
    vx: (Math.random() - 0.5) * 20,
    vy: -75,
    color,
    size: 16,
    life: 0,
    maxLife: 0.75,
    type: 'text',
    text,
  };
}

export function updateParticles(particles: Particle[], dt: number): Particle[] {
  const alive: Particle[] = [];
  for (const p of particles) {
    p.life += dt;
    if (p.life < p.maxLife) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.type === 'dust' || p.type === 'spark') {
        p.vy += 150 * dt;
      }
      alive.push(p);
    }
  }
  return alive;
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    const progress = p.life / p.maxLife;
    const alpha = Math.max(0, 1 - progress);

    ctx.save();
    ctx.globalAlpha = alpha;

    if (p.type === 'text' && p.text) {
      ctx.font = 'bold 16px "Fredoka", sans-serif';
      ctx.fillStyle = p.color;
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 3;
      ctx.strokeText(p.text, p.x, p.y);
      ctx.fillText(p.text, p.x, p.y);
    } else if (p.type === 'sparkle' || p.type === 'star') {
      ctx.translate(p.x, p.y);
      ctx.rotate(progress * Math.PI);
      ctx.fillStyle = p.color;
      const s = p.size * (1 - progress * 0.5);
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.3, -s * 0.3);
      ctx.lineTo(s, 0);
      ctx.lineTo(s * 0.3, s * 0.3);
      ctx.lineTo(0, s);
      ctx.lineTo(-s * 0.3, s * 0.3);
      ctx.lineTo(-s, 0);
      ctx.lineTo(-s * 0.3, -s * 0.3);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'electric' || p.type === 'spark') {
      // Kilatan listrik zig-zag atau partikel energi
      ctx.translate(p.x, p.y);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-p.size, 0);
      ctx.lineTo(-p.size * 0.3, -p.size * 0.8);
      ctx.lineTo(p.size * 0.3, p.size * 0.5);
      ctx.lineTo(p.size, -p.size * 0.3);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.4 * (1 - progress), 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Dust circle
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 - progress * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
