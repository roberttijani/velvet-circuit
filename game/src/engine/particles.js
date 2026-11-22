/**
 * particles.js - Multi-Layered Particle & Diegetic Effects Engine (v4)
 * Coordinates authentic procedural visual effects:
 * - Swirling volumetric smoke veil puffs with density layering
 * - Crackling electric-blue EMP lightning arcs with diegetic countdown timer
 * - Concentric gold acoustic sound-wave ripples
 * - Subtle ambient floating dust motes caught in spotlights
 */

export class ParticleEngine {
  constructor() {
    this.dustMotes = [];
    this.initDustMotes(36);
  }

  initDustMotes(count) {
    this.dustMotes = [];
    for (let i = 0; i < count; i++) {
      this.dustMotes.push({
        x: Math.random() * 1280,
        y: Math.random() * 480,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        radius: 0.8 + Math.random() * 1.4,
        alpha: 0.15 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  update(dt) {
    for (let m of this.dustMotes) {
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      if (m.x < 40) m.x = 1240;
      if (m.x > 1240) m.x = 40;
      if (m.y < 44) m.y = 448;
      if (m.y > 448) m.y = 44;
      m.phase += dt * 1.5;
    }
  }

  /**
   * Renders ambient dust motes caught in spotlights and corridors.
   */
  renderDustMotes(ctx) {
    ctx.save();
    for (let m of this.dustMotes) {
      const a = m.alpha * (0.6 + 0.4 * Math.sin(m.phase));
      ctx.fillStyle = `rgba(200, 240, 255, ${a})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Renders dense, multi-layered swirling volumetric smoke clouds.
   */
  renderSmokeClouds(ctx, smokeClouds = [], time = 0) {
    if (!smokeClouds || smokeClouds.length === 0) return;
    ctx.save();

    for (let sc of smokeClouds) {
      if (!sc.active || sc.radius <= 0) continue;

      const baseAlpha = sc.alpha !== undefined ? sc.alpha : 0.85;

      // 1. Soft outer atmospheric fog bloom
      const grad = ctx.createRadialGradient(sc.x, sc.y, sc.radius * 0.2, sc.x, sc.y, sc.radius * 1.15);
      grad.addColorStop(0, `rgba(180, 205, 230, ${baseAlpha * 0.45})`);
      grad.addColorStop(0.65, `rgba(140, 165, 195, ${baseAlpha * 0.25})`);
      grad.addColorStop(1, "rgba(100, 130, 160, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sc.x, sc.y, sc.radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // 2. Swirling internal smoke puffs
      const puffCount = 9;
      for (let p = 0; p < puffCount; p++) {
        const angle = (p / puffCount) * Math.PI * 2 + time * 0.45;
        const dist = (sc.radius * 0.45) * (0.8 + 0.2 * Math.sin(time + p));
        const px = sc.x + Math.cos(angle) * dist;
        const py = sc.y + Math.sin(angle) * dist;
        const pr = sc.radius * 0.42;

        const puffGrad = ctx.createRadialGradient(px, py, 4, px, py, pr);
        puffGrad.addColorStop(0, `rgba(220, 235, 250, ${baseAlpha * 0.38})`);
        puffGrad.addColorStop(0.7, `rgba(160, 185, 215, ${baseAlpha * 0.18})`);
        puffGrad.addColorStop(1, "rgba(140, 165, 195, 0)");

        ctx.fillStyle = puffGrad;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Dense core
      ctx.fillStyle = `rgba(240, 248, 255, ${baseAlpha * 0.22})`;
      ctx.beginPath();
      ctx.arc(sc.x, sc.y, sc.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Renders electric-blue EMP lightning arcs with diegetic countdown timer.
   */
  renderEMPEffects(ctx, empFlashes = [], disabledCameras = []) {
    if (!empFlashes || empFlashes.length === 0) return;
    ctx.save();

    for (let f of empFlashes) {
      if (f.alpha <= 0) continue;

      // 1. Expanding distortion ring
      ctx.strokeStyle = `rgba(0, 240, 255, ${f.alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Secondary shock ring
      ctx.strokeStyle = `rgba(255, 255, 255, ${f.alpha * 0.75})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(f.x, f.y, Math.max(0, f.radius - 8), 0, Math.PI * 2);
      ctx.stroke();

      // 2. Branching electric lightning bolts
      ctx.strokeStyle = `rgba(220, 250, 255, ${f.alpha * 0.95})`;
      ctx.lineWidth = 1.8;
      const boltCount = 8;
      for (let b = 0; b < boltCount; b++) {
        const baseA = (b / boltCount) * Math.PI * 2;
        let curX = f.x;
        let curY = f.y;
        ctx.beginPath();
        ctx.moveTo(curX, curY);

        const segments = 4;
        const segLen = f.radius / segments;
        for (let s = 1; s <= segments; s++) {
          const jitter = (Math.random() - 0.5) * 14;
          const dist = s * segLen;
          const a = baseA + jitter * 0.05;
          const nextX = f.x + Math.cos(a) * dist + (Math.random() - 0.5) * 8;
          const nextY = f.y + Math.sin(a) * dist + (Math.random() - 0.5) * 8;
          ctx.lineTo(nextX, nextY);
          curX = nextX;
          curY = nextY;
        }
        ctx.stroke();
      }

      // 3. Central ion flash core
      const coreGrad = ctx.createRadialGradient(f.x, f.y, 2, f.x, f.y, 24);
      coreGrad.addColorStop(0, `rgba(255, 255, 255, ${f.alpha * 0.9})`);
      coreGrad.addColorStop(0.5, `rgba(0, 240, 255, ${f.alpha * 0.5})`);
      coreGrad.addColorStop(1, "rgba(0, 240, 255, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(f.x, f.y, 24, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Floating diegetic countdown timer over EMP-disabled security cameras
    for (let cam of disabledCameras) {
      if (cam.disabledTimer > 0) {
        const timeSec = cam.disabledTimer.toFixed(1);
        const tagText = `[ OFFLINE ${timeSec}s ]`;
        ctx.font = "bold 8px 'Courier New', monospace";
        const tw = ctx.measureText(tagText).width + 12;

        const bx = cam.x - tw * 0.5;
        const by = cam.y - 18;

        ctx.fillStyle = "rgba(7, 12, 22, 0.92)";
        ctx.fillRect(bx, by, tw, 13);
        ctx.strokeStyle = "#00F0FF";
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, tw, 13);

        ctx.fillStyle = "#00F0FF";
        ctx.fillText(tagText, bx + 6, by + 9.5);
      }
    }

    ctx.restore();
  }

  /**
   * Renders expanding gold acoustic sound-wave ripples.
   */
  renderSoundRipples(ctx, ripples = []) {
    if (!ripples || ripples.length === 0) return;
    ctx.save();

    for (let r of ripples) {
      if (!r.active || r.alpha <= 0) continue;

      // Primary gold sound ring
      ctx.strokeStyle = `rgba(245, 158, 11, ${r.alpha * 0.9})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Soft radar glow halo
      ctx.strokeStyle = `rgba(254, 240, 138, ${r.alpha * 0.4})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(r.x, r.y, Math.max(0, r.radius - 3), 0, Math.PI * 2);
      ctx.stroke();

      // Directional sound ticks
      ctx.strokeStyle = `rgba(245, 158, 11, ${r.alpha * 0.7})`;
      ctx.lineWidth = 1.5;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(r.x + Math.cos(a) * (r.radius - 5), r.y + Math.sin(a) * (r.radius - 5));
        ctx.lineTo(r.x + Math.cos(a) * (r.radius + 5), r.y + Math.sin(a) * (r.radius + 5));
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}
