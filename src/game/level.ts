/**
 * Level Design & World Generation
 * Platformer 2D: Rintangan Tanah, Koin, Musuh Kucing, & Sarang Telur Emas
 * Sesuai Jobsheet 1, 2, 3, 4, 5
 */

import { Platform, Coin, Enemy, HeartPickup, FinishGoal } from '../types/game';
import { createEnemy } from './enemy';

export interface LevelData {
  worldWidth: number;
  worldHeight: number;
  playerStartX: number;
  playerStartY: number;
  platforms: Platform[];
  coins: Coin[];
  enemies: Enemy[];
  hearts: HeartPickup[];
  finish: FinishGoal;
}

export function buildDefaultLevel(): LevelData {
  const worldWidth = 3800;
  const worldHeight = 650;
  const groundY = 540;

  const platforms: Platform[] = [
    // --- SECTION 1: Titik Awal Peternakan (Start Ground) ---
    { x: 0, y: groundY, width: 850, height: 120, type: 'ground', color: '#16A34A' },
    // Platform rendah perkenalan melompat (Jobsheet 1)
    { x: 280, y: 440, width: 140, height: 24, type: 'floating', color: '#B45309' },
    { x: 480, y: 350, width: 150, height: 24, type: 'floating', color: '#B45309' },
    { x: 700, y: 420, width: 130, height: 24, type: 'floating', color: '#B45309' },

    // --- JURANG 1 (Pitfall between 850 and 970) ---

    // --- SECTION 2: Dataran Pertama & Kucing Patroli 1 ---
    { x: 970, y: groundY, width: 700, height: 120, type: 'ground', color: '#16A34A' },
    // Platform tangga kayu di Section 2
    { x: 1120, y: 430, width: 140, height: 24, type: 'floating', color: '#B45309' },
    { x: 1320, y: 330, width: 160, height: 24, type: 'floating', color: '#B45309' },
    { x: 1520, y: 410, width: 130, height: 24, type: 'floating', color: '#B45309' },

    // --- JURANG 2 (Pitfall between 1670 and 1790) ---

    // --- SECTION 3: Platform Melayang Berpindah (Moving Platform) ---
    {
      x: 1790,
      y: 430,
      width: 140,
      height: 24,
      type: 'moving',
      color: '#EA580C',
      minX: 1750,
      maxX: 2020,
      speed: 65,
      direction: 1,
    },

    // --- SECTION 4: Bukit Tengah & Kucing Patroli 2 & 3 ---
    { x: 2080, y: groundY, width: 750, height: 120, type: 'ground', color: '#16A34A' },
    // Platform tinggi bukit tengah
    { x: 2180, y: 420, width: 130, height: 24, type: 'floating', color: '#B45309' },
    { x: 2360, y: 310, width: 180, height: 24, type: 'floating', color: '#B45309' },
    { x: 2600, y: 410, width: 140, height: 24, type: 'floating', color: '#B45309' },

    // --- JURANG 3 (Pitfall between 2830 and 2940) ---

    // --- SECTION 5: Platform Melayang Menuju Puncak ---
    {
      x: 2940,
      y: 410,
      width: 130,
      height: 24,
      type: 'moving',
      color: '#EA580C',
      minX: 2920,
      maxX: 3150,
      speed: 80,
      direction: 1,
    },

    // --- SECTION 6: Puncak Bukit Sarang Telur Emas (Final Area) ---
    { x: 3180, y: groundY, width: 620, height: 120, type: 'ground', color: '#16A34A' },
    { x: 3340, y: 440, width: 140, height: 24, type: 'floating', color: '#B45309' },
    { x: 3520, y: 350, width: 180, height: 24, type: 'floating', color: '#B45309' },
  ];

  // Koin disusun rapi dan menarik
  const rawCoinPositions: Array<[number, number]> = [
    // Area 1
    [220, 500],
    [320, 395],
    [380, 395],
    [520, 305],
    [580, 305],
    [740, 375],
    [800, 500],

    // Area 2 (Dekat musuh 1)
    [1020, 500],
    [1160, 385],
    [1220, 385],
    [1370, 285],
    [1430, 285],
    [1560, 365],
    [1630, 500],

    // Area 3 (Moving platform)
    [1880, 380],

    // Area 4 (Dekat musuh 2 & 3)
    [2120, 500],
    [2220, 375],
    [2410, 265],
    [2490, 265],
    [2640, 365],
    [2760, 500],

    // Area 5 (Moving platform 2)
    [3030, 360],

    // Area 6 (Finish peak)
    [3250, 500],
    [3380, 395],
    [3560, 305],
    [3620, 305],
  ];

  const coins: Coin[] = rawCoinPositions.map(([x, y], idx) => ({
    id: idx + 1,
    x,
    y,
    radius: 13,
    collected: false,
    floatOffset: Math.random() * Math.PI * 2,
    animTimer: Math.random() * 5,
  }));

  // Heart Pickups (+25 HP recovery)
  const hearts: HeartPickup[] = [
    { id: 1, x: 550, y: 260, radius: 12, collected: false, animTimer: 0 },
    { id: 2, x: 2450, y: 220, radius: 12, collected: false, animTimer: 0 },
  ];

  // Enemies (Kucing patroli)
  const enemies: Enemy[] = [
    // Musuh 1 di dataran Section 2
    createEnemy(1, 1080, groundY - 38, 990, 1640, 75),
    // Musuh 2 di platform Section 2
    createEnemy(2, 1340, 330 - 38, 1320, 1470, 55),
    // Musuh 3 di dataran Section 4
    createEnemy(3, 2200, groundY - 38, 2090, 2800, 85),
    // Musuh 4 di platform Section 4
    createEnemy(4, 2380, 310 - 38, 2360, 2530, 60),
    // Musuh 5 di dataran Section 6 menjaga jalan ke sarang
    createEnemy(5, 3260, groundY - 38, 3200, 3500, 90),
  ];

  // Sarang Telur Emas (Finish Goal) di puncak akhir
  const finish: FinishGoal = {
    x: 3580,
    y: 350 - 45,
    width: 60,
    height: 45,
    reached: false,
  };

  return {
    worldWidth,
    worldHeight,
    playerStartX: 80,
    playerStartY: groundY - 50,
    platforms,
    coins,
    enemies,
    hearts,
    finish,
  };
}

