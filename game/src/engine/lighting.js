/**
 * lighting.js - Dynamic 2D Lighting, Volumetric Cones, Scanlines & Shadow Engine
 * Implements high-contrast Tactical Noir Blueprint visual aesthetics.
 */

import { buildVisibilityPolygon } from '../world/raycast.js';

export class LightingEngine {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    // Offscreen canvas for lighting mask
    this.lightCanvas = document.createElement('canvas');
    this.lightCanvas.width = width;
    this.lightCanvas.height = height;
    this.lightCtx = this.lightCanvas.getContext('2d');
    this.scanlineOffset = 0;
  }

  update(dt) {
    this.scanlineOffset = (this.scanlineOffset + dt * 45) % 12;
  }

  /**
   * Renders the volumetric vision cone for a guard using raycast polygon.
   */
  renderGuardCone(ctx, guard, wallSegments, smokeClouds) {
    const rays = buildVisibilityPolygon(
      guard.x,
      guard.y,
      guard.viewDist,
      wallSegments,
      guard.facing,
      guard.fov,
      smokeClouds
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
    let innerColor, outerColor, edgeColor;
    if (guard.state === "ALERT") {
      innerColor = "rgba(255, 30, 60, 0.50)";
      outerColor = "rgba(255, 0, 30, 0.05)";
      edgeColor = "rgba(255, 50, 70, 0.85)";
    } else if (guard.state === "INVESTIGATING" || guard.state === "SUSPICIOUS") {
      innerColor = "rgba(255, 180, 0, 0.40)";
      outerColor = "rgba(255, 120, 0, 0.04)";
      edgeColor = "rgba(255, 200, 40, 0.80)";
    } else {
      // Normal patrol
      innerColor = "rgba(180, 230, 255, 0.28)";
      outerColor = "rgba(0, 140, 255, 0.02)";
      edgeColor = "rgba(100, 200, 255, 0.60)";
    }

    const grad = ctx.createRadialGradient(
      guard.x, guard.y, 10,
      guard.x, guard.y, guard.viewDist
    );
    grad.addColorStop(0, innerColor);
    grad.addColorStop(0.7, outerColor);
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.fill();

    // Outer perimeter edge glow
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Renders sweeping security camera cone with volumetric beam and moving digital scanlines.
   */
  renderCameraCone(ctx, cam, wallSegments, smokeClouds) {
    if (cam.disabledTimer > 0) {
      // Render disabled flickering electric spark
      ctx.save();
      ctx.strokeStyle = "rgba(0, 240, 255, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cam.x, cam.y, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(0, 240, 255, 0.3)";
      ctx.fill();
      ctx.restore();
      return;
    }

    const rays = buildVisibilityPolygon(
      cam.x,
      cam.y,
      cam.range,
      wallSegments,
      cam.currentAngle,
      cam.fov,
      smokeClouds
    );

    if (rays.length < 2) return;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cam.x, cam.y);
    for (let i = 0; i < rays.length; i++) {
      ctx.lineTo(rays[i].x, rays[i].y);
    }
    ctx.closePath();

    // Camera volumetric gradient
    const grad = ctx.createRadialGradient(
      cam.x, cam.y, 5,
      cam.x, cam.y, cam.range
    );
    const isTripped = cam.alerted;
    if (isTripped) {
      grad.addColorStop(0, "rgba(255, 0, 60, 0.55)");
      grad.addColorStop(0.8, "rgba(255, 0, 60, 0.12)");
      grad.addColorStop(1, "rgba(255, 0, 60, 0)");
    } else {
      grad.addColorStop(0, "rgba(0, 240, 255, 0.35)");
      grad.addColorStop(0.8, "rgba(0, 160, 255, 0.08)");
      grad.addColorStop(1, "rgba(0, 100, 255, 0)");
    }

    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = isTripped ? "rgba(255, 30, 60, 0.9)" : "rgba(0, 240, 255, 0.75)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Moving digital scanlines inside the clipped polygon
    ctx.clip();
    ctx.strokeStyle = isTripped ? "rgba(255, 50, 80, 0.22)" : "rgba(0, 255, 255, 0.18)";
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
   * Renders glowing laser grid barrier with bloom and ambient particle reflections.
   */
  renderLaserBeam(ctx, laser) {
    if (!laser.active || laser.disabledTimer > 0) return;

    ctx.save();
    // Laser outer glow
    ctx.strokeStyle = "rgba(255, 0, 60, 0.35)";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(laser.x1, laser.y1);
    ctx.lineTo(laser.x2, laser.y2);
    ctx.stroke();

    // Laser core beam
    ctx.strokeStyle = "#FF3366";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Laser intense center white thread
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Emitter node caps
    ctx.fillStyle = "#FF003C";
    ctx.beginPath();
    ctx.arc(laser.x1, laser.y1, 4, 0, Math.PI * 2);
    ctx.arc(laser.x2, laser.y2, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Renders expanding sound-wave ripples.
   */
  renderSoundRipples(ctx, ripples) {
    ctx.save();
    for (let r of ripples) {
      if (!r.active || r.alpha <= 0) continue;
      ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.75})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Second outer faint ring
      if (r.radius > 15) {
        ctx.strokeStyle = `rgba(0, 240, 255, ${r.alpha * 0.4})`;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  /**
   * Renders thief footstep ghosting trails.
   */
  renderFootsteps(ctx, footsteps) {
    ctx.save();
    for (let step of footsteps) {
      if (step.alpha <= 0) continue;
      ctx.save();
      ctx.translate(step.x, step.y);
      ctx.rotate(step.facing);
      ctx.fillStyle = `rgba(0, 240, 255, ${step.alpha * 0.35})`;
      // Dual boot-tread prints
      ctx.fillRect(-3, -4, 3, 7);
      ctx.fillRect(1, -4, 3, 7);
      ctx.restore();
    }
    ctx.restore();
  }

  /**
   * Renders dense volumetric smoke screen clouds.
   */
  renderSmokeClouds(ctx, smokeClouds) {
    ctx.save();
    for (let sc of smokeClouds) {
      if (!sc.active || sc.alpha <= 0) continue;
      const grad = ctx.createRadialGradient(
        sc.x, sc.y, sc.radius * 0.2,
        sc.x, sc.y, sc.radius
      );
      grad.addColorStop(0, `rgba(180, 210, 230, ${sc.alpha * 0.75})`);
      grad.addColorStop(0.6, `rgba(120, 150, 180, ${sc.alpha * 0.5})`);
      grad.addColorStop(1, "rgba(80, 100, 130, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sc.x, sc.y, sc.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
