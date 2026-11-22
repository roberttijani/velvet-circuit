/**
 * hackRing.js - Diegetic Circular Hack & Vault Lockpicking Minigame Ring (v5)
 * Renders an interactive tactical circular dial around active terminals and vaults:
 * - Sweeping lockpick indicator needle
 * - Glowing timing sweet-spot arc [ CRACK ZONE ]
 * - Live radial progress gauge with percentage readout
 */

export class HackMinigameRing {
  constructor() {
    this.needleAngle = 0;
  }

  update(dt) {
    this.needleAngle = (this.needleAngle + dt * 3.8) % (Math.PI * 2);
  }

  render(ctx, x, y, progress = 0.65, label = "BYPASS CIPHER") {
    ctx.save();
    ctx.translate(x, y);

    const radius = 34;

    // 1. Dark Glass Background Disc
    ctx.fillStyle = "rgba(10, 16, 26, 0.88)";
    ctx.beginPath();
    ctx.arc(0, 0, radius + 8, 0, Math.PI * 2);
    ctx.fill();

    // 2. Outer Dial Track with Tick Marks
    ctx.strokeStyle = "rgba(0, 240, 255, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Ticks around dial
    ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
    ctx.lineWidth = 1;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const x1 = Math.cos(a) * (radius - 4);
      const y1 = Math.sin(a) * (radius - 4);
      const x2 = Math.cos(a) * radius;
      const y2 = Math.sin(a) * radius;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // 3. Glowing Sweet-Spot Arc [ CRACK ZONE ]
    const sweetStart = -Math.PI * 0.25;
    const sweetEnd = Math.PI * 0.15;
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, radius, sweetStart, sweetEnd);
    ctx.stroke();

    // Sweet Spot Bracket Accents
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 6.5px system-ui, sans-serif";
    ctx.fillText("[ CRACK ZONE ]", 8, -radius - 4);

    // 4. Radial Hacking Progress Fill
    const clampedProg = Math.max(0, Math.min(1, progress));
    const startAngle = -Math.PI * 0.5;
    const endAngle = startAngle + clampedProg * (Math.PI * 2);

    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius - 6, startAngle, endAngle);
    ctx.stroke();

    // 5. Rotating Sweeper Needle
    const needleLen = radius + 2;
    const nx = Math.cos(this.needleAngle) * needleLen;
    const ny = Math.sin(this.needleAngle) * needleLen;

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    // Needle pivot glow diode
    ctx.fillStyle = "#00F0FF";
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Needle tip pip
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 6. Floating Status Pill Tag Below Dial
    const pct = Math.round(clampedProg * 100);
    const tagText = `[ ${label}: ${pct}% ]`;
    ctx.font = "bold 8.5px system-ui, -apple-system, sans-serif";
    const tw = ctx.measureText(tagText).width + 12;

    ctx.fillStyle = "rgba(7, 12, 22, 0.95)";
    ctx.fillRect(-tw * 0.5, radius + 10, tw, 14);
    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 1;
    ctx.strokeRect(-tw * 0.5, radius + 10, tw, 14);

    ctx.fillStyle = "#00F0FF";
    ctx.fillText(tagText, -tw * 0.5 + 6, radius + 20.5);

    ctx.restore();
  }
}
