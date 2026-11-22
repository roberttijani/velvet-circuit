/**
 * camera.js - Cinematic Tactical Follow-Camera (v5)
 * Smoothly tracks the thief operative at 1.65x zoom scale,
 * framing intimate, high-intensity heist action while keeping
 * the entire level layout visible via the Tactical Minimap.
 */

export class TacticalCamera {
  constructor(viewportW = 1280, viewportH = 480) {
    this.viewportW = viewportW;
    this.viewportH = viewportH;
    this.zoom = 1.65;
    this.targetX = 640;
    this.targetY = 240;
    this.currentX = 640;
    this.currentY = 240;
    this.x = 0;
    this.y = 0;
    this.enabled = true;
  }

  setZoom(zoom) {
    this.zoom = zoom;
  }

  setFocus(x, y, instant = true) {
    this.targetX = x;
    this.targetY = y;
    if (instant) {
      this.currentX = x;
      this.currentY = y;
    }
  }

  update(targetX, targetY, dt = 0.016, mapBounds = { minX: 40, maxX: 1240, minY: 44, maxY: 448 }) {
    if (!this.enabled) {
      this.zoom = 1.0;
      this.x = 0;
      this.y = 0;
      return;
    }

    if (targetX !== undefined && targetY !== undefined) {
      this.targetX = targetX;
      this.targetY = targetY;
    }

    // Smooth exponential decay follow
    const lerpSpeed = 8.0;
    const factor = 1 - Math.exp(-lerpSpeed * dt);
    this.currentX += (this.targetX - this.currentX) * factor;
    this.currentY += (this.targetY - this.currentY) * factor;

    // Viewport extent in world units
    const halfViewW = (this.viewportW * 0.5) / this.zoom;
    const halfViewH = (this.viewportH * 0.5) / this.zoom;

    // Clamping center to ensure camera never pans outside level walls
    const minCenterW = mapBounds.minX + halfViewW;
    const maxCenterW = mapBounds.maxX - halfViewW;
    const minCenterH = mapBounds.minY + halfViewH;
    const maxCenterH = mapBounds.maxY - halfViewH;

    const clampedX = maxCenterW > minCenterW 
      ? Math.max(minCenterW, Math.min(maxCenterW, this.currentX))
      : (mapBounds.minX + mapBounds.maxX) * 0.5;

    const clampedY = maxCenterH > minCenterH
      ? Math.max(minCenterH, Math.min(maxCenterH, this.currentY))
      : (mapBounds.minY + mapBounds.maxY) * 0.5;

    // Translation matrix offsets for ctx.translate(this.x, this.y); ctx.scale(this.zoom, this.zoom);
    this.x = this.viewportW * 0.5 - clampedX * this.zoom;
    this.y = this.viewportH * 0.5 - clampedY * this.zoom;
  }

  screenToWorld(screenX, screenY) {
    return {
      x: (screenX - this.x) / this.zoom,
      y: (screenY - this.y) / this.zoom
    };
  }

  worldToScreen(worldX, worldY) {
    return {
      x: worldX * this.zoom + this.x,
      y: worldY * this.zoom + this.y
    };
  }

  apply(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.zoom, this.zoom);
  }

  applySplit(ctx, splitW = 665) {
    ctx.save();
    const halfViewW = (splitW * 0.5) / this.zoom;
    const halfViewH = (this.viewportH * 0.5) / this.zoom;
    const clampedX = Math.max(40 + halfViewW, Math.min(1240 - halfViewW, this.currentX));
    const clampedY = Math.max(44 + halfViewH, Math.min(448 - halfViewH, this.currentY));
    const tx = splitW * 0.5 - clampedX * this.zoom;
    const ty = this.viewportH * 0.5 - clampedY * this.zoom;
    ctx.translate(tx, ty);
    ctx.scale(this.zoom, this.zoom);
  }

  restore(ctx) {
    ctx.restore();
  }
}
