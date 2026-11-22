/**
 * lighting.js - Dynamic 2D Lighting, Volumetric Cones, Scanlines & Shadow Engine (v2)
 * Features dynamic obstacle occlusion from pillars and server racks, volumetric gradients,
 * moving digital scanlines, and coherent pulsing laser beams.
 */

import { buildVisibilityPolygon, getFurnitureOccluderSegments } from '../world/raycast.js';

export class LightingEngine {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.scanlineOffset = 0;
  }

  update(dt) {
    this.scanlineOffset = (this.scanlineOffset + dt * 45) % 12;
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
    let innerColor, outerColor, edgeColor;
    if (guard.state === "ALERT") {
      innerColor = "rgba(255, 30, 60, 0.48)";
      outerColor = "rgba(255, 0, 30, 0.05)";
      edgeColor = "rgba(255, 60, 80, 0.90)";
    } else if (guard.state === "INVESTIGATING" || guard.state === "SUSPICIOUS") {
      innerColor = "rgba(255, 180, 0, 0.42)";
      outerColor = "rgba(255, 120, 0, 0.04)";
      edgeColor = "rgba(255, 200, 40, 0.85)";
    } else {
      // Normal patrol: volumetric tactical amber/yellow-white
      innerColor = "rgba(255, 225, 150, 0.32)";
      outerColor = "rgba(255, 200, 100, 0.03)";
      edgeColor = "rgba(255, 220, 130, 0.65)";
    }

    const grad = ctx.createRadialGradient(
      guard.x, guard.y, 8,
      guard.x, guard.y, guard.viewDist
    );
    grad.addColorStop(0, innerColor);
    grad.addColorStop(0.7, outerColor);
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.fill();

    // Perimeter edge highlight
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = 1.2;
    ctx.stroke();

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
      grad.addColorStop(0, "rgba(255, 0, 60, 0.55)");
      grad.addColorStop(0.75, "rgba(255, 0, 60, 0.10)");
      grad.addColorStop(1, "rgba(255, 0, 60, 0)");
    } else {
      // Sweeping cyan surveillance beam
      grad.addColorStop(0, "rgba(0, 240, 255, 0.38)");
      grad.addColorStop(0.75, "rgba(0, 160, 255, 0.08)");
      grad.addColorStop(1, "rgba(0, 100, 255, 0)");
    }

    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = isTripped ? "rgba(255, 30, 60, 0.9)" : "rgba(0, 240, 255, 0.75)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Moving digital raster scanlines
    ctx.clip();
    ctx.strokeStyle = isTripped ? "rgba(255, 60, 90, 0.22)" : "rgba(0, 255, 255, 0.18)";
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
   * Renders glowing coherent laser grid beam with bloom and emitter nodes.
   */
  renderLaserBeam(ctx, laser) {
    if (!laser.active || laser.disabledTimer > 0) return;

    ctx.save();
    // Laser outer bloom
    ctx.strokeStyle = "rgba(255, 0, 60, 0.35)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(laser.x1, laser.y1);
    ctx.lineTo(laser.x2, laser.y2);
    ctx.stroke();

    // Core laser glow
    ctx.strokeStyle = "#FF003C";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Intense center core thread
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
      ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.85})`;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();

      if (r.radius > 16) {
        ctx.strokeStyle = `rgba(0, 240, 255, ${r.alpha * 0.45})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  /**
   * Renders footstep trails.
   */
  renderFootsteps(ctx, footsteps) {
    ctx.save();
    for (let step of footsteps) {
      if (step.alpha <= 0) continue;
      ctx.save();
      ctx.translate(step.x, step.y);
      ctx.rotate(step.facing);
      ctx.fillStyle = `rgba(0, 240, 255, ${step.alpha * 0.32})`;
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
        sc.x, sc.y, sc.radius * 0.15,
        sc.x, sc.y, sc.radius
      );
      grad.addColorStop(0, `rgba(190, 220, 240, ${sc.alpha * 0.75})`);
      grad.addColorStop(0.55, `rgba(120, 150, 185, ${sc.alpha * 0.50})`);
      grad.addColorStop(1, "rgba(60, 90, 120, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sc.x, sc.y, sc.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
