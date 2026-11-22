/**
 * minimap.js - Real-Time Tactical Blueprint Radar & Minimap (v4)
 * Renders a live vector minimap showing:
 * - Architectural room outlines & wall partitions
 * - Operative blip with active stealth stance pulse
 * - Sentry / guard blips with directional micro vision cones
 * - High-value loot target beacon
 * - Extraction zone marker
 * Integrated cleanly into the studio HUD with zero map occlusion.
 */

export class TacticalMinimap {
  constructor(x = 1148, y = 4, w = 118, h = 32) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  render(ctx, level, thief, guards = [], time = 0) {
    if (!level) return;
    ctx.save();

    // 1. Radar Glass Pod Chassis
    ctx.fillStyle = "rgba(10, 18, 30, 0.95)";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = "rgba(0, 240, 255, 0.55)";
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    // Header label
    ctx.font = "bold 6.5px 'Courier New', monospace";
    ctx.fillStyle = "#00F0FF";
    ctx.fillText("TACTICAL MAP", this.x + 4, this.y + 7.5);

    // Active sweep radar line
    const sweepX = this.x + 2 + ((time * 24) % (this.w - 4));
    ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sweepX, this.y + 9);
    ctx.lineTo(sweepX, this.y + this.h - 2);
    ctx.stroke();

    // 2. World-to-Minimap Scale Factors
    // World playable area is approx x: 40..1240 (1200px), y: 44..448 (404px)
    const mapAreaX = this.x + 3;
    const mapAreaY = this.y + 9;
    const mapAreaW = this.w - 6;
    const mapAreaH = this.h - 11;

    const scaleX = mapAreaW / 1200;
    const scaleY = mapAreaH / 404;

    const toMapX = (wx) => mapAreaX + Math.max(0, Math.min(mapAreaW, (wx - 40) * scaleX));
    const toMapY = (wy) => mapAreaY + Math.max(0, Math.min(mapAreaH, (wy - 44) * scaleY));

    // 3. Render Wall Segments
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let w of level.walls) {
      ctx.moveTo(toMapX(w.x1), toMapY(w.y1));
      ctx.lineTo(toMapX(w.x2), toMapY(w.y2));
    }
    ctx.stroke();

    // 4. Extraction Zone
    if (level.extraction) {
      const ex = toMapX(level.extraction.x);
      const ey = toMapY(level.extraction.y);
      const ew = Math.max(3, level.extraction.w * scaleX);
      const eh = Math.max(3, level.extraction.h * scaleY);
      ctx.fillStyle = thief.hasLoot ? "rgba(16, 185, 129, 0.6)" : "rgba(100, 116, 139, 0.4)";
      ctx.fillRect(ex, ey, ew, eh);
    }

    // 5. Loot Target Beacon
    if (level.loot && !thief.hasLoot) {
      const lx = toMapX(level.loot.x);
      const ly = toMapY(level.loot.y);
      const pulse = 0.6 + 0.4 * Math.sin(time * 6);
      ctx.fillStyle = `rgba(245, 158, 11, ${pulse})`;
      ctx.beginPath();
      ctx.arc(lx, ly, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Guards & Sentry Cones
    for (let g of guards) {
      const gx = toMapX(g.x);
      const gy = toMapY(g.y);

      // Micro vision cone
      const coneLen = 6;
      const coneA = g.facing || 0;
      const fov = 0.6;
      const coneCol = g.state === "ALERT" ? "rgba(239, 68, 68, 0.45)"
                    : g.state === "INVESTIGATING" ? "rgba(245, 158, 11, 0.45)"
                    : "rgba(245, 158, 11, 0.25)";

      ctx.fillStyle = coneCol;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + Math.cos(coneA - fov) * coneLen, gy + Math.sin(coneA - fov) * coneLen);
      ctx.lineTo(gx + Math.cos(coneA + fov) * coneLen, gy + Math.sin(coneA + fov) * coneLen);
      ctx.closePath();
      ctx.fill();

      // Guard blip
      ctx.fillStyle = g.state === "ALERT" ? "#EF4444" : "#F59E0B";
      ctx.beginPath();
      ctx.arc(gx, gy, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. Thief Operative Blip
    const tx = toMapX(thief.x);
    const ty = toMapY(thief.y);

    // Stealth pulse ring
    const tPulse = (time * 3) % 1;
    ctx.strokeStyle = `rgba(0, 240, 255, ${1 - tPulse})`;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.arc(tx, ty, 2 + tPulse * 3, 0, Math.PI * 2);
    ctx.stroke();

    // Thief core
    ctx.fillStyle = "#00F0FF";
    ctx.beginPath();
    ctx.arc(tx, ty, 1.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
