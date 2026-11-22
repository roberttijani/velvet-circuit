/**
 * lighting.js - Neo-Noir Atmospheric Lighting & Volumetric Illumination Engine (v4)
 * Coordinates:
 * - Warm golden spotlights over loot pedestals, exhibits, and boardroom tables
 * - Cool ambient corridor moonlight and underfloor glow
 * - Raycasted volumetric guard vision cones with soft edges and flashlight lens flare
 * - Wall-mounted CCTV surveillance scanlines
 * - Laser tripwire floor bounce and emitter boxes
 */

import { buildVisibilityPolygon, getFurnitureOccluderSegments } from '../world/raycast.js';

export class LightingEngine {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.scanlineOffset = 0;
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
    this.scanlineOffset = (this.scanlineOffset + dt * 45) % 12;
  }

  /**
   * Renders ambient atmospheric lighting pools (warm gold spotlights & cool ambient washes).
   */
  renderAtmosphericLighting(ctx, level, thief) {
    if (!level) return;
    ctx.save();

    // 1. Warm Golden Spotlight over Heist Loot Pedestal
    if (level.loot) {
      const lx = level.loot.x;
      const ly = level.loot.y;
      const pulse = 0.85 + 0.15 * Math.sin(this.time * 3);
      const spotGrad = ctx.createRadialGradient(lx, ly, 8, lx, ly, 125 * pulse);
      spotGrad.addColorStop(0, "rgba(251, 191, 36, 0.42)");
      spotGrad.addColorStop(0.35, "rgba(245, 158, 11, 0.22)");
      spotGrad.addColorStop(0.7, "rgba(217, 119, 6, 0.08)");
      spotGrad.addColorStop(1, "rgba(245, 158, 11, 0)");

      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(lx, ly, 125 * pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Warm spotlights over museum vitrines / boardroom table / terminals
    if (level.furniture) {
      for (let f of level.furniture) {
        if (f.type === "vitrine" || (f.type === "desk" && f.label && f.label.includes("BOARD"))) {
          const fx = f.x + f.w * 0.5;
          const fy = f.y + f.h * 0.5;
          const grad = ctx.createRadialGradient(fx, fy, 4, fx, fy, Math.max(f.w, f.h) * 0.9);
          grad.addColorStop(0, "rgba(254, 240, 138, 0.28)");
          grad.addColorStop(0.6, "rgba(245, 158, 11, 0.10)");
          grad.addColorStop(1, "rgba(245, 158, 11, 0)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(fx, fy, Math.max(f.w, f.h) * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 3. Hack Terminals ambient glow
    if (level.terminals) {
      for (let term of level.terminals) {
        const tgrad = ctx.createRadialGradient(term.x, term.y, 2, term.x, term.y, 42);
        tgrad.addColorStop(0, term.hacked ? "rgba(16, 185, 129, 0.35)" : "rgba(0, 240, 255, 0.28)");
        tgrad.addColorStop(0.7, term.hacked ? "rgba(16, 185, 129, 0.08)" : "rgba(0, 240, 255, 0.06)");
        tgrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = tgrad;
        ctx.beginPath();
        ctx.arc(term.x, term.y, 42, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. Cool cyan ambient glow around thief operative
    const tg = ctx.createRadialGradient(thief.x, thief.y, 4, thief.x, thief.y, 80);
    tg.addColorStop(0, "rgba(0, 240, 255, 0.20)");
    tg.addColorStop(0.6, "rgba(0, 160, 255, 0.08)");
    tg.addColorStop(1, "rgba(0, 100, 255, 0)");
    ctx.fillStyle = tg;
    ctx.beginPath();
    ctx.arc(thief.x, thief.y, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Renders the volumetric vision cone for a guard, occluded by walls AND furniture obstacles.
   */
  renderGuardCone(ctx, guard, wallSegments, smokeClouds, furnitureList = []) {
    const furnitureSegments = getFurnitureOccluderSegments(furnitureList);
    const rays = buildVisibilityPolygon(
      guard.x,
      guard.y,
      guard.viewDist,
      wallSegments,
      guard.facing,
      guard.fov,
      smokeClouds,
      furnitureSegments
    );

    if (rays.length < 2) return;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(guard.x, guard.y);
    for (let i = 0; i < rays.length; i++) {
      ctx.lineTo(rays[i].x, rays[i].y);
    }
    ctx.closePath();

    // Determine colors based on guard alert state
    let innerColor, midColor, outerColor, edgeColor;
    if (guard.state === "ALERT") {
      innerColor = "rgba(255, 30, 60, 0.55)";
      midColor = "rgba(255, 20, 50, 0.22)";
      outerColor = "rgba(255, 0, 30, 0.04)";
      edgeColor = "rgba(255, 60, 80, 0.95)";
    } else if (guard.state === "INVESTIGATING" || guard.state === "SUSPICIOUS") {
      innerColor = "rgba(255, 180, 0, 0.48)";
      midColor = "rgba(255, 140, 0, 0.18)";
      outerColor = "rgba(255, 120, 0, 0.03)";
      edgeColor = "rgba(255, 200, 40, 0.90)";
    } else {
      // Normal patrol: volumetric warm tactical amber/yellow
      innerColor = "rgba(255, 225, 150, 0.36)";
      midColor = "rgba(255, 200, 120, 0.14)";
      outerColor = "rgba(255, 180, 90, 0.02)";
      edgeColor = "rgba(255, 220, 130, 0.75)";
    }

    const grad = ctx.createRadialGradient(
      guard.x, guard.y, 6,
      guard.x, guard.y, guard.viewDist
    );
    grad.addColorStop(0, innerColor);
    grad.addColorStop(0.4, midColor);
    grad.addColorStop(0.85, outerColor);
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.fill();

    // Perimeter edge highlight
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Flashlight source lens flare
    const flareX = guard.x + Math.cos(guard.facing) * 11;
    const flareY = guard.y + Math.sin(guard.facing) * 11;
    const flareGrad = ctx.createRadialGradient(flareX, flareY, 1, flareX, flareY, 9);
    flareGrad.addColorStop(0, "#FFFFFF");
    flareGrad.addColorStop(0.4, edgeColor);
    flareGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = flareGrad;
    ctx.beginPath();
    ctx.arc(flareX, flareY, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Renders sweeping security camera cone with volumetric beam, scanlines, and obstacle shadows.
   */
  renderCameraCone(ctx, cam, wallSegments, smokeClouds, furnitureList = []) {
    if (cam.disabledTimer > 0) {
      // Disabled electric glitch state
      ctx.save();
      ctx.strokeStyle = "rgba(0, 240, 255, 0.75)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cam.x, cam.y, 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(0, 240, 255, 0.25)";
      ctx.fill();

      // Sparks
      for (let s = 0; s < 3; s++) {
        const a = Math.random() * Math.PI * 2;
        const d = 8 + Math.random() * 12;
        ctx.strokeStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.moveTo(cam.x, cam.y);
        ctx.lineTo(cam.x + Math.cos(a) * d, cam.y + Math.sin(a) * d);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    const furnitureSegments = getFurnitureOccluderSegments(furnitureList);
    const rays = buildVisibilityPolygon(
      cam.x,
      cam.y,
      cam.range,
      wallSegments,
      cam.currentAngle,
      cam.fov,
      smokeClouds,
      furnitureSegments
    );

    if (rays.length < 2) return;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cam.x, cam.y);
    for (let i = 0; i < rays.length; i++) {
      ctx.lineTo(rays[i].x, rays[i].y);
    }
    ctx.closePath();

    const isTripped = cam.alerted;
    const grad = ctx.createRadialGradient(
      cam.x, cam.y, 6,
      cam.x, cam.y, cam.range
    );

    if (isTripped) {
      grad.addColorStop(0, "rgba(255, 0, 60, 0.60)");
      grad.addColorStop(0.75, "rgba(255, 0, 60, 0.12)");
      grad.addColorStop(1, "rgba(255, 0, 60, 0)");
    } else {
      // Sweeping cyan surveillance beam
      grad.addColorStop(0, "rgba(0, 240, 255, 0.42)");
      grad.addColorStop(0.75, "rgba(0, 160, 255, 0.10)");
      grad.addColorStop(1, "rgba(0, 100, 255, 0)");
    }

    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = isTripped ? "rgba(255, 30, 60, 0.95)" : "rgba(0, 240, 255, 0.85)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Moving digital raster scanlines
    ctx.clip();
    ctx.strokeStyle = isTripped ? "rgba(255, 60, 90, 0.24)" : "rgba(0, 255, 255, 0.20)";
    ctx.lineWidth = 1;
    for (let y = 0; y < this.height; y += 6) {
      const lineY = (y + this.scanlineOffset) % this.height;
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.lineTo(this.width, lineY);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Renders glowing coherent laser grid beam with floor bounce and emitter boxes.
   */
  renderLaserBeam(ctx, laser) {
    if (!laser.active || laser.disabledTimer > 0) return;

    ctx.save();

    // 1. Floor bounce ambient glow along beam axis
    ctx.strokeStyle = "rgba(255, 0, 60, 0.18)";
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(laser.x1, laser.y1);
    ctx.lineTo(laser.x2, laser.y2);
    ctx.stroke();

    // 2. Outer high-intensity bloom
    ctx.strokeStyle = "rgba(255, 0, 60, 0.45)";
    ctx.lineWidth = 7;
    ctx.stroke();

    // 3. Core coherent laser beam
    ctx.strokeStyle = "#FF003C";
    ctx.lineWidth = 3;
    ctx.stroke();

    // 4. Intense white center thread
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 5. Wall-mounted emitter casings
    this.renderLaserEmitterNode(ctx, laser.x1, laser.y1);
    this.renderLaserEmitterNode(ctx, laser.x2, laser.y2);

    ctx.restore();
  }

  renderLaserEmitterNode(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(x - 4, y - 4, 8, 8);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 4, y - 4, 8, 8);

    ctx.fillStyle = "#FF003C";
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Renders directional bootstep trails.
   */
  renderFootsteps(ctx, footsteps) {
    if (!footsteps || footsteps.length === 0) return;
    ctx.save();
    for (let step of footsteps) {
      if (step.alpha <= 0) continue;
      ctx.save();
      ctx.translate(step.x, step.y);
      ctx.rotate(step.facing);

      // Dual boot tread marks
      ctx.fillStyle = `rgba(0, 240, 255, ${step.alpha * 0.35})`;
      ctx.fillRect(-3.5, -4.5, 3, 7.5);
      ctx.fillRect(0.5, -4.5, 3, 7.5);

      ctx.restore();
    }
    ctx.restore();
  }
}
