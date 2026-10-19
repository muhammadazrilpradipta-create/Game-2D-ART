/**
 * 2D Physics & BoxCollider System
 * Sesuai prinsip Rigidbody2D dan BoxCollider2D pada Jobsheet 1 & 2
 */

import { Player, Platform, Rect } from '../types/game';

/**
 * Cek interseksi antara dua Axis-Aligned Bounding Box (AABB)
 */
export function checkAABB(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Update pergerakan Player dengan collision Rigidbody2D + BoxCollider2D
 */
export function updatePlayerPhysics(
  player: Player,
  platforms: Platform[],
  inputX: number, // -1 (A/Kiri), 0, 1 (D/Kanan)
  jumpPressed: boolean,
  jumpHolding: boolean,
  ms: number, // Move Speed (Jobsheet 1)
  jf: number, // Jump Force (Jobsheet 1)
  gravityScale: number,
  deltaTime: number
): { jumped: boolean; landed: boolean } {
  let jumped = false;
  let landed = false;
  const dt = Math.min(deltaTime, 0.05); // Clamp dt to prevent tunneling on frame drops

  // 1. Horizontal movement (Ms * horiz, sesuai script Jobsheet 1 halaman 4)
  const targetVx = inputX * ms;
  // Smooth acceleration & braking
  const accel = player.isGrounded ? 18 : 12;
  player.vx += (targetVx - player.vx) * Math.min(1, accel * dt);

  if (Math.abs(inputX) > 0.05) {
    player.facing = inputX > 0 ? 'right' : 'left';
  }

  // 2. Coyote Time & Jump Buffer
  if (player.isGrounded) {
    player.coyoteTimer = 0.12; // 120ms coyote window
  } else {
    player.coyoteTimer -= dt;
  }

  if (jumpPressed) {
    player.jumpBufferTimer = 0.12; // 120ms jump buffer
  } else {
    player.jumpBufferTimer -= dt;
  }

  // 3. Jump Execution
  if (player.jumpBufferTimer > 0 && player.coyoteTimer > 0) {
    player.vy = -jf; // Jump Force ke atas
    player.isGrounded = false;
    player.coyoteTimer = 0;
    player.jumpBufferTimer = 0;
    jumped = true;
  }

  // Variable jump height: lepaskan space untuk lompat pendek
  if (!jumpHolding && player.vy < -jf * 0.45) {
    player.vy *= 0.88;
  }

  // 4. Gravity (sesuai Gravity Scale Jobsheet 1 halaman 8)
  const baseGravity = 980; // pixels / s^2
  player.vy += baseGravity * gravityScale * dt;
  // Terminal velocity
  if (player.vy > 850) {
    player.vy = 850;
  }

  // 5. Horizontal Integration & Collision
  player.x += player.vx * dt;
  const playerBoxH: Rect = {
    x: player.x,
    y: player.y,
    width: player.width,
    height: player.height,
  };

  for (const plat of platforms) {
    if (plat.type === 'spikes') continue; // Spikes are triggers, not solid blockers
    if (plat.type === 'floating') continue; // One-way platforms don't block sides

    if (checkAABB(playerBoxH, plat)) {
      if (player.vx > 0) {
        player.x = plat.x - player.width;
      } else if (player.vx < 0) {
        player.x = plat.x + plat.width;
      }
      player.vx = 0;
      break;
    }
  }

  // 6. Vertical Integration & Collision
  const prevY = player.y;
  player.y += player.vy * dt;
  const wasGrounded = player.isGrounded;
  player.isGrounded = false;

  const playerBoxV: Rect = {
    x: player.x,
    y: player.y,
    width: player.width,
    height: player.height,
  };

  for (const plat of platforms) {
    if (plat.type === 'spikes') continue;

    if (checkAABB(playerBoxV, plat)) {
      if (plat.type === 'floating' || plat.type === 'moving') {
        // One-way platform: hanya padat jika player jatuh dari atas
        const playerBottomPrev = prevY + player.height;
        if (player.vy > 0 && playerBottomPrev <= plat.y + 12) {
          player.y = plat.y - player.height;
          player.vy = 0;
          player.isGrounded = true;
          if (!wasGrounded) landed = true;

          // Riding moving platform
          if (plat.speed && plat.direction) {
            player.x += plat.speed * plat.direction * dt;
          }
          break;
        }
      } else {
        // Solid ground & solid block
        if (player.vy > 0) {
          // Landing
          player.y = plat.y - player.height;
          player.vy = 0;
          player.isGrounded = true;
          if (!wasGrounded) landed = true;

          // Riding moving platform
          if (plat.speed && plat.direction) {
            player.x += plat.speed * plat.direction * dt;
          }
          break;
        } else if (player.vy < 0) {
          // Bumping head on ceiling
          player.y = plat.y + plat.height;
          player.vy = 0;
          break;
        }
      }
    }
  }

  // 7. Anim State resolution
  if (player.invulnerableTimer > 0) {
    player.animState = 'hurt';
  } else if (!player.isGrounded) {
    player.animState = player.vy < 0 ? 'jump' : 'fall';
  } else if (Math.abs(player.vx) > 15) {
    player.animState = 'run';
    player.walkFrame += dt * 10;
  } else {
    player.animState = 'idle';
    player.walkFrame += dt * 3;
  }

  return { jumped, landed };
}
