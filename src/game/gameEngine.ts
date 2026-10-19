/**
 * Game Engine & Game Loop
 * Platformer 2D: Chicken Adventure
 * Menyinkronkan seluruh sistem fisika, collision, musuh, koin, audio, partikel, & kamera
 */

import { GameSettings, GameStats, Player, Platform } from '../types/game';
import { soundManager } from '../audio/soundManager';
import { updatePlayerPhysics, checkAABB } from './physics';
import { createPlayer, drawPlayer } from './player';
import { updateEnemy, drawEnemy } from './enemy';
import {
  buildDefaultLevel,
  LevelData,
  drawEnvironment,
  drawPlatforms,
  drawCoin,
  drawHeartPickup,
  drawFinishGoal,
} from './level';
import {
  createDustParticle,
  createSparkleParticle,
  createSparkParticle,
  createElectricParticle,
  createFloatingTextParticle,
  updateParticles,
  drawParticles,
} from './particle';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;

  // Game data
  public level: LevelData;
  public player: Player;
  public cameraX: number = 0;
  public particles: ReturnType<typeof updateParticles> = [];
  public stats: GameStats;
  public settings: GameSettings;

  // State callbacks
  private onGameOver: (finalStats: GameStats) => void;
  private onVictory: (finalStats: GameStats) => void;
  private onStatsUpdate: (stats: GameStats, playerHealth: number) => void;
  private onPauseToggle: () => void;

  // Inputs
  private keys: Record<string, boolean> = {};
  private jumpPressedThisFrame: boolean = false;
  private touchInputX: number = 0;
  private touchJumpHolding: boolean = false;
  private touchJumpPressed: boolean = false;

  private isPaused: boolean = false;
  private isEnded: boolean = false;

  constructor(
    canvas: HTMLCanvasElement,
    settings: GameSettings,
    highScore: number,
    callbacks: {
      onGameOver: (finalStats: GameStats) => void;
      onVictory: (finalStats: GameStats) => void;
      onStatsUpdate: (stats: GameStats, playerHealth: number) => void;
      onPauseToggle: () => void;
    }
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.settings = { ...settings };
    this.onGameOver = callbacks.onGameOver;
    this.onVictory = callbacks.onVictory;
    this.onStatsUpdate = callbacks.onStatsUpdate;
    this.onPauseToggle = callbacks.onPauseToggle;

    this.level = buildDefaultLevel();
    this.player = createPlayer(this.level.playerStartX, this.level.playerStartY);

    this.stats = {
      score: 0,
      coinsCollected: 0,
      totalCoins: this.level.coins.length,
      highScore: highScore,
      levelTimer: 0,
      dronesDefeated: 0,
    };

    this.setupListeners();
    this.resizeCanvas();
  }

  public updateSettings(newSettings: GameSettings) {
    this.settings = { ...newSettings };
    soundManager.setVolumes(newSettings.bgmVolume, newSettings.sfxVolume, newSettings.isMuted);
  }

  private setupListeners() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('resize', this.resizeCanvas);
  }

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.resizeCanvas);
    soundManager.stopBGM();
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }

    if (e.code === 'Escape') {
      this.onPauseToggle();
      return;
    }

    if (!this.keys[e.code]) {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        this.jumpPressedThisFrame = true;
      }
    }
    this.keys[e.code] = true;
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  public setTouchInput(inputX: number, jumpHolding: boolean, jumpPressed: boolean) {
    this.touchInputX = inputX;
    this.touchJumpHolding = jumpHolding;
    if (jumpPressed) {
      this.touchJumpPressed = true;
    }
  }

  public resizeCanvas = () => {
    const parent = this.canvas.parentElement;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  };

  public start() {
    this.isPaused = false;
    this.isEnded = false;
    this.lastTime = performance.now();
    soundManager.startBGM();
    this.loop(this.lastTime);
  }

  public pause() {
    this.isPaused = true;
    soundManager.stopBGM();
  }

  public resume() {
    this.isPaused = false;
    this.lastTime = performance.now();
    soundManager.startBGM();
    this.loop(this.lastTime);
  }

  public restart() {
    this.level = buildDefaultLevel();
    this.player = createPlayer(this.level.playerStartX, this.level.playerStartY);
    this.cameraX = 0;
    this.particles = [];
    this.stats.score = 0;
    this.stats.coinsCollected = 0;
    this.stats.levelTimer = 0;
    this.stats.dronesDefeated = 0;
    this.isPaused = false;
    this.isEnded = false;
    this.lastTime = performance.now();
    soundManager.startBGM();
    this.loop(this.lastTime);
  }

  private loop = (currentTime: number) => {
    if (this.isPaused || this.isEnded) return;

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05);
    this.lastTime = currentTime;

    this.update(dt);
    this.render();

    this.jumpPressedThisFrame = false;
    this.touchJumpPressed = false;

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    this.stats.levelTimer += dt;

    // 1. Gather Input
    let inputX = 0;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) inputX -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) inputX += 1;
    if (this.touchInputX !== 0) inputX = this.touchInputX;

    const jumpPressed = this.jumpPressedThisFrame || this.touchJumpPressed;
    const jumpHolding =
      this.keys['Space'] ||
      this.keys['ArrowUp'] ||
      this.keys['KeyW'] ||
      this.touchJumpHolding;

    // 2. Update Moving Platforms
    for (const plat of this.level.platforms) {
      if (plat.type === 'moving' && plat.speed && plat.direction) {
        plat.x += plat.speed * plat.direction * dt;
        if (plat.minX !== undefined && plat.x <= plat.minX) {
          plat.x = plat.minX;
          plat.direction = 1;
        } else if (plat.maxX !== undefined && plat.x >= plat.maxX) {
          plat.x = plat.maxX;
          plat.direction = -1;
        }
      }
    }

    // 3. Update Player Physics (Ms, Jf, Gravity Scale dari Settings / Jobsheet 1)
    const { jumped, landed } = updatePlayerPhysics(
      this.player,
      this.level.platforms,
      inputX,
      jumpPressed,
      jumpHolding,
      this.settings.moveSpeed,
      this.settings.jumpForce,
      this.settings.gravityScale,
      dt
    );

    // Audio & Particles on Jump / Land
    if (jumped) {
      soundManager.playJump();
      for (let i = 0; i < 4; i++) {
        this.particles.push(createDustParticle(this.player.x + this.player.width / 2, this.player.y + this.player.height));
      }
    }

    if (landed) {
      for (let i = 0; i < 5; i++) {
        this.particles.push(createDustParticle(this.player.x + this.player.width / 2, this.player.y + this.player.height));
      }
    }

    // Invulnerability cooldown timer (Jobsheet 4)
    if (this.player.invulnerableTimer > 0) {
      this.player.invulnerableTimer -= dt;
    }

    // 4. Update Enemies
    for (const enemy of this.level.enemies) {
      updateEnemy(enemy, dt);

      if (!enemy.isAlive) continue;

      // Cek collision ayam vs kucing (Jobsheet 2 & 3: tag == "cat")
      const playerBox = {
        x: this.player.x,
        y: this.player.y,
        width: this.player.width,
        height: this.player.height,
      };

      const enemyBox = {
        x: enemy.x,
        y: enemy.y,
        width: enemy.width,
        height: enemy.height,
      };

      if (checkAABB(playerBox, enemyBox)) {
        // Apakah ayam menginjak kucing dari atas (Stomp Attack)?
        const playerBottom = this.player.y + this.player.height;
        const enemyTop = enemy.y + 14;

        if (this.player.vy > 0 && playerBottom <= enemyTop + 16) {
          // Drone defeated!
          enemy.isAlive = false;
          enemy.deathTimer = 0;
          this.player.vy = -this.settings.jumpForce * 0.72; // Bounce!
          this.stats.dronesDefeated++;
          this.stats.score += 25; // Bonus +25 stomp score!
          this.updateHighScore();

          soundManager.playStomp();
          this.particles.push(createFloatingTextParticle(enemy.x + enemy.width / 2, enemy.y, '+25 DRONE LUMPUH!', '#38BDF8'));
          for (let p = 0; p < 8; p++) {
            this.particles.push(createSparkParticle(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#38BDF8'));
          }
        } else {
          // Robot Mini terkena laser / benturan drone (TakeDamage)
          if (this.player.invulnerableTimer <= 0) {
            const damage = 20; // 20 HP per hit
            this.player.health = Math.max(0, this.player.health - damage);
            this.player.invulnerableTimer = 1.2; // 1.2s invulnerability period

            // Knockback recoil
            this.player.vx = this.player.x < enemy.x ? -220 : 220;
            this.player.vy = -240;

            soundManager.playHurt();
            this.particles.push(createFloatingTextParticle(this.player.x + this.player.width / 2, this.player.y, `-${damage} HP!`, '#EF4444'));
            for (let f = 0; f < 6; f++) {
              this.particles.push(createElectricParticle(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2));
            }

            // Cek HP habis
            if (this.player.health <= 0) {
              this.handleGameOver();
              return;
            }
          }
        }
      }
    }

    // 5. Update Coins (Jobsheet 3: tag == "koin" -> skor +10)
    for (const coin of this.level.coins) {
      if (coin.collected) continue;
      coin.animTimer += dt;

      // Circle to box distance check
      const coinCenterX = coin.x;
      const coinCenterY = coin.y + Math.sin(coin.animTimer * 4 + coin.floatOffset) * 4;
      const playerCenterX = this.player.x + this.player.width / 2;
      const playerCenterY = this.player.y + this.player.height / 2;

      const dist = Math.hypot(coinCenterX - playerCenterX, coinCenterY - playerCenterY);
      if (dist < coin.radius + this.player.width * 0.42) {
        coin.collected = true;
        this.stats.coinsCollected++;
        this.stats.score += 10; // +10 skor per koin persis seperti script Skor.cs Jobsheet 3!
        this.updateHighScore();

        soundManager.playCoin();
        this.particles.push(createFloatingTextParticle(coin.x, coin.y - 10, '+10', '#FDE047'));
        for (let s = 0; s < 6; s++) {
          this.particles.push(createSparkleParticle(coin.x, coin.y, '#FDE047'));
        }
      }
    }

    // 6. Update Heart Pickups (+25 HP Recovery)
    for (const heart of this.level.hearts) {
      if (heart.collected) continue;
      heart.animTimer += dt;

      const heartCenterX = heart.x;
      const heartCenterY = heart.y + Math.sin(heart.animTimer * 4) * 3;
      const playerCenterX = this.player.x + this.player.width / 2;
      const playerCenterY = this.player.y + this.player.height / 2;

      const dist = Math.hypot(heartCenterX - playerCenterX, heartCenterY - playerCenterY);
      if (dist < heart.radius + this.player.width * 0.45) {
        heart.collected = true;
        this.player.health = Math.min(this.player.maxHealth, this.player.health + 25);

        soundManager.playHeal();
        this.particles.push(createFloatingTextParticle(heart.x, heart.y - 10, '+25 HP!', '#F43F5E'));
        for (let s = 0; s < 6; s++) {
          this.particles.push(createSparkleParticle(heart.x, heart.y, '#FB7185'));
        }
      }
    }

    // 7. Check Abyss Fall (Jatuh ke lubang/jurang)
    if (this.player.y > this.level.worldHeight + 30) {
      this.player.health = 0;
      this.handleGameOver();
      return;
    }

    // 8. Check Victory Goal (Menyentuh Sarang Telur Emas)
    const playerBox = {
      x: this.player.x,
      y: this.player.y,
      width: this.player.width,
      height: this.player.height,
    };

    if (checkAABB(playerBox, this.level.finish)) {
      this.handleVictory();
      return;
    }

    // 9. Update Particles
    this.particles = updateParticles(this.particles, dt);

    // 10. Update Camera with smooth lerp tracking on horizontal axis
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const viewWidth = this.canvas.width / dpr;
    const targetCameraX = this.player.x + this.player.width / 2 - viewWidth / 2;
    const maxCameraX = Math.max(0, this.level.worldWidth - viewWidth);
    const clampedTarget = Math.max(0, Math.min(maxCameraX, targetCameraX));

    // Smooth horizontal lerp: 1 - exp(-10 * dt)
    this.cameraX += (clampedTarget - this.cameraX) * (1 - Math.exp(-9 * dt));

    // Notify HUD
    this.onStatsUpdate(this.stats, this.player.health);
  }

  private updateHighScore() {
    if (this.stats.score > this.stats.highScore) {
      this.stats.highScore = this.stats.score;
      try {
        localStorage.setItem('robot_mini_games_highscore', String(this.stats.highScore));
        localStorage.setItem('chicken_adventure_highscore', String(this.stats.highScore));
      } catch {
        // Storage unavailable
      }
    }
  }

  private handleGameOver() {
    this.isEnded = true;
    soundManager.stopBGM();
    soundManager.playGameOver();
    this.updateHighScore();
    this.onGameOver(this.stats);
  }

  private handleVictory() {
    this.isEnded = true;
    this.player.animState = 'win';
    soundManager.stopBGM();
    soundManager.playVictory();
    // Bonus victory score for remaining health and completion
    const healthBonus = this.player.health * 2;
    this.stats.score += healthBonus + 100;
    this.updateHighScore();

    for (let i = 0; i < 25; i++) {
      this.particles.push(
        createSparkleParticle(
          this.level.finish.x + Math.random() * this.level.finish.width,
          this.level.finish.y + Math.random() * this.level.finish.height,
          Math.random() > 0.5 ? '#FBBF24' : '#38BDF8'
        )
      );
    }

    this.onVictory(this.stats);
  }

  private render() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const viewWidth = this.canvas.width / dpr;
    const viewHeight = this.canvas.height / dpr;

    this.ctx.clearRect(0, 0, viewWidth, viewHeight);

    // 1. Gambar Background & Nature Paralaks
    drawEnvironment(this.ctx, this.level, this.cameraX, viewWidth, viewHeight);

    // 2. Render Dunia Game di Ruang Kamera (World Transformation)
    this.ctx.save();
    this.ctx.translate(-Math.round(this.cameraX), 0);

    // Platform & Tanah
    drawPlatforms(this.ctx, this.level.platforms);

    // Finish Goal (Sarang Telur Emas)
    drawFinishGoal(this.ctx, this.level.finish, this.stats.levelTimer);

    // Koin-koin
    for (const coin of this.level.coins) {
      drawCoin(this.ctx, coin);
    }

    // Heart Pickups
    for (const heart of this.level.hearts) {
      drawHeartPickup(this.ctx, heart);
    }

    // Musuh Kucing
    for (const enemy of this.level.enemies) {
      drawEnemy(this.ctx, enemy);
    }

    // Karakter Ayam
    drawPlayer(this.ctx, this.player);

    // Partikel & Efek Visual
    drawParticles(this.ctx, this.particles);

    this.ctx.restore();
  }
}
