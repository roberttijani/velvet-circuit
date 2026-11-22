/**
 * debrief.js - Tactical Mission Debrief & Contract Progression Scorecard (v5)
 * Renders the studio-grade glassmorphism post-mission debrief screen:
 * - Handcrafted vector S-Rank Operative Crest
 * - Total haul valuation ($287,500,000) & stealth analytics
 * - 3 Progressive contract cards with completion badges and target icons
 * - Supports split-screen presentation (left 52% live extraction, right 48% scorecard)
 */

export class MissionDebriefModal {
  constructor(width = 1280, height = 480) {
    this.width = width;
    this.height = height;
    this.splitScreen = true;
  }

  /**
   * Split-Screen Layout: Displays live extraction gameplay on left 52%
   * and high-density glassmorphism debrief scorecard on right 48%.
   */
  renderSplit(ctx, level, thief, time = 0) {
    ctx.save();

    // 1. Live Feed Watermark Badge on left gameplay viewport
    ctx.fillStyle = "rgba(7, 12, 22, 0.88)";
    ctx.fillRect(16, 12, 290, 20);
    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 12, 290, 20);

    ctx.fillStyle = "#10B981";
    ctx.beginPath();
    ctx.arc(26, 22, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "bold 8.5px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("TACTICAL SATELLITE FEED // LIVE EXFIL ZONE", 36, 25.5);

    // 2. Right Dossier Chassis (x: 675, y: 12, w: 590, h: 456)
    const cx = 675;
    const cy = 12;
    const cw = 590;
    const ch = 456;

    // Outer glow & dark glass chassis
    ctx.fillStyle = "rgba(9, 16, 28, 0.96)";
    ctx.fillRect(cx, cy, cw, ch);
    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx, cy, cw, ch);