/**
 * Render visual alam, latar belakang, platform, koin, dan sarang telur emas
 */
export function drawEnvironment(
  ctx: CanvasRenderingContext2D,
  level: LevelData,
  cameraX: number,
  viewWidth: number,
  viewHeight: number
) {
  // 1. Langit Bergradasi Cantik (Sky)
  const skyGradient = ctx.createLinearGradient(0, 0, 0, viewHeight);
  skyGradient.addColorStop(0, '#38BDF8'); // Sky blue
  skyGradient.addColorStop(0.55, '#BAE6FD');
  skyGradient.addColorStop(1, '#FEF08A'); // Warm morning horizon
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, viewWidth, viewHeight);

  // 2. Matahari Terbit (Sun with soft radial glow)
  const sunScreenX = 480 - cameraX * 0.05;
  const sunScreenY = 120;
  const sunGlow = ctx.createRadialGradient(sunScreenX, sunScreenY, 15, sunScreenX, sunScreenY, 80);
  sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
  sunGlow.addColorStop(0.5, 'rgba(253, 224, 71, 0.4)');
  sunGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunScreenX, sunScreenY, 80, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FDE047';
  ctx.beginPath();
  ctx.arc(sunScreenX, sunScreenY, 26, 0, Math.PI * 2);
  ctx.fill();

  // 3. Awan Lembut Paralaks (Distant Clouds)
  const clouds = [
    { x: 120, y: 70, s: 1.1 },
    { x: 580, y: 95, s: 0.8 },
    { x: 1050, y: 60, s: 1.2 },
    { x: 1600, y: 85, s: 0.9 },
    { x: 2200, y: 65, s: 1.0 },
    { x: 2800, y: 90, s: 1.15 },
    { x: 3400, y: 75, s: 0.85 },
  ];

  ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
  for (const c of clouds) {
    const cx = c.x - cameraX * 0.12;
    if (cx + 120 < 0 || cx - 120 > viewWidth) continue;
    drawCloud(ctx, cx, c.y, c.s);
  }

  // 4. Pegunungan Jauh (Far Mountains - Parallax layer 0.2)
  ctx.fillStyle = '#99F6E4';
  ctx.beginPath();
  ctx.moveTo(0, viewHeight);
  for (let x = -100; x <= level.worldWidth + 200; x += 180) {
    const screenX = x - cameraX * 0.22;
    const h = 260 + Math.sin(x * 0.015) * 80;
    ctx.lineTo(screenX, viewHeight - h);
  }
  ctx.lineTo(viewWidth + 100, viewHeight);
  ctx.closePath();
  ctx.fill();

  // 5. Bukit Dekat (Mid Forest Hills - Parallax layer 0.4)
  ctx.fillStyle = '#4ADE80';
  ctx.beginPath();
  ctx.moveTo(0, viewHeight);
  for (let x = -100; x <= level.worldWidth + 200; x += 140) {
    const screenX = x - cameraX * 0.4;
    const h = 180 + Math.sin(x * 0.02 + 1) * 55;
    ctx.lineTo(screenX, viewHeight - h);
  }
  ctx.lineTo(viewWidth + 100, viewHeight);
  ctx.closePath();
  ctx.fill();

  // Pepohonan latar tengah (Distant pine trees)
  ctx.fillStyle = '#16A34A';
  for (let x = 60; x <= level.worldWidth; x += 220) {
    const screenX = x - cameraX * 0.4;
    if (screenX < -50 || screenX > viewWidth + 50) continue;
    const treeBaseY = viewHeight - (180 + Math.sin(x * 0.02 + 1) * 55) + 30;
    drawTree(ctx, screenX, treeBaseY, 35);
  }
}

