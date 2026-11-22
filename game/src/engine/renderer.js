/**
 * renderer.js - Tactical Noir Architectural Blueprint Renderer (v2)
 * Renders thick architectural walls, procedural floor materials, character silhouettes,
 * diegetic non-overlapping labels, and the tactical mission debrief scorecard.
 */

export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
  }

  /**
   * Clears the viewport and renders blueprint background grid.
   */
  clear() {
    const ctx = this.ctx;
    // Dark blueprint navy background
    ctx.fillStyle = "#070C16";
    ctx.fillRect(0, 0, this.width, this.height);

    // Minor blueprint grid (20px)
    ctx.strokeStyle = "rgba(18, 42, 74, 0.40)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let x = 0; x < this.width; x += 20) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for (let y = 0; y < this.height; y += 20) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();

    // Major blueprint grid (100px)
    ctx.strokeStyle = "rgba(28, 64, 112, 0.60)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < this.width; x += 100) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for (let y = 0; y < this.height; y += 100) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();
  }

  /**
   * Renders room floors, carpets, and non-overlapping blueprint room badges.
   */
  renderRooms(level) {
    const ctx = this.ctx;

    for (let room of level.rooms) {
      ctx.save();

      // Floor procedural pattern
      if (level.floorType === "gallery") {
        ctx.fillStyle = "#0A1424";
        ctx.fillRect(room.x, room.y, room.w, room.h);
        // Polished marble tiles
        ctx.strokeStyle = "rgba(22, 54, 90, 0.35)";
        ctx.lineWidth = 0.5;
        for (let tx = room.x; tx < room.x + room.w; tx += 28) {
          for (let ty = room.y; ty < room.y + room.h; ty += 28) {
            ctx.strokeRect(tx, ty, 28, 28);
          }
        }
      } else if (level.floorType === "server") {
        ctx.fillStyle = "#07111D";
        ctx.fillRect(room.x, room.y, room.w, room.h);
        // Industrial floor grate grid
        ctx.strokeStyle = "rgba(0, 180, 216, 0.12)";
        ctx.lineWidth = 1;
        ctx.strokeRect(room.x + 3, room.y + 3, room.w - 6, room.h - 6);
        for (let gx = room.x + 16; gx < room.x + room.w - 16; gx += 32) {
          ctx.beginPath();
          ctx.moveTo(gx, room.y + 4);
          ctx.lineTo(gx, room.y + room.h - 4);
          ctx.stroke();
        }
      } else {
        // Penthouse luxury parquet
        ctx.fillStyle = "#0E1726";
        ctx.fillRect(room.x, room.y, room.w, room.h);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.15)";
        ctx.lineWidth = 1;
        ctx.strokeRect(room.x + 4, room.y + 4, room.w - 8, room.h - 8);
      }

      // Render velvet carpet runners if present
      if (level.carpetRunners) {
        for (let c of level.carpetRunners) {
          ctx.fillStyle = c.color;
          ctx.fillRect(c.x, c.y, c.w, c.h);
          ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
          ctx.lineWidth = 1;
          ctx.strokeRect(c.x, c.y, c.w, c.h);
        }
      }

      // Render glowing conduits if present
      if (level.conduits) {
        for (let cd of level.conduits) {
          ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cd.x1, cd.y1);
          ctx.lineTo(cd.x2, cd.y2);
          ctx.stroke();
        }
      }

      // Compact Diegetic Room Title Badge (Anchored cleanly inside room, never overlapping furniture)
      const badgeText = `[ ${room.tag} // ${room.name} ]`;
      ctx.font = "bold 9px 'Courier New', monospace";
      const bw = ctx.measureText(badgeText).width + 10;
      ctx.fillStyle = "rgba(7, 12, 22, 0.85)";
      ctx.fillRect(room.x + 8, room.y + 8, bw, 14);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.strokeRect(room.x + 8, room.y + 8, bw, 14);

      ctx.fillStyle = "#00F0FF";
      ctx.fillText(badgeText, room.x + 13, room.y + 18);

      ctx.restore();
    }
  }

  /**
   * Renders thick filled architectural walls with slate core and glowing blueprint centerline.
   */
  renderWalls(walls) {
    const ctx = this.ctx;
    ctx.save();

    // 1. Soft Wall Floor Drop-Shadow
    ctx.strokeStyle = "rgba(0, 0, 0, 0.65)";
    ctx.lineWidth = 12;
    ctx.lineCap = "square";
    ctx.beginPath();
    for (let w of walls) {
      ctx.moveTo(w.x1 + 2, w.y1 + 2);
      ctx.lineTo(w.x2 + 2, w.y2 + 2);
    }
    ctx.stroke();

    // 2. Thick Dark Slate Architectural Wall Fill
    ctx.strokeStyle = "#0F172A";
    ctx.lineWidth = 10;
    ctx.beginPath();
    for (let w of walls) {
      ctx.moveTo(w.x1, w.y1);
      ctx.lineTo(w.x2, w.y2);
    }
    ctx.stroke();

    // 3. Inner Slate Bevel Edge
    ctx.strokeStyle = "#1E293B";
    ctx.lineWidth = 6;
    ctx.beginPath();
    for (let w of walls) {
      ctx.moveTo(w.x1, w.y1);
      ctx.lineTo(w.x2, w.y2);
    }
    ctx.stroke();

    // 4. Sharp Cyan Architectural Blueprint Centerline
    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let w of walls) {
      ctx.moveTo(w.x1, w.y1);
      ctx.lineTo(w.x2, w.y2);
    }
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Renders furniture, obstacles, and consoles with drop shadows and detail.
   */
  renderFurniture(furniture) {
    const ctx = this.ctx;
    ctx.save();

    for (let item of furniture) {
      // Furniture floor drop shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillRect(item.x + 2, item.y + 2, item.w, item.h);

      if (item.type === "vitrine") {
        ctx.fillStyle = "rgba(0, 240, 255, 0.10)";
        ctx.fillRect(item.x, item.y, item.w, item.h);
        ctx.strokeStyle = "#00F0FF";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(item.x, item.y, item.w, item.h);
        // Specular glare line
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(item.x + 6, item.y + item.h - 6);
        ctx.lineTo(item.x + item.w - 6, item.y + 6);
        ctx.stroke();
      } else if (item.type === "server") {
        ctx.fillStyle = "#0B1522";
        ctx.fillRect(item.x, item.y, item.w, item.h);
        ctx.strokeStyle = "#1D4ED8";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(item.x, item.y, item.w, item.h);
        // Animated status LEDs
        for (let lx = item.x + 8; lx < item.x + item.w - 8; lx += 12) {
          const blink = (Math.sin(this.time * 6 + lx) > 0.1);
          ctx.fillStyle = blink ? "#00F0FF" : "#005577";
          ctx.fillRect(lx, item.y + 6, 4, 3);
          ctx.fillStyle = blink ? "#10B981" : "#044E36";
          ctx.fillRect(lx, item.y + item.h - 9, 4, 3);
        }
      } else if (item.type === "column" || item.type === "plinth") {
        ctx.fillStyle = "#112238";
        ctx.fillRect(item.x, item.y, item.w, item.h);
        ctx.strokeStyle = "#38BDF8";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(item.x, item.y, item.w, item.h);
        ctx.fillStyle = "#1E3A8A";
        ctx.fillRect(item.x + 4, item.y + 4, item.w - 8, item.h - 8);
      } else if (item.type === "desk") {
        ctx.fillStyle = "#132337";
        ctx.fillRect(item.x, item.y, item.w, item.h);
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(item.x, item.y, item.w, item.h);
      }
    }

    ctx.restore();
  }

  /**
   * Renders the glowing loot target with compact non-overlapping callout pill.
   */
  renderLoot(loot, isSecured) {
    const ctx = this.ctx;
    ctx.save();

    const pulse = 0.85 + 0.15 * Math.sin(this.time * 4);

    if (isSecured) {
      ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(loot.x - 20, loot.y - 20, 40, 40);

      // Pill tag
      const pillText = "[ LOOT SECURED ]";
      ctx.font = "bold 8px 'Courier New', monospace";
      const pw = ctx.measureText(pillText).width + 20;
      const pillX = loot.x - pw * 0.5;
      ctx.fillStyle = "rgba(7, 12, 22, 0.9)";
      ctx.fillRect(pillX, loot.y + 24, pw, 15);
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 1;
      ctx.strokeRect(pillX, loot.y + 24, pw, 15);

      ctx.fillStyle = "#10B981";
      ctx.fillText(pillText, pillX + 10, loot.y + 35);
      ctx.restore();
      return;
    }

    // Pedestal base
    ctx.fillStyle = "#0A1828";
    ctx.fillRect(loot.x - 20, loot.y - 20, 40, 40);
    ctx.strokeStyle = loot.glowColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(loot.x - 20, loot.y - 20, 40, 40);

    // Glowing aura
    const grad = ctx.createRadialGradient(loot.x, loot.y, 4, loot.x, loot.y, loot.radius * pulse);
    grad.addColorStop(0, loot.glowColor);
    grad.addColorStop(0.5, "rgba(0, 240, 255, 0.35)");
    grad.addColorStop(1, "rgba(0, 240, 255, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(loot.x, loot.y, loot.radius * pulse, 0, Math.PI * 2);
    ctx.fill();

    if (loot.type === "diamond") {
      ctx.save();
      ctx.translate(loot.x, loot.y);
      ctx.fillStyle = "#E0F7FA";
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -13);
      ctx.lineTo(13, 0);
      ctx.lineTo(0, 13);
      ctx.lineTo(-13, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#00F0FF";
      ctx.beginPath();
      ctx.moveTo(-13, 0);
      ctx.lineTo(13, 0);
      ctx.moveTo(0, -13);
      ctx.lineTo(0, 13);
      ctx.stroke();
      ctx.restore();
    } else if (loot.type === "cube") {
      ctx.save();
      ctx.translate(loot.x, loot.y);
      ctx.rotate(this.time * 0.8);
      ctx.fillStyle = "rgba(0, 240, 255, 0.4)";
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(-11, -11, 22, 22);
      ctx.fillRect(-11, -11, 22, 22);
      ctx.rotate(Math.PI / 4);
      ctx.strokeStyle = "#FFFFFF";
      ctx.strokeRect(-7, -7, 14, 14);
      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(loot.x, loot.y);
      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.rotate(this.time * 0.5);
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(11, 0);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Dynamic loot badge pill cleanly below pedestal
    const pillText = `[E] SECURE ${loot.name}`;
    ctx.font = "bold 8px 'Courier New', monospace";
    const pw = ctx.measureText(pillText).width + 20;
    const pillX = loot.x - pw * 0.5;
    ctx.fillStyle = "rgba(7, 12, 22, 0.92)";
    ctx.fillRect(pillX, loot.y + 24, pw, 15);
    ctx.strokeStyle = loot.glowColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(pillX, loot.y + 24, pw, 15);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(pillText, pillX + 10, loot.y + 35);

    ctx.restore();
  }

  /**
   * Renders the extraction zone with safe margins.
   */
  renderExtraction(exfil, isUnlocked) {
    const ctx = this.ctx;
    ctx.save();

    const color = isUnlocked ? "#10B981" : "#64748B";
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash(isUnlocked ? [6, 4] : [3, 3]);
    ctx.strokeRect(exfil.x, exfil.y, exfil.w, exfil.h);

    ctx.fillStyle = isUnlocked ? "rgba(16, 185, 129, 0.16)" : "rgba(100, 116, 139, 0.06)";
    ctx.fillRect(exfil.x, exfil.y, exfil.w, exfil.h);

    // Centered status badge inside extraction bounds
    const tag = isUnlocked ? ">> EXFIL READY <<" : "[ LOCKED: GET LOOT ]";
    ctx.font = "bold 8px 'Courier New', monospace";
    const tw = ctx.measureText(tag).width;
    ctx.fillStyle = color;
    ctx.fillText(tag, exfil.x + (exfil.w - tw) * 0.5, exfil.y + exfil.h * 0.5 + 3);

    ctx.restore();
  }

  /**
   * Renders interactive hacking terminals with compact pill tags.
   */
  renderTerminals(terminals, thief) {
    const ctx = this.ctx;
    ctx.save();

    for (let term of terminals) {
      ctx.fillStyle = term.hacked ? "#064E3B" : "#1E293B";
      ctx.fillRect(term.x - 12, term.y - 12, 24, 24);
      ctx.strokeStyle = term.hacked ? "#10B981" : "#00F0FF";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(term.x - 12, term.y - 12, 24, 24);

      ctx.fillStyle = term.hacked ? "#10B981" : "#00F0FF";
      ctx.fillRect(term.x - 8, term.y - 8, 16, 16);

      // Dynamic Pill Tag cleanly below console
      const tagText = term.hacked ? "[ OVERRIDDEN ]" : `[E] ${term.label}`;
      ctx.font = "bold 8px 'Courier New', monospace";
      const pw = ctx.measureText(tagText).width + 18;
      const pillX = term.x - pw * 0.5;
      ctx.fillStyle = "rgba(7, 12, 22, 0.90)";
      ctx.fillRect(pillX, term.y + 16, pw, 14);
      ctx.strokeStyle = term.hacked ? "#10B981" : "#00F0FF";
      ctx.lineWidth = 1;
      ctx.strokeRect(pillX, term.y + 16, pw, 14);

      ctx.fillStyle = term.hacked ? "#10B981" : "#FFFFFF";
      ctx.fillText(tagText, pillX + 9, term.y + 26);

      const dist = Math.hypot(thief.x - term.x, thief.y - term.y);
      if (dist < 45 && !term.hacked) {
        ctx.strokeStyle = "rgba(0, 240, 255, 0.45)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(term.x, term.y, 36, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  /**
   * Renders the thief operative as a sleek top-down tactical silhouette.
   */
  renderThief(thief, mouseX, mouseY) {
    const ctx = this.ctx;
    ctx.save();

    // Aim laser line
    ctx.strokeStyle = "rgba(0, 240, 255, 0.28)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(thief.x, thief.y);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Stealth noise suppression ring when sneaking
    if (thief.isSneaking) {
      ctx.strokeStyle = "rgba(0, 240, 255, 0.16)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(thief.x, thief.y, 22, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.translate(thief.x, thief.y);
    ctx.rotate(thief.facing);

    // Drop shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.beginPath();
    ctx.ellipse(0, 2, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tactical Operative Shoulders (Athletic canted oval)
    ctx.fillStyle = "#0F1E33";
    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Tactical harness straps
    ctx.fillStyle = "#1E3A5F";
    ctx.fillRect(-3, -5, 6, 10);

    // Hooded head
    ctx.fillStyle = "#0A1322";
    ctx.beginPath();
    ctx.arc(2, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Twin glowing emerald night-vision visor optics
    ctx.fillStyle = "#00F0FF";
    ctx.shadowColor = "#00F0FF";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(6, -2.2, 1.6, 0, Math.PI * 2);
    ctx.arc(6, 2.2, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  /**
   * Renders wall-mounted security camera turret housings.
   */
  renderCameras(cameras) {
    const ctx = this.ctx;
    ctx.save();

    for (let cam of cameras) {
      ctx.save();
      ctx.translate(cam.x, cam.y);
      ctx.rotate(cam.currentAngle);

      // Camera base bracket
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(-6, -6, 12, 12);
      ctx.strokeStyle = cam.alerted ? "#FF003C" : "#00F0FF";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-6, -6, 12, 12);

      // Turret lens barrel
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(4, -3, 8, 6);

      // Blinking status diode
      const ledGlow = Math.sin(this.time * 8) > 0;
      ctx.fillStyle = cam.disabledTimer > 0 ? "#64748B" : (cam.alerted ? "#FF003C" : (ledGlow ? "#EF4444" : "#7F1D1D"));
      ctx.beginPath();
      ctx.arc(0, -4, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Renders guards with top-down armored tactical sentry silhouettes & patrol paths.
   */
  renderGuards(guards) {
    const ctx = this.ctx;
    ctx.save();

    for (let g of guards) {
      // Subtle dotted patrol route trail
      if (g.patrol && g.patrol.length > 1) {
        ctx.strokeStyle = "rgba(0, 240, 255, 0.12)";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(g.patrol[0].x, g.patrol[0].y);
        for (let p = 1; p < g.patrol.length; p++) {
          ctx.lineTo(g.patrol[p].x, g.patrol[p].y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.save();
      ctx.translate(g.x, g.y);

      // Alert marker badge
      if (g.state === "ALERT") {
        ctx.fillStyle = "#FF003C";
        ctx.font = "bold 13px 'Courier New', monospace";
        ctx.fillText("(!)", -10, -18);
      } else if (g.state === "INVESTIGATING" || g.state === "SUSPICIOUS") {
        ctx.fillStyle = "#F59E0B";
        ctx.font = "bold 13px 'Courier New', monospace";
        ctx.fillText("(?)", -10, -18);
      }

      ctx.rotate(g.facing);

      // Drop shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.beginPath();
      ctx.ellipse(0, 2, 11, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Armored sentry shoulders
      ctx.fillStyle = g.state === "ALERT" ? "#7F1D1D" : "#1E293B";
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = g.state === "ALERT" ? "#FF003C" : (g.state === "INVESTIGATING" ? "#F59E0B" : "#64748B");
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Tactical vest center plate
      ctx.fillStyle = "#334155";
      ctx.fillRect(-3, -4, 6, 8);

      // Security helmet
      ctx.fillStyle = "#0F172A";
      ctx.beginPath();
      ctx.arc(2, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Flashlight emitter in hand
      ctx.fillStyle = "#F8FAFC";
      ctx.beginPath();
      ctx.arc(8, 3, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Renders sleek translucent tactical scorecard overlay for Shot 4 and victory.
   */
  renderDebriefScorecard(ctx) {
    ctx.save();

    // Dim background blueprint
    ctx.fillStyle = "rgba(4, 8, 16, 0.78)";
    ctx.fillRect(0, 0, this.width, this.height);

    // Central Glassmorphic Card (920 x 360)
    const cw = 920;
    const ch = 350;
    const cx = (this.width - cw) * 0.5;
    const cy = 52;

    ctx.fillStyle = "rgba(10, 18, 32, 0.94)";
    ctx.fillRect(cx, cy, cw, ch);
    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx, cy, cw, ch);

    // Decorative corner ticks
    const tickLen = 14;
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(cx, cy + tickLen);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + tickLen, cy);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(cx + cw - tickLen, cy);
    ctx.lineTo(cx + cw, cy);
    ctx.lineTo(cx + cw, cy + tickLen);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(cx, cy + ch - tickLen);
    ctx.lineTo(cx, cy + ch);
    ctx.lineTo(cx + tickLen, cy + ch);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(cx + cw - tickLen, cy + ch);
    ctx.lineTo(cx + cw, cy + ch);
    ctx.lineTo(cx + cw, cy + ch - tickLen);
    ctx.stroke();

    // Header Banner
    ctx.font = "bold 15px 'Courier New', monospace";
    ctx.fillStyle = "#00F0FF";
    ctx.fillText("MISSION DEBRIEF // HEIST ACCOMPLISHED", cx + 24, cy + 32);

    ctx.font = "10px 'Courier New', monospace";
    ctx.fillStyle = "rgba(148, 163, 184, 0.85)";
    ctx.fillText("SYNDICATE RECOVERY OPERATION // CLASSIFIED INTEL", cx + 24, cy + 48);

    // Rank Badge
    ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
    ctx.fillRect(cx + cw - 260, cy + 18, 236, 40);
    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx + cw - 260, cy + 18, 236, 40);

    ctx.font = "bold 13px 'Courier New', monospace";
    ctx.fillStyle = "#10B981";
    ctx.fillText("RANK: S [GHOST OPERATIVE]", cx + cw - 248, cy + 42);

    // Divider Line
    ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx + 24, cy + 68);
    ctx.lineTo(cx + cw - 24, cy + 68);
    ctx.stroke();

    // Metrics Stats Columns
    const stats = [
      { label: "TARGET VALUATION", val: "$62,500,000", color: "#F59E0B" },
      { label: "DETECTIONS LOGGED", val: "00 [GHOST]", color: "#10B981" },
      { label: "ALARM LOCKDOWNS", val: "00 [CLEAN]", color: "#10B981" },
      { label: "GADGETS DEPLOYED", val: "03 [1 COIN, 1 EMP, 1 SMOKE]", color: "#38BDF8" },
      { label: "ELAPSED INFIL TIME", val: "02:41.8", color: "#F1F5F9" }
    ];

    stats.forEach((st, idx) => {
      const sy = cy + 96 + idx * 26;
      ctx.font = "bold 9px 'Courier New', monospace";
      ctx.fillStyle = "rgba(148, 163, 184, 0.85)";
      ctx.fillText(st.label, cx + 32, sy);

      ctx.font = "bold 11px 'Courier New', monospace";
      ctx.fillStyle = st.color;
      ctx.fillText(st.val, cx + 240, sy);
    });

    // Right Column: 3-Floor Progression Cards
    const cards = [
      {
        floor: "CONTRACT 01",
        title: "THE LUMINARY GALLERY",
        loot: "STAR OF ALEXANDRIA",
        status: "COMPLETED 100%",
        color: "#00F0FF"
      },
      {
        floor: "CONTRACT 02",
        title: "THE OBSIDIAN MAINFRAME",
        loot: "QUANTUM CRYPTO CIPHER",
        status: "COMPLETED 100%",
        color: "#38BDF8"
      },
      {
        floor: "CONTRACT 03",
        title: "THE SOVEREIGN SANCTUM",
        loot: "MASTER TITANIUM SAFE",
        status: "COMPLETED 100%",
        color: "#F59E0B"
      }
    ];

    cards.forEach((cd, idx) => {
      const cardY = cy + 86 + idx * 72;
      const cardX = cx + 520;
      const cardW = 360;
      const cardH = 62;

      ctx.fillStyle = "rgba(15, 23, 42, 0.80)";
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.strokeStyle = cd.color;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      ctx.font = "bold 9px 'Courier New', monospace";
      ctx.fillStyle = cd.color;
      ctx.fillText(`[ ${cd.floor} // ${cd.status} ]`, cardX + 12, cardY + 18);

      ctx.font = "bold 11px 'Courier New', monospace";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(cd.title, cardX + 12, cardY + 36);

      ctx.font = "9px 'Courier New', monospace";
      ctx.fillStyle = "rgba(148, 163, 184, 0.9)";
      ctx.fillText(`TARGET: ${cd.loot}`, cardX + 12, cardY + 52);
    });

    // Footer Action Prompt
    ctx.font = "bold 10px 'Courier New', monospace";
    ctx.fillStyle = "#00F0FF";
    ctx.fillText("PRESS [SPACE] TO REDEPLOY OPERATIVE  //  PRESS [R] TO REPLAY FROM FLOOR 1", cx + 24, cy + ch - 18);

    ctx.restore();
  }
}
