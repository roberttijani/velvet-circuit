/**
 * gadgets.js - Tactical Gadget System for Velvet Circuit
 * Implements Decoy Transmitters, EMP Disruptor Pulses, and Smoke Screen Veils.
 */

export class GadgetManager {
  constructor() {
    this.selected = 1; // 1: Decoy, 2: EMP, 3: Smoke
    this.inventory = {
      decoy: 3,
      emp: 2,
      smoke: 2
    };

    this.projectiles = [];
    this.soundRipples = [];
    this.smokeClouds = [];
    this.empFlashes = [];
  }

  select(num) {
    if (num >= 1 && num <= 3) {
      this.selected = num;
    }
  }

  useCurrent(originX, originY, targetX, targetY, cameras, lasers, guards, audioEngine) {
    if (this.selected === 1) {
      return this.throwDecoy(originX, originY, targetX, targetY, guards, audioEngine);
    } else if (this.selected === 2) {
      return this.deployEMP(targetX, targetY, cameras, lasers, audioEngine);
    } else if (this.selected === 3) {
      return this.deploySmoke(originX, originY, targetX, targetY, audioEngine);
    }
    return false;
  }

  throwDecoy(ox, oy, tx, ty, guards, audioEngine) {
    if (this.inventory.decoy <= 0) return false;
    this.inventory.decoy--;

    // Launch projectile
    this.projectiles.push({
      type: "decoy",
      x: ox,
      y: oy,
      targetX: tx,
      targetY: ty,
      progress: 0,
      duration: 0.35,
      onImpact: () => {
        if (audioEngine) audioEngine.playDecoyClink();
        // Emit expanding sound ripple
        this.emitSoundRipple(tx, ty, 230);
        // Alert guards in radius
        for (let g of guards) {
          g.hearSound(tx, ty, 230);
        }
      }
    });
    return true;
  }

  deployEMP(tx, ty, cameras, lasers, audioEngine) {
    if (this.inventory.emp <= 0) return false;
    this.inventory.emp--;

    if (audioEngine) audioEngine.playEMP();

    const empRadius = 280;
    const disableDuration = 6.0;

    // Flash visual
    this.empFlashes.push({
      x: tx,
      y: ty,
      radius: 0,
      maxRadius: empRadius,
      alpha: 1.0
    });

    // Disable cameras
    for (let cam of cameras) {
      const dist = Math.hypot(cam.x - tx, cam.y - ty);
      if (dist <= empRadius) {
        cam.disabledTimer = disableDuration;
      }
    }

    // Disable lasers
    for (let laser of lasers) {
      const midX = (laser.x1 + laser.x2) * 0.5;
      const midY = (laser.y1 + laser.y2) * 0.5;
      if (Math.hypot(midX - tx, midY - ty) <= empRadius) {
        laser.disabledTimer = disableDuration;
      }
    }

    return true;
  }

  deploySmoke(ox, oy, tx, ty, audioEngine) {
    if (this.inventory.smoke <= 0) return false;
    this.inventory.smoke--;

    this.projectiles.push({
      type: "smoke",
      x: ox,
      y: oy,
      targetX: tx,
      targetY: ty,
      progress: 0,
      duration: 0.3,
      onImpact: () => {
        if (audioEngine) audioEngine.playSmoke();
        this.smokeClouds.push({
          x: tx,
          y: ty,
          radius: 75,
          alpha: 1.0,
          timer: 8.0,
          maxDuration: 8.0,
          active: true
        });
      }
    });
    return true;
  }

  emitSoundRipple(x, y, maxRadius = 180) {
    this.soundRipples.push({
      x,
      y,
      radius: 5,
      maxRadius: maxRadius,
      alpha: 1.0,
      speed: 380,
      active: true
    });
  }

  update(dt) {
    // 1. Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.progress += dt / p.duration;
      if (p.progress >= 1.0) {
        p.onImpact();
        this.projectiles.splice(i, 1);
      } else {
        p.x = p.x + (p.targetX - p.x) * p.progress;
        p.y = p.y + (p.targetY - p.y) * p.progress;
      }
    }

    // 2. Update Sound Ripples
    for (let i = this.soundRipples.length - 1; i >= 0; i--) {
      const r = this.soundRipples[i];
      r.radius += r.speed * dt;
      r.alpha = Math.max(0, 1.0 - (r.radius / r.maxRadius));
      if (r.radius >= r.maxRadius || r.alpha <= 0) {
        this.soundRipples.splice(i, 1);
      }
    }

    // 3. Update EMP Flashes
    for (let i = this.empFlashes.length - 1; i >= 0; i--) {
      const f = this.empFlashes[i];
      f.radius += dt * 650;
      f.alpha -= dt * 2.2;
      if (f.alpha <= 0) {
        this.empFlashes.splice(i, 1);
      }
    }

    // 4. Update Smoke Clouds
    for (let i = this.smokeClouds.length - 1; i >= 0; i--) {
      const sc = this.smokeClouds[i];
      sc.timer -= dt;
      if (sc.timer <= 1.5) {
        sc.alpha = Math.max(0, sc.timer / 1.5);
      }
      if (sc.timer <= 0) {
        this.smokeClouds.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.save();

    // Render flying projectiles
    for (let p of this.projectiles) {
      ctx.fillStyle = p.type === "decoy" ? "#F59E0B" : "#94A3B8";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render EMP distortion shockwave rings
    for (let f of this.empFlashes) {
      ctx.strokeStyle = `rgba(0, 240, 255, ${f.alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Electric arc spark lines
      ctx.strokeStyle = `rgba(255, 255, 255, ${f.alpha * 0.8})`;
      ctx.lineWidth = 1.5;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        const sx = f.x + Math.cos(a) * (f.radius * 0.8);
        const sy = f.y + Math.sin(a) * (f.radius * 0.8);
        const ex = f.x + Math.cos(a + 0.2) * f.radius;
        const ey = f.y + Math.sin(a + 0.2) * f.radius;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}
