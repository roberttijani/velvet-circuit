/**
 * renderer.js - Tactical Noir Architectural Blueprint Renderer
 * Draws multi-room floorplans, procedural floor tiles, furniture, loot targets, and the thief.
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

    // Minor blueprint grid
    ctx.strokeStyle = "rgba(18, 42, 74, 0.45)";
    ctx.lineWidth = 0.5;
    const gridSize = 20;
    ctx.beginPath();
    for (let x = 0; x < this.width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for (let y = 0; y < this.height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();

    // Major blueprint grid (100px)
    ctx.strokeStyle = "rgba(28, 64, 112, 0.65)";
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
   * Renders room floors, carpets, and blueprint room labels.
   */
  renderRooms(level) {
    const ctx = this.ctx;

    for (let room of level.rooms) {
      ctx.save();
      // Floor tint
      if (level.floorType === "gallery") {
        ctx.fillStyle = "#0A1424";
        ctx.fillRect(room.x, room.y, room.w, room.h);
        // Diamond tile pattern
        ctx.strokeStyle = "rgba(22, 54, 90, 0.4)";
        ctx.lineWidth = 0.5;
        for (let tx = room.x; tx < room.x + room.w; tx += 24) {
          for (let ty = room.y; ty < room.y + room.h; ty += 24) {
            ctx.strokeRect(tx, ty, 24, 24);
          }
        }
      } else if (level.floorType === "server") {
        ctx.fillStyle = "#07111D";
        ctx.fillRect(room.x, room.y, room.w, room.h);
        // Data channel conduits
        ctx.strokeStyle = "rgba(0, 180, 216, 0.15)";
        ctx.lineWidth = 1;
        ctx.strokeRect(room.x + 4, room.y + 4, room.w - 8, room.h - 8);
      } else {
        // Penthouse
        ctx.fillStyle = "#0E1726";
        ctx.fillRect(room.x, room.y, room.w, room.h);
        // Luxury border
        ctx.strokeStyle = "rgba(212, 175, 55, 0.18)";
        ctx.lineWidth = 1;
        ctx.strokeRect(room.x + 6, room.y + 6, room.w - 12, room.h - 12);
      }

      // Room name & blueprint tag
      ctx.font = "9px 'Courier New', monospace";
      ctx.fillStyle = "rgba(0, 240, 255, 0.55)";
      ctx.fillText(`[ ${room.tag} // ${room.name} ]`, room.x + 10, room.y + 18);

      ctx.restore();
    }
  }

  /**
   * Renders walls with blueprint double-line border style.
   */
  renderWalls(walls) {
    const ctx = this.ctx;
    ctx.save();

    // Outer wall thick core
    ctx.strokeStyle = "#1A365D";
    ctx.lineWidth = 6;
    ctx.lineCap = "square";
    ctx.beginPath();
    for (let w of walls) {
      ctx.moveTo(w.x1, w.y1);
      ctx.lineTo(w.x2, w.y2);
    }
    ctx.stroke();

    // Architectural inner bright blueprint line
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
   * Renders furniture, obstacles, and consoles.
   */
  renderFurniture(furniture) {
    const ctx = this.ctx;
    ctx.save();

    for (let item of furniture) {
      if (item.type === "vitrine") {
        // Glass vitrine case
        ctx.fillStyle = "rgba(0, 240, 255, 0.08)";
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
        // High-tech server rack
        ctx.fillStyle = "#0B1522";
        ctx.fillRect(item.x, item.y, item.w, item.h);
        ctx.strokeStyle = "#1D4ED8";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(item.x, item.y, item.w, item.h);
        // Blinking server LEDs
        for (let lx = item.x + 8; lx < item.x + item.w - 8; lx += 12) {
          const blink = (Math.sin(this.time * 6 + lx) > 0.1);
          ctx.fillStyle = blink ? "#00F0FF" : "#005577";
          ctx.fillRect(lx, item.y + 6, 4, 3);
          ctx.fillStyle = blink ? "#10B981" : "#044E36";
          ctx.fillRect(lx, item.y + item.h - 9, 4, 3);
        }
      } else if (item.type === "column" || item.type === "plinth") {
        // Column / Plinth
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
   * Renders the glowing loot target (Diamond, Quantum Cipher, or Sovereign Safe).
   */
  renderLoot(loot, isSecured) {
    const ctx = this.ctx;
    ctx.save();

    const pulse = 0.8 + 0.2 * Math.sin(this.time * 4);

    if (isSecured) {
      // Empty pedestal indicator
      ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(loot.x - 20, loot.y - 20, 40, 40);
      ctx.font = "8px 'Courier New', monospace";
      ctx.fillStyle = "#10B981";
      ctx.fillText("LOOT SECURED", loot.x - 28, loot.y + 32);
      ctx.restore();
      return;
    }

    // Pedestal base
    ctx.fillStyle = "#0A1828";
    ctx.fillRect(loot.x - 22, loot.y - 22, 44, 44);
    ctx.strokeStyle = loot.glowColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(loot.x - 22, loot.y - 22, 44, 44);

    // Glowing halo
    const grad = ctx.createRadialGradient(loot.x, loot.y, 4, loot.x, loot.y, loot.radius * pulse);
    grad.addColorStop(0, loot.glowColor);
    grad.addColorStop(0.5, "rgba(0, 240, 255, 0.35)");
    grad.addColorStop(1, "rgba(0, 240, 255, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(loot.x, loot.y, loot.radius * pulse, 0, Math.PI * 2);
    ctx.fill();

    if (loot.type === "diamond") {
      // Multifaceted diamond vector
      ctx.save();
      ctx.translate(loot.x, loot.y);
      ctx.fillStyle = "#E0F7FA";
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(14, 0);
      ctx.lineTo(0, 14);
      ctx.lineTo(-14, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Internal facets
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.lineTo(14, 0);
      ctx.moveTo(0, -14);
      ctx.lineTo(0, 14);
      ctx.strokeStyle = "#00F0FF";
      ctx.stroke();
      ctx.restore();
    } else if (loot.type === "cube") {
      // Rotating holographic quantum data cube
      ctx.save();
      ctx.translate(loot.x, loot.y);
      ctx.rotate(this.time * 0.8);
      ctx.fillStyle = "rgba(0, 240, 255, 0.4)";
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(-12, -12, 24, 24);
      ctx.fillRect(-12, -12, 24, 24);
      ctx.rotate(Math.PI / 4);
      ctx.strokeStyle = "#FFFFFF";
      ctx.strokeRect(-8, -8, 16, 16);
      ctx.restore();
    } else {
      // Master Titanium Safe Door
      ctx.save();
      ctx.translate(loot.x, loot.y);
      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 3;
      ctx.stroke();
      // Safe dial spoke wheel
      ctx.rotate(this.time * 0.5);
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(12, 0);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Diegetic target callout
    ctx.font = "bold 9px 'Courier New', monospace";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("TARGET OBJECTIVE", loot.x - 42, loot.y - 28);
    ctx.fillStyle = loot.glowColor;
    ctx.fillText(`${loot.name} [E]`, loot.x - 48, loot.y + 34);

    ctx.restore();
  }

  /**
   * Renders the extraction zone.
   */
  renderExtraction(exfil, isUnlocked) {
    const ctx = this.ctx;
    ctx.save();

    const color = isUnlocked ? "#10B981" : "#64748B";
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash(isUnlocked ? [6, 4] : [2, 2]);
    ctx.strokeRect(exfil.x, exfil.y, exfil.w, exfil.h);

    ctx.fillStyle = isUnlocked ? "rgba(16, 185, 129, 0.15)" : "rgba(100, 116, 139, 0.05)";
    ctx.fillRect(exfil.x, exfil.y, exfil.w, exfil.h);

    ctx.font = "bold 8px 'Courier New', monospace";
    ctx.fillStyle = color;
    ctx.fillText(isUnlocked ? ">> EXFIL READY <<" : "LOCKED: GET LOOT", exfil.x - 2, exfil.y - 8);

    ctx.restore();
  }

  /**
   * Renders interactive hacking terminals.
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

      // Terminal screen
      ctx.fillStyle = term.hacked ? "#10B981" : "#00F0FF";
      ctx.fillRect(term.x - 8, term.y - 8, 16, 16);

      ctx.font = "8px 'Courier New', monospace";
      ctx.fillStyle = term.hacked ? "#10B981" : "#FFFFFF";
      ctx.fillText(term.hacked ? "OVERRIDDEN" : `${term.label} [E]`, term.x - 30, term.y - 16);

      // Range indicator if player is near
      const dist = Math.hypot(thief.x - term.x, thief.y - term.y);
      if (dist < 45 && !term.hacked) {
        ctx.strokeStyle = "rgba(0, 240, 255, 0.5)";
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
   * Renders the thief operative with dynamic posture, goggles, and mouse aimline.
   */
  renderThief(thief, mouseX, mouseY) {
    const ctx = this.ctx;
    ctx.save();

    // Subtle tactical aim line towards mouse
    ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(thief.x, thief.y);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Thief body
    ctx.translate(thief.x, thief.y);
    ctx.rotate(thief.facing);

    // Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.ellipse(0, 2, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stealth suit torso
    ctx.fillStyle = thief.isSneaking ? "#0F2137" : (thief.isSprinting ? "#1A365D" : "#132338");
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Twin glowing emerald night-vision goggle optics
    ctx.fillStyle = "#10B981";
    ctx.shadowColor = "#10B981";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(5, -3, 1.8, 0, Math.PI * 2);
    ctx.arc(5, 3, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  /**
   * Renders wall-mounted security cameras.
   */
  renderCameras(cameras) {
    const ctx = this.ctx;
    ctx.save();

    for (let cam of cameras) {
      ctx.save();
      ctx.translate(cam.x, cam.y);
      ctx.rotate(cam.currentAngle);

      // Camera base housing
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(-6, -6, 12, 12);
      ctx.strokeStyle = cam.alerted ? "#FF003C" : "#00F0FF";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-6, -6, 12, 12);

      // Camera lens barrel
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(4, -3, 8, 6);

      // Pulsing recording LED
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
   * Renders patrolling guards with tactical uniforms and state alerts.
   */
  renderGuards(guards) {
    const ctx = this.ctx;
    ctx.save();

    for (let g of guards) {
      ctx.save();
      ctx.translate(g.x, g.y);

      // Status indicator bubble above guard head
      if (g.state === "ALERT") {
        ctx.fillStyle = "#FF003C";
        ctx.font = "bold 13px 'Courier New', monospace";
        ctx.fillText("(!)", -10, -16);
      } else if (g.state === "INVESTIGATING" || g.state === "SUSPICIOUS") {
        ctx.fillStyle = "#F59E0B";
        ctx.font = "bold 13px 'Courier New', monospace";
        ctx.fillText("(?)", -10, -16);
      }

      ctx.rotate(g.facing);

      // Guard body
      ctx.fillStyle = g.state === "ALERT" ? "#7F1D1D" : "#1E293B";
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = g.state === "ALERT" ? "#FF003C" : (g.state === "INVESTIGATING" ? "#F59E0B" : "#64748B");
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Guard flashlight / visor front indicator
      ctx.fillStyle = "#F1F5F9";
      ctx.beginPath();
      ctx.arc(6, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  }
}
