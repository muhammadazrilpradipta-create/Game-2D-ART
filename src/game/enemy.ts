/**
 * Enemy Entity: Robot Drone Musuh
 * Musuh Robot Drone Pengintai dengan Sensor Merah & Levitation Rotors
 */

import { Enemy } from '../types/game';

export function createEnemy(id: number, x: number, y: number, minX: number, maxX: number, speed: number = 75): Enemy {
  return {
    id,
    x,
    y,
    width: 48,
    height: 40,
    vx: speed,
    minX,
    maxX,
    facing: 'right',
    walkFrame: Math.random() * 10,
    isAlive: true,
    deathTimer: 0,
  };
}

export function updateEnemy(enemy: Enemy, dt: number) {
  if (!enemy.isAlive) {
    enemy.deathTimer += dt;
    return;
  }

  // Patrol movement
  enemy.x += enemy.vx * dt;
  enemy.walkFrame += dt * 8;

  if (enemy.x <= enemy.minX) {
    enemy.x = enemy.minX;
    enemy.vx = Math.abs(enemy.vx);
    enemy.facing = 'right';
  } else if (enemy.x + enemy.width >= enemy.maxX) {
    enemy.x = enemy.maxX - enemy.width;
    enemy.vx = -Math.abs(enemy.vx);
    enemy.facing = 'left';
  }
}

/**
 * Gambar Robot Drone Musuh dengan visual mekanis yang jelas & mencolok
 */
export function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy) {
  if (!enemy.isAlive && enemy.deathTimer > 0.45) {
    return; // Selesai efek ledakan
  }

  ctx.save();

  const centerX = enemy.x + enemy.width / 2;
  const centerY = enemy.y + enemy.height / 2;

  ctx.translate(centerX, centerY);

  // Jika lumpuh / stomped, efek squash & ledakan listrik
  if (!enemy.isAlive) {
    const scaleY = Math.max(0.08, 1 - enemy.deathTimer * 2.2);
    const alpha = Math.max(0, 1 - enemy.deathTimer * 2.3);
    ctx.scale(1.3, scaleY);
    ctx.globalAlpha = alpha;
  }

  // Flip horizontal sesuai arah hadap
  if (enemy.facing === 'left') {
    ctx.scale(-1, 1);
  }

  const w = enemy.width;
  const h = enemy.height;
  // Animasi melayang naik-turun halus (hovering)
  const hoverY = Math.sin(enemy.walkFrame * 2.5) * 3.5;
  const rotorSpin = Math.sin(enemy.walkFrame * 14);

  // 1. Antena Sensor Bahaya di Atas Drone
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, -h / 2 + 5 + hoverY);
  ctx.lineTo(0, -h / 2 - 6 + hoverY);
  ctx.stroke();

  // Lampu Strobe Merah Bahaya di Ujung Antena
  const strobeGlow = ctx.createRadialGradient(0, -h / 2 - 7 + hoverY, 1, 0, -h / 2 - 7 + hoverY, 6);
  strobeGlow.addColorStop(0, '#FFFFFF');
  strobeGlow.addColorStop(0.5, '#EF4444');
  strobeGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = strobeGlow;
  ctx.beginPath();
  ctx.arc(0, -h / 2 - 7 + hoverY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(0, -h / 2 - 7 + hoverY, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 2. Baling-Baling / Rotor Levitasi Samping (Kiri & Kanan)
  ctx.save();
  // Rotor Kiri
  ctx.fillStyle = '#334155';
  ctx.fillRect(-w / 2 - 4, -4 + hoverY, 6, 3);
  ctx.fillStyle = '#94A3B8';
  ctx.beginPath();
  ctx.ellipse(-w / 2 - 1, -4 + hoverY, 8 * Math.abs(rotorSpin) + 2, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rotor Kanan
  ctx.fillStyle = '#334155';
  ctx.fillRect(w / 2 - 2, -4 + hoverY, 6, 3);
  ctx.fillStyle = '#94A3B8';
  ctx.beginPath();
  ctx.ellipse(w / 2 + 1, -4 + hoverY, 8 * Math.abs(rotorSpin) + 2, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Badan Drone Mekanis (Merah Tua Metalik & Hitam Obsidian)
  ctx.fillStyle = '#991B1B'; // Dark red chassis
  ctx.beginPath();
  ctx.roundRect(-w / 2 + 6, -h / 2 + 8 + hoverY, w - 12, h - 16, 10);
  ctx.fill();
  ctx.strokeStyle = '#450A0A';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Pelindung Atas Logam Abu-abu (Metallic Armor Cap)
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.roundRect(-w / 2 + 10, -h / 2 + 6 + hoverY, w - 20, 7, 3);
  ctx.fill();

  // 4. Panel Sensor Kaca Hitam (Black Visor Glass)
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.roundRect(-w / 2 + 10, hoverY - 4, w - 20, 15, 5);
  ctx.fill();
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 5. Mata Sensor Laser Merah Bercahaya Tajam (Cyclops Red Sensor)
  const eyeX = 4; // Menghadap ke arah patroli
  const eyeY = hoverY + 3;

  // Glow Merah Mengancam
  const redGlow = ctx.createRadialGradient(eyeX, eyeY, 1, eyeX, eyeY, 8);
  redGlow.addColorStop(0, '#FFFFFF');
  redGlow.addColorStop(0.4, '#EF4444');
  redGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = redGlow;
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, 8, 0, Math.PI * 2);
  ctx.fill();

  // Inti Sensor Merah
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(eyeX + 1.2, eyeY - 1, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // 6. Garis Laser Scanner Horisontal
  ctx.strokeStyle = 'rgba(248, 113, 113, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(eyeX - 8, eyeY);
  ctx.lineTo(eyeX + 14, eyeY);
  ctx.stroke();

  // 7. Kaki / Cakar Magnetik Bahaya di Bawah Drone
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  // Cakar Kiri
  ctx.beginPath();
  ctx.moveTo(-10, h / 2 - 8 + hoverY);
  ctx.lineTo(-13, h / 2 + hoverY);
  ctx.lineTo(-8, h / 2 + 2 + hoverY);
  ctx.stroke();
  // Cakar Kanan
  ctx.beginPath();
  ctx.moveTo(10, h / 2 - 8 + hoverY);
  ctx.lineTo(13, h / 2 + hoverY);
  ctx.lineTo(8, h / 2 + 2 + hoverY);
  ctx.stroke();

  ctx.restore();
}
