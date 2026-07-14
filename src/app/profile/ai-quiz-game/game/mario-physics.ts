import {
  AABB, GRAVITY, MAX_FALL, MOVE_SPEED, RUN_SPEED, JUMP_FORCE, TILE,
  GROUND_ACCEL, AIR_ACCEL, GROUND_FRICTION, SKID_FRICTION,
  COYOTE_FRAMES, JUMP_BUFFER_FRAMES, JUMP_CUT_MULTIPLIER,
  FLY_THRUST, FLY_MAX_RISE, FLY_GRAVITY, FLY_MAX_FALL, FLY_DIVE,
  Player, Platform, Enemy, QuestionBlock, Fireball, Level
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
  fireballKilledEnemies: Enemy[];
  firedFireball: boolean;
  brickBroken: Platform | null;
  brickBumped: Platform | null;
  reachedFlag: boolean;
  died: boolean;
  jumped: boolean;
  coinCollected: boolean;
}

function solidPlatforms(level: Level): Platform[] {
  return [
    ...level.platforms.filter(p => !p.destroyed),
    ...level.questionBlocks,
  ];
}

export function updatePhysics(
  player: Player,
  level: Level,
  keys: { left: boolean; right: boolean; jump: boolean; fire: boolean; run?: boolean; down?: boolean }
): CollisionResult {
  const result: CollisionResult = {
    hitQuestionBlock: null,
    hitEnemy: null,
    stompedEnemy: null,
    fireballKilledEnemies: [],
    firedFireball: false,
    brickBroken: null,
    brickBumped: null,
    reachedFlag: false,
    died: false,
    jumped: false,
    coinCollected: false,
  };

  const isWater = level.levelType === 'water';
  const isFlight = level.levelType === 'sky';
  const wantsRun = !!keys.run && !isWater && !isFlight;
  const topSpeed = isWater ? MOVE_SPEED * 0.72 : (wantsRun ? RUN_SPEED : MOVE_SPEED);
  const fallLimit = isWater ? MAX_FALL * 0.35 : isFlight ? FLY_MAX_FALL : MAX_FALL;
  const accel = player.onGround ? GROUND_ACCEL : AIR_ACCEL;

  // --- Horizontal movement with acceleration, friction and skidding ---
  player.running = wantsRun && Math.abs(player.vx) > MOVE_SPEED * 0.6;
  player.skidding = false;

  if (isWater) {
    // Water keeps the simpler, floaty feel
    if (keys.left) { player.vx = -topSpeed; player.facing = 'left'; }
    else if (keys.right) { player.vx = topSpeed; player.facing = 'right'; }
    else {
      player.vx *= 0.84;
      if (Math.abs(player.vx) < 0.2) player.vx = 0;
    }
  } else if (keys.left) {
    player.facing = 'left';
    if (player.vx > 0) { player.vx *= SKID_FRICTION; player.skidding = player.onGround; }
    player.vx -= accel;
    if (player.vx < -topSpeed) player.vx = -topSpeed;
  } else if (keys.right) {
    player.facing = 'right';
    if (player.vx < 0) { player.vx *= SKID_FRICTION; player.skidding = player.onGround; }
    player.vx += accel;
    if (player.vx > topSpeed) player.vx = topSpeed;
  } else {
    player.vx *= player.onGround ? GROUND_FRICTION : 0.94;
    if (Math.abs(player.vx) < 0.15) player.vx = 0;
  }

  // Clamp to the active top speed (walk cap when run released mid-stride)
  if (player.vx > topSpeed) player.vx = topSpeed;
  if (player.vx < -topSpeed) player.vx = -topSpeed;

  // Drive the walk-cycle animation phase from actual ground speed
  if (player.onGround && Math.abs(player.vx) > 0.4) {
    player.walkPhase += Math.abs(player.vx) * 0.06;
  }

  // --- Jump: coyote time + input buffering + variable height ---
  const jumpPressed = keys.jump && !player.jumpHeld;
  player.jumpHeld = keys.jump;

  if (isWater) {
    if (player.swimStrokeCooldown > 0) player.swimStrokeCooldown--;
    if (keys.jump && player.swimStrokeCooldown <= 0) {
      player.vy = Math.min(player.vy - 4.4, -5.4);
      player.onGround = false;
      player.swimStrokeCooldown = 10;
      result.jumped = true;
    }
  } else if (isFlight) {
    // Air mode: hold jump/up to fly upward, hold down to dive, glide otherwise.
    player.flying = false;
    if (keys.jump) {
      player.vy -= FLY_THRUST;
      if (player.vy < FLY_MAX_RISE) player.vy = FLY_MAX_RISE;
      player.onGround = false;
      player.flying = true;
      // A fresh tap registers as a flap for audio/feedback
      if (jumpPressed) result.jumped = true;
    }
    if (keys.down) {
      player.vy += FLY_DIVE;
    }
  } else {
    // Update timers
    if (player.onGround) player.coyoteTimer = COYOTE_FRAMES;
    else if (player.coyoteTimer > 0) player.coyoteTimer--;

    if (jumpPressed) player.jumpBufferTimer = JUMP_BUFFER_FRAMES;
    else if (player.jumpBufferTimer > 0) player.jumpBufferTimer--;

    const canJump = player.coyoteTimer > 0 && player.jumpBufferTimer > 0;
    if (canJump) {
      // Faster horizontal travel gives a slightly higher hop, classic Mario feel
      const speedBonus = Math.min(Math.abs(player.vx) / RUN_SPEED, 1) * 1.6;
      player.vy = JUMP_FORCE - speedBonus;
      player.onGround = false;
      player.isJumping = true;
      player.coyoteTimer = 0;
      player.jumpBufferTimer = 0;
      result.jumped = true;
    }

    // Variable height: releasing jump while rising cuts the ascent short
    if (player.isJumping && !keys.jump && player.vy < 0) {
      player.vy *= JUMP_CUT_MULTIPLIER;
      player.isJumping = false;
    }
    if (player.vy >= 0) player.isJumping = false;
  }

  // Gravity
  if (isWater) {
    player.vy += GRAVITY * 0.22;
    player.vy *= 0.94;
  } else if (isFlight) {
    // Soft gravity so flight feels floaty; lighter still while actively flying
    player.vy += player.flying ? FLY_GRAVITY * 0.35 : FLY_GRAVITY;
    player.vy *= 0.985;
  } else {
    player.vy += GRAVITY;
  }
  if (player.vy > fallLimit) player.vy = fallLimit;

  // Fire cooldown
  if (player.fireCooldown > 0) player.fireCooldown--;

  // Shoot fireball
  if (keys.fire && player.state === 'fire' && player.fireCooldown <= 0 && level.fireballs.length < 3) {
    const dir = player.facing === 'right' ? 1 : -1;
    const fx = player.facing === 'right' ? player.x + player.w : player.x - TILE * 0.35;
    const fy = player.y + player.h * 0.4;
    level.fireballs.push(new Fireball(fx, fy, dir));
    player.fireCooldown = 15;
    result.firedFireball = true;
  }

  const allPlatforms = solidPlatforms(level);

  // --- Move X, resolve X ---
  player.x += player.vx;
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > level.width) player.x = level.width - player.w;

  for (const p of allPlatforms) {
    const pen = penetration(player.box, p.box);
    if (!pen) continue;

    const isHittableBlock = (p instanceof QuestionBlock && !p.hit) ||
      (p.type === 'brick' && !p.destroyed && p.w <= TILE * 4);
    if (isHittableBlock && player.vy < 0) continue;

    // Minimum-penetration-axis: only resolve X when X overlap < Y overlap (side hit)
    if (pen.px < pen.py) {
      const playerCenter = player.x + player.w / 2;
      const platCenter = p.x + p.w / 2;
      if (playerCenter < platCenter) player.x = p.x - player.w;
      else player.x = p.x + p.w;
      player.vx = 0;
    }
  }

  // --- Move Y, resolve Y ---
  player.y += player.vy;
  player.onGround = false;

  for (const p of allPlatforms) {
    const pen = penetration(player.box, p.box);
    if (!pen) continue;

    // Skip side-collision leaks: only resolve Y when Y is the min penetration axis
    if (pen.py > pen.px) continue;

    if (player.vy >= 0) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
    } else {
      player.y = p.y + p.h;
      player.vy = 0;

      if (p instanceof QuestionBlock && !p.hit) {
        p.hit = true;
        result.hitQuestionBlock = p;
      } else if (p.type === 'brick' && !p.destroyed) {
        if (player.isBig || player.starTimer > 0) {
          p.destroyed = true;
          result.brickBroken = p;
          player.score += 20;
        } else {
          result.brickBumped = p;
        }
      }
    }
  }

  // Fall off screen
  if (player.y > level.height + 100) {
    result.died = true;
    return result;
  }

  // Timers
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
    const enemyMidY = enemy.y + enemy.h * 0.55;

    // Stomp: feet are in the upper half of enemy AND not actively rising
    if (player.vy >= -0.5 && playerBottom <= enemyMidY) {
      enemy.alive = false;
      enemy.squashTimer = 15;
      player.vy = JUMP_FORCE * 0.6;
      player.score += 50;
      result.stompedEnemy = enemy;
    } else if (player.invincibleTimer <= 0) {
      result.hitEnemy = enemy;
    }
  }

  // Fireball physics
  for (const fb of level.fireballs) {
    if (!fb.alive) continue;
    fb.life--;
    if (fb.life <= 0) { fb.alive = false; continue; }

    fb.x += fb.vx;
    fb.vy += (isWater ? GRAVITY * 0.18 : GRAVITY * 0.7);
    fb.y += fb.vy;

    // Bounce off platforms
    for (const p of allPlatforms) {
      if (aabbOverlap(fb.box, p.box)) {
        if (fb.vy > 0) {
          fb.y = p.y - fb.h;
          fb.vy = -5;
          fb.bounces++;
          if (fb.bounces > 4) fb.alive = false;
        } else {
          fb.alive = false;
        }
        break;
      }
    }

    if (fb.x < 0 || fb.x > level.width) { fb.alive = false; continue; }

    // Fireball kills enemies
    if (!fb.alive) continue;
    for (const enemy of level.enemies) {
      if (!enemy.alive) continue;
      if (aabbOverlap(fb.box, enemy.box)) {
        enemy.alive = false;
        enemy.squashTimer = 15;
        fb.alive = false;
        player.score += 50;
        result.fireballKilledEnemies.push(enemy);
        break;
      }
    }
  }

  level.fireballs = level.fireballs.filter(fb => fb.alive);

  // Enemy movement
  for (const enemy of level.enemies) {
    if (!enemy.alive) {
      if (enemy.squashTimer > 0) enemy.squashTimer--;
      continue;
    }

    enemy.x += enemy.vx * (isWater ? 0.6 : 1);

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
      if (!landed) enemy.y += isWater ? 1 : 2;
    }
  }

  // Floating texts & debris
  for (const ft of level.floatingTexts) ft.tick();
  for (const d of level.debris) d.tick();
  level.floatingTexts = level.floatingTexts.filter(ft => ft.alive);
  level.debris = level.debris.filter(d => d.alive);

  // Flag pole
  if (aabbOverlap(player.box, level.flagPole.box)) {
    result.reachedFlag = true;
  }

  return result;
}
