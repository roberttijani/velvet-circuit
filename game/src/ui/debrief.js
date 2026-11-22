/**
 * debrief.js - Tactical Mission Debrief & Contract Progression Scorecard (v4)
 * Renders the studio-grade glassmorphism post-mission debrief screen:
 * - Handcrafted vector S-Rank Operative Crest
 * - Heist target valuation ($62,500,000) & stealth analytics
 * - 3 Progressive contract cards with completion badges and target icons
 */

export class MissionDebriefModal {
  constructor(width = 1280, height = 480) {
    this.width = width;
    this.height = height;
  }

  render(ctx, time = 0) {
    ctx.save();

    // 1. Semi-translucent dark cinematic backdrop
    ctx.fillStyle = "rgba(4, 7, 14, 0.82)";
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Centered Glassmorphism Dossier Chassis
    const cw = 920;
    const ch = 380;
    const cx = (this.width - cw) * 0.5;
    const cy = (this.height - ch) * 0.5;

    // Outer glow & chassis
    ctx.fillStyle = "rgba(9, 16, 28, 0.96)";
    ctx.fillRect(cx, cy, cw, ch);
    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx, cy, cw, ch);

    // Inner gold architectural bevel
    ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx + 4, cy + 4, cw - 8, ch - 8);

    // 3. Header Section
    ctx.font = "bold 15px 'Courier New', monospace";
    ctx.fillStyle = "#00F0FF";
    ctx.fillText("MISSION DEBRIEF // HEIST ACCOMPLISHED", cx + 24, cy + 34);

    ctx.font = "9.5px 'Courier New', monospace";
    ctx.fillStyle = "#94A3B8";
    ctx.fillText("SYNDICATE RECOVERY OPERATION // ALL TARGET OBJECTIVES EXTRACTED", cx + 24, cy + 50);

    // 4. Handcrafted Vector S-Rank Crest (Top-Right)
    this.renderRankBadge(ctx, cx + cw - 195, cy + 18, 175, 42);

    // Section Divider
    ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx + 24, cy + 68);
    ctx.lineTo(cx + cw - 24, cy + 68);
    ctx.stroke();

    // 5. Left Column: Heist Analytics & Performance Metrics
    const lx = cx + 24;
    const stats = [
      { label: "TARGET VALUATION", val: "$62,500,000", col: "#F59E0B", bold: true },
      { label: "DETECTIONS LOGGED", val: "00 [GHOST RATING]", col: "#00F0FF" },
      { label: "ALARM LOCKDOWNS", val: "00 [CLEAN INFIL]", col: "#10B981" },
      { label: "GADGETS DEPLOYED", val: "03 [1 COIN, 1 EMP, 1 SMOKE]", col: "#38BDF8" },
      { label: "ELAPSED INFIL TIME", val: "02:41.8 [SPEED RECORD]", col: "#F8FAFC" },
      { label: "STEALTH MULTIPLIER", val: "3.5x [MAXIMUM BONUS]", col: "#D4AF37" }
    ];

    let sy = cy + 104;
    for (let s of stats) {
      ctx.font = "bold 10px 'Courier New', monospace";
      ctx.fillStyle = "#94A3B8";
      ctx.fillText(s.label, lx, sy);

      ctx.font = s.bold ? "bold 14px 'Courier New', monospace" : "bold 11px 'Courier New', monospace";
      ctx.fillStyle = s.col;
      ctx.fillText(s.val, lx + 195, sy);

      // Subtle row underline
      ctx.strokeStyle = "rgba(100, 116, 139, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(lx, sy + 14);
      ctx.lineTo(lx + 420, sy + 14);
      ctx.stroke();

      sy += 38;
    }

    // 6. Right Column: 3 Progressive Contract Progression Cards
    const rx = cx + 475;
    const rw = 420;
    const rh = 68;

    const contracts = [
      {
        num: "01",
        title: "THE LUMINARY GALLERY",
        target: "STAR OF ALEXANDRIA",
        lootType: "diamond",
        score: "100%",
        col: "#00F0FF"
      },
      {
        num: "02",
        title: "THE OBSIDIAN MAINFRAME",
        target: "QUANTUM CRYPTO CIPHER",
        lootType: "cube",
        score: "100%",
        col: "#38BDF8"
      },
      {
        num: "03",
        title: "THE SOVEREIGN SANCTUM",
        target: "TITANIUM MASTER SAFE",
        lootType: "vault",
        score: "100%",
        col: "#F59E0B"
      }
    ];

    let ry = cy + 86;
    for (let c of contracts) {
      // Contract card background
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeStyle = c.col;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(rx, ry, rw, rh);

      // Status pill
      ctx.font = "bold 8.5px 'Courier New', monospace";
      ctx.fillStyle = c.col;
      ctx.fillText(`[ CONTRACT ${c.num} // COMPLETED ${c.score} ]`, rx + 14, ry + 18);

      // Title
      ctx.font = "bold 11.5px 'Courier New', monospace";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(c.title, rx + 14, ry + 36);

      // Target
      ctx.font = "9px 'Courier New', monospace";
      ctx.fillStyle = "#94A3B8";
      ctx.fillText(`TARGET: ${c.target}`, rx + 14, ry + 52);

      // Mini Vector Target Icon
      this.renderMiniLootIcon(ctx, rx + rw - 36, ry + rh * 0.5, c.lootType, c.col);

      ry += 80;
    }

    // 7. Footer Action Prompt
    ctx.font = "bold 9.5px 'Courier New', monospace";
    ctx.fillStyle = "#00F0FF";
    ctx.fillText("PRESS [SPACE] TO REDEPLOY OPERATIVE  //  PRESS [R] TO REPLAY MISSION ARCHIVE", cx + 24, cy + ch - 18);

    ctx.restore();
  }

  /**
   * Renders the glowing S-Rank Operative Crest badge.
   */
  renderRankBadge(ctx, x, y, w, h) {
    ctx.save();

    // Box
    ctx.fillStyle = "rgba(6, 78, 59, 0.35)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);

    // Inner gold trim
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 0.8;
    ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);

    // Vector Diamond Star Embellishment
    ctx.fillStyle = "#10B981";
    ctx.beginPath();
    ctx.moveTo(x + 18, y + 14);
    ctx.lineTo(x + 24, y + 21);
    ctx.lineTo(x + 18, y + 28);
    ctx.lineTo(x + 12, y + 21);
    ctx.closePath();
    ctx.fill();

    // Text
    ctx.font = "bold 13px 'Courier New', monospace";
    ctx.fillStyle = "#10B981";
    ctx.fillText("RANK: S", x + 34, y + 20);

    ctx.font = "bold 8.5px 'Courier New', monospace";
    ctx.fillStyle = "#D4AF37";
    ctx.fillText("[GHOST OPERATIVE]", x + 34, y + 33);

    ctx.restore();
  }

  /**
   * Renders small vector artifact icons on contract cards.
   */
  renderMiniLootIcon(ctx, x, y, type, color) {
    ctx.save();
    ctx.translate(x, y);

    if (type === "diamond") {
      ctx.fillStyle = "#E0F7FA";
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -9);
      ctx.lineTo(9, 0);
      ctx.lineTo(0, 9);
      ctx.lineTo(-9, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (type === "cube") {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-8, -8, 16, 16);
      ctx.strokeRect(-5, -5, 10, 10);
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeRect(-3, -3, 6, 6);
    }

    ctx.restore();
  }
}