    // Inner gold bevel
    ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx + 4, cy + 4, cw - 8, ch - 8);

    // 3. Header Section
    ctx.font = "bold 13.5px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#00F0FF";
    ctx.fillText("HEIST ACCOMPLISHED // MISSION DEBRIEF", cx + 18, cy + 28);

    ctx.font = "8.5px system-ui, sans-serif";
    ctx.fillStyle = "#94A3B8";
    ctx.fillText("SYNDICATE RECOVERY OPERATION // ALL TARGET OBJECTIVES EXTRACTED", cx + 18, cy + 42);

    // S-Rank Badge (Top-Right of dossier)
    this.renderRankBadge(ctx, cx + cw - 165, cy + 12, 148, 36);

    // Header Divider
    ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx + 18, cy + 54);
    ctx.lineTo(cx + cw - 18, cy + 54);
    ctx.stroke();

    // 4. Total Haul Valuation Banner Box
    const bx = cx + 18;
    const by = cy + 62;
    const bw = cw - 36;
    const bh = 44;

    ctx.fillStyle = "rgba(15, 23, 42, 0.90)";
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.font = "bold 8px system-ui, sans-serif";
    ctx.fillStyle = "#94A3B8";
    ctx.fillText("TOTAL HAUL VALUATION [ ALL FLOORS ]", bx + 14, by + 16);

    ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#F59E0B";
    ctx.fillText("$287,500,000", bx + 14, by + 36);

    // Stealth Rating Tag in Banner
    ctx.font = "bold 9px system-ui, sans-serif";
    ctx.fillStyle = "#10B981";
    ctx.fillText("[ GHOST OPERATIVE // 3.5x BONUS ]", bx + bw - 180, by + 26);

    // 5. Performance Metrics Grid (4 compact rows)
    const stats = [
      { label: "DETECTIONS LOGGED", val: "00 [GHOST RATING]", col: "#00F0FF" },
      { label: "ALARM LOCKDOWNS", val: "00 [CLEAN INFIL]", col: "#10B981" },
      { label: "GADGETS DEPLOYED", val: "03 [1 COIN, 1 EMP, 1 SMOKE]", col: "#38BDF8" },
      { label: "ELAPSED INFIL TIME", val: "02:41.8 [SPEED RECORD]", col: "#F8FAFC" }
    ];

    let sy = cy + 124;
    for (let s of stats) {
      ctx.font = "bold 9px system-ui, sans-serif";
      ctx.fillStyle = "#94A3B8";
      ctx.fillText(s.label, bx, sy);

      ctx.font = "bold 10px system-ui, monospace";
      ctx.fillStyle = s.col;
      ctx.fillText(s.val, bx + 175, sy);

      ctx.strokeStyle = "rgba(100, 116, 139, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx, sy + 7);
      ctx.lineTo(bx + bw, sy + 7);
      ctx.stroke();

      sy += 24;
    }

    // 6. Contract Progression Cards (3 stacked cards)
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

    let ry = cy + 228;
    const cardH = 58;
    for (let c of contracts) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
      ctx.fillRect(bx, ry, bw, cardH);
      ctx.strokeStyle = c.col;
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, ry, bw, cardH);

      // Card Header Tag
      ctx.font = "bold 8px system-ui, sans-serif";
      ctx.fillStyle = c.col;
      ctx.fillText(`[ CONTRACT ${c.num} // COMPLETED ${c.score} ]`, bx + 12, ry + 15);

      // Title
      ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(c.title, bx + 12, ry + 32);

      // Target
      ctx.font = "8.5px system-ui, sans-serif";
      ctx.fillStyle = "#94A3B8";
      ctx.fillText(`TARGET: ${c.target}`, bx + 12, ry + 47);

      // Icon
      this.renderMiniLootIcon(ctx, bx + bw - 28, ry + cardH * 0.5, c.lootType, c.col);

      ry += 66;
    }

    // 7. Footer Prompt
    ctx.font = "bold 9px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#00F0FF";
    ctx.fillText("PRESS [SPACE] TO REDEPLOY OPERATIVE  //  [R] REPLAY ARCHIVE", bx, cy + ch - 14);

    ctx.restore();
  }

  /**
   * Full-screen fallback modal.
   */
  render(ctx, time = 0) {
    ctx.save();

    // Semi-translucent dark cinematic backdrop
    ctx.fillStyle = "rgba(4, 7, 14, 0.85)";
    ctx.fillRect(0, 0, this.width, this.height);

    const cw = 920;
    const ch = 380;
    const cx = (this.width - cw) * 0.5;
    const cy = (this.height - ch) * 0.5;

    ctx.fillStyle = "rgba(9, 16, 28, 0.96)";
    ctx.fillRect(cx, cy, cw, ch);
    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx, cy, cw, ch);

    ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx + 4, cy + 4, cw - 8, ch - 8);

    ctx.font = "bold 15px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#00F0FF";
    ctx.fillText("MISSION DEBRIEF // HEIST ACCOMPLISHED", cx + 24, cy + 34);

    ctx.font = "9.5px system-ui, sans-serif";
    ctx.fillStyle = "#94A3B8";
    ctx.fillText("SYNDICATE RECOVERY OPERATION // ALL TARGET OBJECTIVES EXTRACTED", cx + 24, cy + 50);

    this.renderRankBadge(ctx, cx + cw - 195, cy + 18, 175, 42);

    ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx + 24, cy + 68);
    ctx.lineTo(cx + cw - 24, cy + 68);
    ctx.stroke();

    const lx = cx + 24;
    const stats = [
      { label: "TOTAL HAUL VALUATION", val: "$287,500,000", col: "#F59E0B", bold: true },
      { label: "DETECTIONS LOGGED", val: "00 [GHOST RATING]", col: "#00F0FF" },
      { label: "ALARM LOCKDOWNS", val: "00 [CLEAN INFIL]", col: "#10B981" },
      { label: "GADGETS DEPLOYED", val: "03 [1 COIN, 1 EMP, 1 SMOKE]", col: "#38BDF8" },
      { label: "ELAPSED INFIL TIME", val: "02:41.8 [SPEED RECORD]", col: "#F8FAFC" },
      { label: "STEALTH MULTIPLIER", val: "3.5x [MAXIMUM BONUS]", col: "#D4AF37" }
    ];

    let sy = cy + 104;
    for (let s of stats) {
      ctx.font = "bold 10px system-ui, sans-serif";
      ctx.fillStyle = "#94A3B8";
      ctx.fillText(s.label, lx, sy);

      ctx.font = s.bold ? "bold 14px system-ui, sans-serif" : "bold 11px system-ui, monospace";
      ctx.fillStyle = s.col;
      ctx.fillText(s.val, lx + 195, sy);

      ctx.strokeStyle = "rgba(100, 116, 139, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(lx, sy + 14);
      ctx.lineTo(lx + 420, sy + 14);
      ctx.stroke();

      sy += 38;
    }

    const rx = cx + 475;
    const rw = 420;
    const rh = 68;

    const contracts = [
      { num: "01", title: "THE LUMINARY GALLERY", target: "STAR OF ALEXANDRIA", lootType: "diamond", score: "100%", col: "#00F0FF" },
      { num: "02", title: "THE OBSIDIAN MAINFRAME", target: "QUANTUM CRYPTO CIPHER", lootType: "cube", score: "100%", col: "#38BDF8" },
      { num: "03", title: "THE SOVEREIGN SANCTUM", target: "TITANIUM MASTER SAFE", lootType: "vault", score: "100%", col: "#F59E0B" }
    ];

    let ry = cy + 86;
    for (let c of contracts) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeStyle = c.col;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(rx, ry, rw, rh);

      ctx.font = "bold 8.5px system-ui, sans-serif";
      ctx.fillStyle = c.col;
      ctx.fillText(`[ CONTRACT ${c.num} // COMPLETED ${c.score} ]`, rx + 14, ry + 18);

      ctx.font = "bold 11.5px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(c.title, rx + 14, ry + 36);

      ctx.font = "9px system-ui, sans-serif";
      ctx.fillStyle = "#94A3B8";
      ctx.fillText(`TARGET: ${c.target}`, rx + 14, ry + 52);

      this.renderMiniLootIcon(ctx, rx + rw - 36, ry + rh * 0.5, c.lootType, c.col);

      ry += 80;
    }

    ctx.font = "bold 9.5px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#00F0FF";
    ctx.fillText("PRESS [SPACE] TO REDEPLOY OPERATIVE  //  PRESS [R] TO REPLAY MISSION ARCHIVE", cx + 24, cy + ch - 18);

    ctx.restore();
  }

  /**
   * Renders glowing S-Rank Operative Crest badge.
   */
  renderRankBadge(ctx, x, y, w, h) {
    ctx.save();
    ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x, y, w, h);

    // Vector Diamond Emblem
    const ex = x + 18;
    const ey = y + h * 0.5;
    ctx.fillStyle = "#10B981";
    ctx.beginPath();
    ctx.moveTo(ex, ey - 7);
    ctx.lineTo(ex + 6, ey);
    ctx.lineTo(ex, ey + 7);
    ctx.lineTo(ex - 6, ey);
    ctx.closePath();
    ctx.fill();

    ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("RANK: S", x + 32, y + 16);

    ctx.font = "bold 7.5px system-ui, sans-serif";
    ctx.fillStyle = "#10B981";
    ctx.fillText("[GHOST OPERATIVE]", x + 32, y + 27);

    ctx.restore();
  }

  renderMiniLootIcon(ctx, x, y, type, col) {
    ctx.save();
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5;

    if (type === "diamond") {
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.moveTo(x, y - 8);
      ctx.lineTo(x + 8, y);
      ctx.lineTo(x, y + 8);
      ctx.lineTo(x - 8, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (type === "cube") {
      ctx.strokeRect(x - 7, y - 7, 14, 14);
      ctx.strokeRect(x - 4, y - 4, 8, 8);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeRect(x - 4, y - 4, 8, 8);
    }

    ctx.restore();
  }
}
