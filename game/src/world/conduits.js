/**
 * conduits.js - Pulsing Security Circuit & Power Conduit System (v5)
 * Draws illuminated dashed power lines along the floor visually connecting
 * hack terminals directly to the lasers, gates, and cameras they control.
 */

export class PowerConduitSystem {
  constructor() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
  }

  render(ctx, level) {
    if (!level || !level.powerConduits) return;
    ctx.save();

    for (let c of level.powerConduits) {
      if (!c.points || c.points.length < 2) continue;

      const isHacked = c.isHacked || false;
      const baseCol = isHacked ? "#10B981" : (c.color || "#00F0FF");
      const glowCol = isHacked ? "rgba(16, 185, 129, 0.25)" : (c.glowColor || "rgba(0, 240, 255, 0.25)");

      // 1. Floor Glow Underlayer
      ctx.strokeStyle = glowCol;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(c.points[0].x, c.points[0].y);
      for (let i = 1; i < c.points.length; i++) {
        ctx.lineTo(c.points[i].x, c.points[i].y);
      }
      ctx.stroke();

      // 2. Pulsing Dashed Power Line
      ctx.strokeStyle = baseCol;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([6, 6]);
      ctx.lineDashOffset = -(this.time * 28) % 12;

      ctx.beginPath();
      ctx.moveTo(c.points[0].x, c.points[0].y);
      for (let i = 1; i < c.points.length; i++) {
        ctx.lineTo(c.points[i].x, c.points[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Terminal Junction Node Diode
      const pStart = c.points[0];
      ctx.fillStyle = baseCol;
      ctx.beginPath();
      ctx.arc(pStart.x, pStart.y, 3, 0, Math.PI * 2);
      ctx.fill();

      // 4. Barrier Destination Node Diode
      const pEnd = c.points[c.points.length - 1];
      ctx.fillStyle = baseCol;
      ctx.beginPath();
      ctx.arc(pEnd.x, pEnd.y, 3, 0, Math.PI * 2);
      ctx.fill();

      // 5. Midpoint Flow Diode Label
      if (c.label && c.points.length >= 2) {
        const midIdx = Math.floor(c.points.length / 2);
        const mx = (c.points[midIdx - 1].x + c.points[midIdx].x) * 0.5;
        const my = (c.points[midIdx - 1].y + c.points[midIdx].y) * 0.5;

        ctx.font = "bold 6.5px system-ui, sans-serif";
        const lw = ctx.measureText(c.label).width + 8;
        ctx.fillStyle = "rgba(7, 12, 22, 0.92)";
        ctx.fillRect(mx - lw * 0.5, my - 6, lw, 11);
        ctx.strokeStyle = baseCol;
        ctx.lineWidth = 0.8;
        ctx.strokeRect(mx - lw * 0.5, my - 6, lw, 11);

        ctx.fillStyle = baseCol;
        ctx.fillText(c.label, mx - lw * 0.5 + 4, my + 2.5);
      }
    }

    ctx.restore();
  }
}