/**
 * Gambar awan kartun
 */
function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.arc(22, -8, 26, 0, Math.PI * 2);
  ctx.arc(52, -2, 22, 0, Math.PI * 2);
  ctx.arc(70, 6, 18, 0, Math.PI * 2);
  ctx.arc(36, 12, 24, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Gambar pohon kartun
 */
function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, height: number) {
  ctx.save();
  // Batang cokelat
  ctx.fillStyle = '#78350F';
  ctx.fillRect(x - 4, y - height * 0.4, 8, height * 0.4);
  // Daun segitiga bertingkat
  ctx.fillStyle = '#15803D';
  ctx.beginPath();
  ctx.moveTo(x, y - height);
  ctx.lineTo(x + height * 0.45, y - height * 0.35);
  ctx.lineTo(x - height * 0.45, y - height * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Gambar platforms & tanah (Sesuai tilemap tanah Jobsheet 2)
 */
export function drawPlatforms(ctx: CanvasRenderingContext2D, platforms: Platform[]) {
  for (const plat of platforms) {
    if (plat.type === 'ground') {
      // 1. Lapisan tanah cokelat bawah
      ctx.fillStyle = '#78350F'; // Rich soil brown
      ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

      // Tekstur pola batu tanah (Jobsheet 2 Tilemap look)
      ctx.fillStyle = '#5C2B0B';
      for (let bx = plat.x + 15; bx < plat.x + plat.width - 20; bx += 40) {
        ctx.beginPath();
        ctx.roundRect(bx, plat.y + 24, 22, 14, 4);
        ctx.fill();
      }

      // 2. Lapisan rumput hijau subur di atas tanah
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(plat.x, plat.y, plat.width, 18);

      // Aksen rumput bergerigi
      ctx.fillStyle = '#16A34A';
      for (let rx = plat.x; rx < plat.x + plat.width; rx += 14) {
        ctx.beginPath();
        ctx.moveTo(rx, plat.y + 18);
        ctx.lineTo(rx + 7, plat.y + 26);
        ctx.lineTo(rx + 14, plat.y + 18);
        ctx.closePath();
        ctx.fill();
      }
    } else if (plat.type === 'floating' || plat.type === 'moving') {
      // Platform Kayu Mengambang / Bergerak
      ctx.save();
      // Bayangan bawah platform
      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
      ctx.beginPath();
      ctx.roundRect(plat.x + 2, plat.y + 4, plat.width, plat.height, 6);
      ctx.fill();

      // Papan kayu
      const isMoving = plat.type === 'moving';
      ctx.fillStyle = isMoving ? '#EA580C' : '#B45309';
      ctx.beginPath();
      ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 6);
      ctx.fill();

      // Highlight atas kayu
      ctx.fillStyle = isMoving ? '#FB923C' : '#D97706';
      ctx.beginPath();
      ctx.roundRect(plat.x + 2, plat.y + 2, plat.width - 4, 6, 3);
      ctx.fill();

      // Garis serat kayu
      ctx.strokeStyle = isMoving ? '#9A3412' : '#78350F';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(plat.x + 25, plat.y + 12);
      ctx.lineTo(plat.x + plat.width - 25, plat.y + 12);
      ctx.stroke();

      // Indikator panah pada moving platform
      if (isMoving) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        const midX = plat.x + plat.width / 2;
        const midY = plat.y + plat.height / 2;
        // Panah kiri & kanan
        ctx.moveTo(midX - 12, midY);
        ctx.lineTo(midX - 6, midY - 4);
        ctx.lineTo(midX - 6, midY + 4);
        ctx.closePath();
        ctx.moveTo(midX + 12, midY);
        ctx.lineTo(midX + 6, midY - 4);
        ctx.lineTo(midX + 6, midY + 4);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }
}

/**
 * Gambar Koin Emas dengan kilau animasi berputar (Jobsheet 3)
 */
export function drawCoin(ctx: CanvasRenderingContext2D, coin: Coin) {
  if (coin.collected) return;

  ctx.save();
  const floatY = Math.sin(coin.animTimer * 4 + coin.floatOffset) * 4;
  const drawY = coin.y + floatY;

  // Efek lebar berputar (horizontal rotation effect)
  const spinFactor = Math.abs(Math.cos(coin.animTimer * 4));
  const w = Math.max(3, coin.radius * spinFactor);
  const h = coin.radius;

  // Glow halus di sekeliling koin
  ctx.fillStyle = 'rgba(253, 224, 71, 0.28)';
  ctx.beginPath();
  ctx.ellipse(coin.x, drawY, w + 5, h + 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Koin tepi luar emas
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.ellipse(coin.x, drawY, w, h, 0, 0, Math.PI * 2);
  ctx.fill();

  // Koin isi dalam emas berkilau
  ctx.fillStyle = '#FCD34D';
  ctx.beginPath();
  ctx.ellipse(coin.x, drawY, Math.max(1, w - 2.5), h - 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Aksen garis tengah koin jika sedang menghadap depan
  if (spinFactor > 0.4) {
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(coin.x, drawY, w * 0.45, h * 0.45, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Gambar Heart / Energy Battery Pickup (Pemulih HP Robot)
 */
export function drawHeartPickup(ctx: CanvasRenderingContext2D, heart: HeartPickup) {
  if (heart.collected) return;

  ctx.save();
  const floatY = Math.sin(heart.animTimer * 4) * 3;
  const drawY = heart.y + floatY;

  ctx.translate(heart.x, drawY);

  // Glow cyan / pink energi
  ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.beginPath();
  ctx.arc(0, 0, heart.radius + 6, 0, Math.PI * 2);
  ctx.fill();

  // Kapsul Baterai / Sel Energi Robot
  ctx.fillStyle = '#0284C7';
  ctx.beginPath();
  ctx.roundRect(-8, -11, 16, 22, 4);
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Kutub baterai atas
  ctx.fillStyle = '#94A3B8';
  ctx.fillRect(-3, -14, 6, 3);

  // Indikator Energi Hijau/Cyan di dalam baterai
  ctx.fillStyle = '#22D3EE';
  ctx.beginPath();
  ctx.roundRect(-6, -7, 12, 14, 2);
  ctx.fill();

  // Simbol Petir / Energi Putih
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(1, -5);
  ctx.lineTo(-3, 0);
  ctx.lineTo(0, 0);
  ctx.lineTo(-1, 5);
  ctx.lineTo(3, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Gambar Podium Inti Energi Emas & Bendera Kemenangan (Finish Goal)
 */
export function drawFinishGoal(ctx: CanvasRenderingContext2D, finish: FinishGoal, time: number) {
  ctx.save();
  const centerX = finish.x + finish.width / 2;
  const centerY = finish.y + finish.height;

  // 1. Tiang Bendera Kemenangan Logam
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(centerX - 24, centerY);
  ctx.lineTo(centerX - 24, centerY - 68);
  ctx.stroke();

  // Lampu tiang atas
  ctx.fillStyle = '#22D3EE';
  ctx.beginPath();
  ctx.arc(centerX - 24, centerY - 70, 4, 0, Math.PI * 2);
  ctx.fill();

  // Bendera Hologram Biru Berkibar
  const wave = Math.sin(time * 5) * 4;
  ctx.fillStyle = '#0284C7';
  ctx.beginPath();
  ctx.moveTo(centerX - 24, centerY - 67);
  ctx.lineTo(centerX + 8 + wave, centerY - 53);
  ctx.lineTo(centerX - 24, centerY - 39);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 2. Podium Mekanis Inti Energi (Futuristic Pedestal)
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.roundRect(centerX - finish.width / 2, centerY - 14, finish.width, 14, 4);
  ctx.fill();
  ctx.strokeStyle = '#0284C7';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Strip Neon Cyan pada Podium
  ctx.fillStyle = '#22D3EE';
  ctx.fillRect(centerX - finish.width / 2 + 6, centerY - 8, finish.width - 12, 3);

  // 3. Inti Energi Emas Melayang (Golden Power Core)
  const eggY = centerY - 28 + Math.sin(time * 3) * 4;

  // Aura Cahaya Emas
  const aura = ctx.createRadialGradient(centerX, eggY, 4, centerX, eggY, 30);
  aura.addColorStop(0, 'rgba(253, 224, 71, 0.85)');
  aura.addColorStop(0.5, 'rgba(56, 189, 248, 0.4)');
  aura.addColorStop(1, 'rgba(253, 224, 71, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(centerX, eggY, 30, 0, Math.PI * 2);
  ctx.fill();

  // Inti Logam Emas
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.ellipse(centerX, eggY, 13, 17, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cincin Orbital Energi Cyan di sekeliling Inti
  ctx.strokeStyle = '#22D3EE';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(centerX, eggY, 19, 7, time * 2, 0, Math.PI * 2);
  ctx.stroke();

  // Highlight Kilau Putih
  ctx.fillStyle = '#FEF08A';
  ctx.beginPath();
  ctx.ellipse(centerX - 3, eggY - 4, 5, 8, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
