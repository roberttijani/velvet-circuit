/**
 * thiefController.js - Operative Movement, Stealth & Interaction Controller
 * Handles 8-directional movement, wall sliding collision, footstep trailing, and hacking.
 */

import { distToSegment } from '../world/raycast.js';

export class ThiefController {
  constructor(startX = 90, startY = 390) {
    this.x = startX;
    this.y = startY;
    this.radius = 9;
    this.facing = 0;
    this.speed = 130;
    this.isSneaking = false;
    this.isSprinting = false;

    this.hasLoot = false;
    this.interacting = false;
    this.interactProgress = 0; // 0 to 1
    this.interactTarget = null;

    this.footstepTimer = 0;
    this.footsteps = [];
  }

  reset(x, y, facing = 0) {
    this.x = x;
    this.y = y;
    this.facing = facing;
    this.hasLoot = false;
    this.interacting = false;
    this.interactProgress = 0;
    this.interactTarget = null;
    this.footsteps = [];
  }

  update(dt, inputState, wallSegments, loot, terminals, exfil, gadgetManager, audioEngine, onLevelComplete) {
    // 1. Determine Movement Vector
    let moveX = 0;
    let moveY = 0;

    if (inputState.keys['KeyW'] || inputState.keys['ArrowUp']) moveY -= 1;
    if (inputState.keys['KeyS'] || inputState.keys['ArrowDown']) moveY += 1;
    if (inputState.keys['KeyA'] || inputState.keys['ArrowLeft']) moveX -= 1;
    if (inputState.keys['KeyD'] || inputState.keys['ArrowRight']) moveX += 1;

    // Sneak / Sprint
    this.isSneaking = inputState.keys['ShiftLeft'] || inputState.keys['ShiftRight'];
    this.isSprinting = false; // Shift defaults to stealth sneak

    let currentSpeed = this.speed;
    if (this.isSneaking) {
      currentSpeed = this.speed * 0.55; // 70 px/s silent sneak
    }

    const isMoving = moveX !== 0 || moveY !== 0;

    if (isMoving) {
      const len = Math.hypot(moveX, moveY);
      moveX /= len;
      moveY /= len;

      const deltaDist = currentSpeed * dt;
      const nextX = this.x + moveX * deltaDist;
      const nextY = this.y + moveY * deltaDist;

      // Wall collision with sliding
      this.moveWithCollision(nextX, nextY, wallSegments);

      // Facing orientation towards movement
      this.facing = Math.atan2(moveY, moveX);

      // Footstep generation
      this.footstepTimer += dt;
      const stepInterval = this.isSneaking ? 0.45 : 0.28;
      if (this.footstepTimer >= stepInterval) {
        this.footstepTimer = 0;
        this.footsteps.push({
          x: this.x,
          y: this.y,
          facing: this.facing,
          alpha: 1.0
        });

        if (audioEngine) {
          audioEngine.playFootstep(this.isSneaking);
        }

        // Running creates sound ripples that guards hear
        if (!this.isSneaking && gadgetManager) {
          gadgetManager.emitSoundRipple(this.x, this.y, 70);
        }
      }
    }

    // Facing can also track mouse when stationary
    if (!isMoving && inputState.mouse) {
      const mdx = inputState.mouse.x - this.x;
      const mdy = inputState.mouse.y - this.y;
      this.facing = Math.atan2(mdy, mdx);
    }

    // 2. Fade footstep decals
    for (let i = this.footsteps.length - 1; i >= 0; i--) {
      this.footsteps[i].alpha -= dt * 0.45;
      if (this.footsteps[i].alpha <= 0) {
        this.footsteps.splice(i, 1);
      }
    }

    // 3. Interaction Check (E or Space)
    const wantsInteract = inputState.keys['KeyE'] || inputState.keys['Space'];

    // Check Loot Pedestal
    const distToLoot = Math.hypot(loot.x - this.x, loot.y - this.y);
    if (!this.hasLoot && distToLoot < 42) {
      this.interactTarget = { type: 'loot', obj: loot };
      if (wantsInteract) {
        this.interacting = true;
        this.interactProgress += dt / 1.0;
        if (audioEngine && Math.random() < 0.2) audioEngine.playHackTick();
        if (this.interactProgress >= 1.0) {
          this.hasLoot = true;
          this.interactProgress = 0;
          this.interacting = false;
          if (audioEngine) audioEngine.playLootGrab();
        }
      } else {
        this.interactProgress = Math.max(0, this.interactProgress - dt * 2);
      }
    }
    // Check Terminals
    else {
      let nearTerm = null;
      for (let term of terminals) {
        if (!term.hacked && Math.hypot(term.x - this.x, term.y - this.y) < 38) {
          nearTerm = term;
          break;
        }
      }

      if (nearTerm) {
        this.interactTarget = { type: 'terminal', obj: nearTerm };
        if (wantsInteract) {
          this.interacting = true;
          this.interactProgress += dt / nearTerm.hackTime;
          if (audioEngine && Math.random() < 0.2) audioEngine.playHackTick();
          if (this.interactProgress >= 1.0) {
            nearTerm.hacked = true;
            this.interactProgress = 0;
            this.interacting = false;
            if (audioEngine) audioEngine.playHackComplete();
          }
        } else {
          this.interactProgress = Math.max(0, this.interactProgress - dt * 2);
        }
      } else {
        this.interactTarget = null;
        this.interacting = false;
        this.interactProgress = 0;
      }
    }

    // 4. Extraction Check
    if (this.hasLoot) {
      if (
        this.x >= exfil.x &&
        this.x <= exfil.x + exfil.w &&
        this.y >= exfil.y &&
        this.y <= exfil.y + exfil.h
      ) {
        if (onLevelComplete) onLevelComplete();
      }
    }
  }

  moveWithCollision(newX, newY, wallSegments) {
    let resolvedX = newX;
    let resolvedY = newY;

    // Test X move
    let collideX = false;
    for (let w of wallSegments) {
      if (distToSegment(resolvedX, this.y, w.x1, w.y1, w.x2, w.y2) < this.radius) {
        collideX = true;
        break;
      }
    }
    if (!collideX) {
      this.x = resolvedX;
    }

    // Test Y move
    let collideY = false;
    for (let w of wallSegments) {
      if (distToSegment(this.x, resolvedY, w.x1, w.y1, w.x2, w.y2) < this.radius) {
        collideY = true;
        break;
      }
    }
    if (!collideY) {
      this.y = resolvedY;
    }
  }
}
