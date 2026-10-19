/**
 * Chicken Adventure - Type Definitions
 * Sesuai kurikulum Jobsheet 1-5 SMK Pengembangan Game 2D
 */

export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY' | 'OPTIONS' | 'LAB';

export type Direction = 'left' | 'right';

export interface Vector2D {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type PlayerAnimState = 'idle' | 'run' | 'jump' | 'fall' | 'hurt' | 'win';

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  facing: Direction;
  animState: PlayerAnimState;
  walkFrame: number;
  health: number; // Max 100
  maxHealth: number;
  invulnerableTimer: number; // detik kebal setelah terkena musuh (jeda damage)
  coyoteTimer: number; // toleransi lompat saat baru lepas dari platform
  jumpBufferTimer: number; // toleransi tombol lompat ditekan sesaat sebelum mendarat
}

export type PlatformType = 'ground' | 'floating' | 'moving' | 'spikes';

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: PlatformType;
  color?: string;
  // Untuk moving platform
  minX?: number;
  maxX?: number;
  speed?: number;
  direction?: number;
}

export interface Coin {
  id: number;
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  floatOffset: number;
  animTimer: number;
}

export interface HeartPickup {
  id: number;
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  animTimer: number;
}

export interface Enemy {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  minX: number;
  maxX: number;
  facing: Direction;
  walkFrame: number;
  isAlive: boolean;
  deathTimer: number;
}

export interface FinishGoal {
  x: number;
  y: number;
  width: number;
  height: number;
  reached: boolean;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  type: 'dust' | 'sparkle' | 'star' | 'text' | 'spark' | 'electric';
  text?: string;
}

export interface GameSettings {
  bgmVolume: number; // 0 - 1
  sfxVolume: number; // 0 - 1
  isMuted: boolean;
  touchControlsVisible: boolean;
  // Parameter fisika sesuai Jobsheet 1 (halaman 4, 7, 8, 9)
  moveSpeed: number; // Ms
  jumpForce: number; // Jf
  gravityScale: number; // Gravitasi
}

export interface GameStats {
  score: number;
  coinsCollected: number;
  totalCoins: number;
  highScore: number;
  levelTimer: number;
  dronesDefeated: number;
}
