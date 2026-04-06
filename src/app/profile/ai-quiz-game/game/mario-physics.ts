import {
  AABB, GRAVITY, MAX_FALL, MOVE_SPEED, JUMP_FORCE,
  Player, Platform, Enemy, Coin, QuestionBlock, Level
} from './mario-entities';

export function aabbOverlap(a: AABB, b: AABB): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function penetration(a: AABB, b: AABB): { px: number; py: number } | null {
  const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  if (ox <= 0 || oy <= 0) return null;
  return { px: ox, py: oy };
}

export interface CollisionResult {
  hitQuestionBlock: QuestionBlock | null;
  hitEnemy: Enemy | null;
  stompedEnemy: Enemy | null;
  reachedFlag: boolean;
  died: boolean;
  jumped: boolean;
  coinCollected: boolean;
}

export function updatePhysics(
  player: Player,
  level: Level,
  keys: { left: boolean; right: boolean; jump: boolean }
): CollisionResult {
  const result: CollisionResult = {
    hitQuestionBlock: null,
    hitEnemy: null,
    stompedEnemy: null,
    reachedFlag: false,
    died: false,
    jumped: false,
    coinCollected: false,
  };

  // Horizontal movement
  if (keys.left) {
    player.vx = -MOVE_SPEED;
    player.facing = 'left';
  } else if (keys.right) {
    player.vx = MOVE_SPEED;
    player.facing = 'right';
  } else {
    player.vx *= 0.7;
    if (Math.abs(player.vx) < 0.2) player.vx = 0;
  }

  // Jump
  if (keys.jump && player.onGround) {
    player.vy = JUMP_FORCE;
    player.onGround = false;
    result.jumped = true;
  }

  // Gravity
  player.vy += GRAVITY;
  if (player.vy > MAX_FALL) player.vy = MAX_FALL;

  const allPlatforms: Platform[] = [...level.platforms, ...level.questionBlocks];

  // --- Move X, resolve X ---
  player.x += player.vx;
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > level.width) player.x = level.width - player.w;

  for (const p of allPlatforms) {
    const pen = penetration(player.box, p.box);
    if (!pen) continue;

    // Only resolve as X collision if the vertical overlap is large enough
    // (i.e. player is genuinely hitting the side, not grazing the top edge)
    if (pen.py > 6) {
      if (player.vx > 0) {
        player.x = p.x - player.w;
      } else if (player.vx < 0) {
        player.x = p.x + p.w;
      }
      player.vx = 0;
    }
  }

  // --- Move Y, resolve Y ---
  player.y += player.vy;
  player.onGround = false;

  for (const p of allPlatforms) {
    const pen = penetration(player.box, p.box);
    if (!pen) continue;

    if (player.vy > 0) {
      // Falling — land on top
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
    } else if (player.vy < 0) {
      // Rising — hit from below
      player.y = p.y + p.h;
      player.vy = 0;

      if (p instanceof QuestionBlock && !p.hit) {
        p.hit = true;
        result.hitQuestionBlock = p;
      }
    }
  }

  // Fall off screen
  if (player.y > level.height + 100) {
    result.died = true;
    return result;
  }

  // Invincibility / star timers
  if (player.invincibleTimer > 0) player.invincibleTimer--;
  if (player.starTimer > 0) player.starTimer--;

  // Coin collisions
  for (const coin of level.coins) {
    if (!coin.collected && aabbOverlap(player.box, coin.box)) {
      coin.collected = true;
      coin.animTimer = 20;
      player.coins++;
      player.score += 10;
      result.coinCollected = true;
    }
  }

  // Enemy collisions
  for (const enemy of level.enemies) {
    if (!enemy.alive) continue;
    if (!aabbOverlap(player.box, enemy.box)) continue;

    if (player.starTimer > 0) {
      enemy.alive = false;
      enemy.squashTimer = 15;
      player.score += 50;
      result.stompedEnemy = enemy;
      continue;
    }

    const playerBottom = player.y + player.h;
    const falling = player.vy > 0;

    if (falling && playerBottom - enemy.y < enemy.h * 0.4) {
      enemy.alive = false;
      enemy.squashTimer = 15;
      player.vy = JUMP_FORCE * 0.6;
      player.score += 50;
      result.stompedEnemy = enemy;
    } else if (player.invincibleTimer <= 0) {
      result.hitEnemy = enemy;
    }
  }

  // Enemy movement
  for (const enemy of level.enemies) {
    if (!enemy.alive) {
      if (enemy.squashTimer > 0) enemy.squashTimer--;
      continue;
    }

    enemy.x += enemy.vx;

    let hitWall = false;
    for (const p of allPlatforms) {
      if (aabbOverlap(enemy.box, p.box)) {
        if (enemy.vx > 0) enemy.x = p.x - enemy.w;
        else enemy.x = p.x + p.w;
        enemy.vx *= -1;
        hitWall = true;
        break;
      }
    }

    if (!hitWall) {
      let landed = false;
      for (const p of allPlatforms) {
        const feetBox: AABB = { x: enemy.x, y: enemy.y + enemy.h, w: enemy.w, h: 2 };
        if (aabbOverlap(feetBox, p.box)) {
          enemy.y = p.y - enemy.h;
          landed = true;
          break;
        }
      }
      if (!landed) {
        enemy.y += 2;
      }
    }
  }

  // Flag pole
  if (aabbOverlap(player.box, level.flagPole.box)) {
    result.reachedFlag = true;
  }

  return result;
}
