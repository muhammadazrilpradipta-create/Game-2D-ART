/**
 * Player Entity & Vector/Canvas Rendering
 * Karakter Robot Mini "ROBOT MINI GAMES"
 * Robot kecil biru futuristik, kepala besar, mata digital bercahaya, tubuh mekanis
 */

import { Player } from '../types/game';

export function createPlayer(x: number, y: number): Player {
  return {
    x,
    y,
    width: 44,
    height: 48,
    vx: 0,
    vy: 0,
    isGrounded: false,
    facing: 'right',
    animState: 'idle',
    walkFrame: 0,
    health: 100,
    maxHealth: 100,
    invulnerableTimer: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
  };
}

/**
 * Gambar karakter Robot Mini dengan detail mekanis dan futuristik
 */
export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player) {
  // Efek kedip dan glitch saat masa kebal (invulnerability / damaged)
  if (player.invulnerableTimer > 0) {
    const flash = Math.floor(player.invulnerableTimer * 22) % 2 === 0;
    if (flash) {
      ctx.globalAlpha = 0.45;
    }
  }

  ctx.save();

  // Posisi tengah untuk rotasi & flip arah
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;

  ctx.translate(centerX, centerY);

  // Flip horizontal jika menghadap kiri
  if (player.facing === 'left') {
    ctx.scale(-1, 1);
  }

  // Animasi dan pose mekanis
  let bobY = 0;
  let armAngle = 0;
  let legLeftOffset = 0;
  let legRightOffset = 0;
  let isThrusterActive = false;

  if (player.animState === 'idle') {
    bobY = Math.sin(player.walkFrame * 2.5) * 1.8;
    armAngle = Math.sin(player.walkFrame * 2.5) * 0.08;
  } else if (player.animState === 'run') {
    bobY = Math.abs(Math.sin(player.walkFrame * 4)) * 3.0;
    armAngle = Math.sin(player.walkFrame * 6) * 0.45;
    legLeftOffset = Math.sin(player.walkFrame * 6) * 7;
    legRightOffset = -Math.sin(player.walkFrame * 6) * 7;
  } else if (player.animState === 'jump') {
    bobY = -3;
    armAngle = -0.7; // Tangan terangkat ke atas saat melompat
    legLeftOffset = 2;
    legRightOffset = 2;
    isThrusterActive = true;
  } else if (player.animState === 'fall') {
    bobY = 1;
    armAngle = 0.35;
    isThrusterActive = true;
  } else if (player.animState === 'hurt') {
    bobY = (Math.random() - 0.5) * 3;
    armAngle = 0.8;
  } else if (player.animState === 'win') {
    bobY = Math.abs(Math.sin(player.walkFrame * 7)) * 7;
    armAngle = -1.2; // Kedua tangan dipompa ke atas merayakan kemenangan!
  }

  const pW = player.width;
  const pH = player.height;

  // 1. Api / Semburan Thruster Jet saat Melayang/Melompat
  if (isThrusterActive) {
    ctx.save();
    const flameH = 8 + Math.random() * 7;
    // Api cyan terang
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.moveTo(-9, pH / 2 - 2);
    ctx.lineTo(-6, pH / 2 + flameH);
    ctx.lineTo(-3, pH / 2 - 2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(3, pH / 2 - 2);
    ctx.lineTo(6, pH / 2 + flameH);
    ctx.lineTo(9, pH / 2 - 2);
    ctx.closePath();
    ctx.fill();

    // Inti putih panas thruster
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(-8, pH / 2 - 2);
    ctx.lineTo(-6, pH / 2 + flameH * 0.5);
    ctx.lineTo(-4, pH / 2 - 2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(4, pH / 2 - 2);
    ctx.lineTo(6, pH / 2 + flameH * 0.5);
    ctx.lineTo(8, pH / 2 - 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 2. Kaki Robot Mekanis (Sleek Blue & Silver Boots)
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#0284C7'; // Deep robotic blue

  // Kaki Kiri
  ctx.beginPath();
  ctx.moveTo(-6, pH / 2 - 14);
  ctx.lineTo(-6 + legLeftOffset * 0.7, pH / 2 - 5);
  ctx.lineTo(-6 + legLeftOffset, pH / 2);
  ctx.stroke();

  // Sepatu Kiri
  ctx.fillStyle = '#0369A1';
  ctx.beginPath();
  ctx.roundRect(-10 + legLeftOffset, pH / 2 - 4, 9, 6, 2);
  ctx.fill();

  // Kaki Kanan
  ctx.beginPath();
  ctx.moveTo(6, pH / 2 - 14);
  ctx.lineTo(6 + legRightOffset * 0.7, pH / 2 - 5);
  ctx.lineTo(6 + legRightOffset, pH / 2);
  ctx.stroke();

  // Sepatu Kanan
  ctx.fillStyle = '#0284C7';
  ctx.beginPath();
  ctx.roundRect(2 + legRightOffset, pH / 2 - 4, 9, 6, 2);
  ctx.fill();

  // 3. Badan Robot (Chassis Biru Mekanis dengan Arc Reactor)
  const bodyY = 2 + bobY;
  ctx.fillStyle = player.animState === 'hurt' ? '#F43F5E' : '#0284C7'; // Blue chassis
  ctx.beginPath();
  ctx.roundRect(-12, bodyY - 10, 24, 20, 6);
  ctx.fill();
  ctx.strokeStyle = '#0369A1';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Pelat dada logam cyan (Chest Armor Plate)
  ctx.fillStyle = '#0EA5E9';
  ctx.beginPath();
  ctx.roundRect(-9, bodyY - 8, 18, 14, 4);
  ctx.fill();

  // Reaktor Energi Inti di Dada (Glowing Arc Reactor Core)
  const coreGlow = ctx.createRadialGradient(0, bodyY - 1, 1, 0, bodyY - 1, 7);
  coreGlow.addColorStop(0, '#FFFFFF');
  coreGlow.addColorStop(0.5, '#38BDF8');
  coreGlow.addColorStop(1, 'rgba(14, 165, 233, 0)');
  ctx.fillStyle = coreGlow;
  ctx.beginPath();
  ctx.arc(0, bodyY - 1, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#22D3EE';
  ctx.beginPath();
  ctx.arc(0, bodyY - 1, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // 4. Lengan Robot Belakang (Left Arm)
  ctx.save();
  ctx.translate(-11, bodyY - 4);
  ctx.rotate(-armAngle);
  ctx.fillStyle = '#0369A1';
  ctx.beginPath();
  ctx.roundRect(-3, 0, 6, 12, 3);
  ctx.fill();
  // Sendi bulat pergelangan
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.arc(0, 12, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 5. Kepala Robot Besar yang Ikonik & Menggemaskan
  const headY = -12 + bobY;

  // Antena Robot di Puncak Kepala
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, headY - 15);
  ctx.lineTo(0, headY - 23);
  ctx.stroke();

  // Lampu Antena Berkedip (Pulsing Cyan/Blue Beacon)
  const beaconGlow = ctx.createRadialGradient(0, headY - 24, 1, 0, headY - 24, 6);
  beaconGlow.addColorStop(0, '#FFFFFF');
  beaconGlow.addColorStop(0.6, '#38BDF8');
  beaconGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = beaconGlow;
  ctx.beginPath();
  ctx.arc(0, headY - 24, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#22D3EE';
  ctx.beginPath();
  ctx.arc(0, headY - 24, 3, 0, Math.PI * 2);
  ctx.fill();

  // Telinga / Sensor Pod Robot (Kiri & Kanan)
  ctx.fillStyle = '#0369A1';
  ctx.beginPath();
  ctx.roundRect(-19, headY - 7, 4, 10, 2);
  ctx.roundRect(15, headY - 7, 4, 10, 2);
  ctx.fill();

  // Helm Kepala Robot Biru
  ctx.fillStyle = player.animState === 'hurt' ? '#FB7185' : '#0284C7';
  ctx.beginPath();
  ctx.roundRect(-16, headY - 15, 32, 26, 9);
  ctx.fill();
  ctx.strokeStyle = '#0369A1';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Garis Highlight Mengkilap pada Helm
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.roundRect(-13, headY - 13, 26, 4, 2);
  ctx.fill();

  // 6. Visor Kaca Hitam Melengkung (Digital Display Face)
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.roundRect(-12, headY - 8, 24, 16, 5);
  ctx.fill();
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 7. Mata Digital LED Cyan Bercahaya
  if (player.animState === 'win') {
    // Mata lengkung gembira ^_^
    ctx.strokeStyle = '#22D3EE';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    // Mata kiri
    ctx.beginPath();
    ctx.arc(-5, headY - 1, 3.5, Math.PI, 0);
    ctx.stroke();
    // Mata kanan
    ctx.beginPath();
    ctx.arc(5, headY - 1, 3.5, Math.PI, 0);
    ctx.stroke();
  } else if (player.animState === 'hurt') {
    // Mata glitch tanda bahaya
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    // X mata kiri
    ctx.beginPath();
    ctx.moveTo(-8, headY - 3);
    ctx.lineTo(-3, headY + 2);
    ctx.moveTo(-3, headY - 3);
    ctx.lineTo(-8, headY + 2);
    ctx.stroke();
    // X mata kanan
    ctx.beginPath();
    ctx.moveTo(3, headY - 3);
    ctx.lineTo(8, headY + 2);
    ctx.moveTo(8, headY - 3);
    ctx.lineTo(3, headY + 2);
    ctx.stroke();
  } else {
    // Mata digital cyan bulat bercahaya normal
    const eyeOffsetX = 1.8; // Sedikit condong ke arah hadap
    const eyeGlow = ctx.createRadialGradient(-5 + eyeOffsetX, headY, 1, -5 + eyeOffsetX, headY, 6);
    eyeGlow.addColorStop(0, '#FFFFFF');
    eyeGlow.addColorStop(0.5, '#22D3EE');
    eyeGlow.addColorStop(1, 'rgba(34, 211, 238, 0)');

    // Mata Kiri
    ctx.fillStyle = eyeGlow;
    ctx.beginPath();
    ctx.arc(-5 + eyeOffsetX, headY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22D3EE';
    ctx.beginPath();
    ctx.arc(-5 + eyeOffsetX, headY, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-4 + eyeOffsetX, headY - 1, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Mata Kanan
    const eyeRGlow = ctx.createRadialGradient(5 + eyeOffsetX, headY, 1, 5 + eyeOffsetX, headY, 6);
    eyeRGlow.addColorStop(0, '#FFFFFF');
    eyeRGlow.addColorStop(0.5, '#22D3EE');
    eyeRGlow.addColorStop(1, 'rgba(34, 211, 238, 0)');
    ctx.fillStyle = eyeRGlow;
    ctx.beginPath();
    ctx.arc(5 + eyeOffsetX, headY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22D3EE';
    ctx.beginPath();
    ctx.arc(5 + eyeOffsetX, headY, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(6 + eyeOffsetX, headY - 1, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 8. Lengan Robot Depan (Right Arm)
  ctx.save();
  ctx.translate(11, bodyY - 4);
  ctx.rotate(armAngle);
  ctx.fillStyle = '#0284C7';
  ctx.beginPath();
  ctx.roundRect(-3, 0, 6, 12, 3);
  ctx.fill();
  // Sendi bulat & capit gripper
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.arc(0, 12, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0369A1';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
  ctx.globalAlpha = 1.0;
}
