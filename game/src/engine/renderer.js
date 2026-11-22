/**
 * renderer.js - 2.5D Illuminated Neo-Noir Heist Renderer (v4)
 * Coordinates:
 * - Procedural canvas materials (marble, grate, parquet, velvet)
 * - 2.5D pseudo-perspective walls with lit south facades and drop-shadows
 * - Detailed architectural props (vitrines, columns, server racks, boardroom tables)
 * - Articulated top-down operative with glowing loot satchel
 * - Armored sentries with tactical flashlights and diegetic alert badges
 * - Studio mission debrief scorecard modal
 */

import { TextureManager } from './textures.js';
import { WorldPropsRenderer } from '../world/props.js';
import { MissionDebriefModal } from '../ui/debrief.js';

export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.time = 0;

    // Sub-renderers
    this.textures = new TextureManager();
    this.props = new WorldPropsRenderer();
    this.debriefModal = new MissionDebriefModal(this.width, this.height);

    this.textures.init(this.ctx);
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

      // 1. Procedural Floor Texture Fill
      if (level.floorType === "gallery") {
        ctx.fillStyle = this.textures.patterns.marble || "#0A1424";
        ctx.fillRect(room.x, room.y, room.w, room.h);
      } else if (level.floorType === "server") {
        ctx.fillStyle = this.textures.patterns.grate || "#07111D";
        ctx.fillRect(room.x, room.y, room.w, room.h);
      } else {
        ctx.fillStyle = this.textures.patterns.parquet || "#0E1726";
        ctx.fillRect(room.x, room.y, room.w, room.h);
      }

      // Room perimeter blueprint accent
      ctx.strokeStyle = "rgba(0, 240, 255, 0.18)";
      ctx.lineWidth = 1;
      ctx.strokeRect(room.x + 1, room.y + 1, room.w - 2, room.h - 2);

      // 2. Velvet Carpet Runners
      if (level.carpetRunners) {
        for (let c of level.carpetRunners) {
          this.textures.renderCarpetRunner(ctx, c);
        }
      }

      // 3. Glowing Fiber Conduits
      if (level.conduits) {
        for (let cd of level.conduits) {
          this.textures.renderFiberConduit(ctx, cd, this.time);
        }
      }

      // 4. Fine Art Wall Paintings
      if (level.artworks) {
        this.props.renderWallArtworks(ctx, level.artworks);
      }

      // 5. Titanium Vault Door
      if (level.vaultDoor) {
        this.props.renderTitaniumVaultDoor(ctx, level.vaultDoor.x, level.vaultDoor.y, level.vaultDoor.radius, this.time);
      }

      // 6. Diegetic Room Title Badge (Safe non-overlapping coordinates)
      const badgeText = `[ ${room.tag} // ${room.name} ]`;
      ctx.font = "bold 9px 'Courier New', monospace";
      const bw = ctx.measureText(badgeText).width + 12;

      ctx.fillStyle = "rgba(7, 12, 22, 0.90)";
      ctx.fillRect(room.x + 8, room.y + 8, bw, 14);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.45)";
      ctx.lineWidth = 1;
      ctx.strokeRect(room.x + 8, room.y + 8, bw, 14);

      ctx.fillStyle = "#00F0FF";
      ctx.fillText(badgeText, room.x + 14, room.y + 18);

      ctx.restore();
    }
  }

  /**
   * Renders 2.5D architectural walls with south-facing vertical facades and drop shadows.
   */
  renderWalls(walls) {
    const ctx = this.ctx;
    ctx.save();

    // 1. Soft Wall Floor Drop-Shadow onto adjacent floors
    ctx.strokeStyle = "rgba(0, 0, 0, 0.65)";
    ctx.lineWidth = 14;
    ctx.lineCap = "square";
    ctx.beginPath();
    for (let w of walls) {
      ctx.moveTo(w.x1 + 3, w.y1 + 4);
      ctx.lineTo(w.x2 + 3, w.y2 + 4);
    }
    ctx.stroke();

    // 2. 2.5D South-Facing Vertical Wall Facade (for horizontal wall segments)
    for (let w of walls) {
      if (Math.abs(w.y1 - w.y2) < 2) {
        const left = Math.min(w.x1, w.x2);
        const right = Math.max(w.x1, w.x2);
        const wallWidth = right - left;

        // Vertical Wall Drop (8px height)
        ctx.fillStyle = "#121E2E";
        ctx.fillRect(left, w.y1, wallWidth, 8);

        // Vertical architectural joint seams
        ctx.strokeStyle = "#1A2A3D";
        ctx.lineWidth = 1;
        for (let jx = left + 28; jx < right - 12; jx += 28) {
          ctx.beginPath();
          ctx.moveTo(jx, w.y1);
          ctx.lineTo(jx, w.y1 + 8);
          ctx.stroke();
        }

        // Cyan Baseboard Floor Trim
        ctx.strokeStyle = "#38BDF8";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(left, w.y1 + 8);
        ctx.lineTo(right, w.y1 + 8);
        ctx.stroke();
      }
    }

    // 3. Thick Dark Slate Architectural Wall Cap
    ctx.strokeStyle = "#0B1522";
    ctx.lineWidth = 10;
    ctx.beginPath();
    for (let w of walls) {
      ctx.moveTo(w.x1, w.y1);
      ctx.lineTo(w.x2, w.y2);
    }
    ctx.stroke();

    // 4. Inner Slate Bevel Edge
    ctx.strokeStyle = "#1E293B";
    ctx.lineWidth = 6;
    ctx.beginPath();
    for (let w of walls) {
      ctx.moveTo(w.x1, w.y1);
      ctx.lineTo(w.x2, w.y2);
    }
    ctx.stroke();

    // 5. Sharp Cyan Architectural Blueprint Centerline
    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let w of walls) {
      ctx.moveTo(w.x1, w.y1);
      ctx.lineTo(w.x2, w.y2);
    }
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Renders handcrafted 2.5D furniture obstacles & architectural props.
   */
  renderFurniture(furniture) {
    const ctx = this.ctx;
    ctx.save();

    for (let item of furniture) {
      if (item.type === "column") {
        this.props.renderColumn(ctx, item);
      } else if (item.type === "vitrine") {
        this.props.renderVitrine(ctx, item, this.time);
      } else if (item.type === "server") {
        this.props.renderServerRack(ctx, item, this.time);
      } else if (item.type === "desk" && item.label && item.label.includes("BOARD")) {
        this.props.renderBoardroomTable(ctx, item);
      } else if (item.type === "plinth") {
        // Classical display plinth
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(item.x + 3, item.y + 3, item.w, item.h);

        ctx.fillStyle = "#1E2A3C";
        ctx.fillRect(item.x, item.y, item.w, item.h);
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 1.2;
        ctx.strokeRect(item.x, item.y, item.w, item.h);

        // Statue / bronze bust silhouette
        ctx.fillStyle = "#94A3B8";
        ctx.beginPath();
        ctx.arc(item.x + item.w * 0.5, item.y + item.h * 0.5, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#CBD5E1";
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (item.type === "desk") {
        // Standard security desk / terminal workstation
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(item.x + 4, item.y + 4, item.w, item.h);

        ctx.fillStyle = "#142234";
        ctx.fillRect(item.x, item.y, item.w, item.h);
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(item.x, item.y, item.w, item.h);

        // Dual glowing workstation monitor screens
        ctx.fillStyle = "#00F0FF";
        ctx.fillRect(item.x + 8, item.y + 6, 18, 10);
        ctx.fillRect(item.x + 32, item.y + 6, 18, 10);
      } else {
        // Pedestal base
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
   * Renders the glowing loot target with dynamic unclipped callout pill.
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
   * Renders the thief operative as an articulated top-down operative with glowing loot satchel.
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
    ctx.ellipse(0, 3, 11, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tactical Operative Shoulders (Dark tactical trench/coat)
    ctx.fillStyle = "#0F1E33";
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 6.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // Tactical harness straps
    ctx.fillStyle = "#1E3A5F";
    ctx.fillRect(-3, -5, 6, 10);

    // Articulated arms poised forward
    ctx.fillStyle = "#0B1522";
    ctx.fillRect(4, -6, 5, 3.5);
    ctx.fillRect(4, 2.5, 5, 3.5);

    // Hooded head
    ctx.fillStyle = "#0A1322";
    ctx.beginPath();
    ctx.arc(2, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Twin glowing cyan night-vision visor optics
    ctx.fillStyle = "#00F0FF";
    ctx.beginPath();
    ctx.arc(6, -2.2, 1.6, 0, Math.PI * 2);
    ctx.arc(6, 2.2, 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Visibly Glowing Loot Satchel on Operative Hip (Active when loot is secured!)
    if (thief.hasLoot) {
      const satchelPulse = 0.8 + 0.2 * Math.sin(this.time * 6);
      const satchelGrad = ctx.createRadialGradient(-5, 5, 1, -5, 5, 12 * satchelPulse);
      satchelGrad.addColorStop(0, "#00F0FF");
      satchelGrad.addColorStop(0.5, "rgba(0, 240, 255, 0.45)");
      satchelGrad.addColorStop(1, "rgba(0, 240, 255, 0)");
      ctx.fillStyle = satchelGrad;
      ctx.beginPath();
      ctx.arc(-5, 5, 12 * satchelPulse, 0, Math.PI * 2);
      ctx.fill();

      // Satchel pack
      ctx.fillStyle = "#E0F7FA";
      ctx.fillRect(-7, 3, 5, 5);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1;
      ctx.strokeRect(-7, 3, 5, 5);
    }

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
      ctx.ellipse(0, 3, 11, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Armored sentry shoulders with epaulets
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

      // Security helmet / peaked cap
      ctx.fillStyle = "#0F172A";
      ctx.beginPath();
      ctx.arc(2, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Tactical flashlight in right hand
      ctx.fillStyle = "#F8FAFC";
      ctx.beginPath();
      ctx.arc(8, 3, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Renders tactical mission debrief scorecard modal.
   */
  renderDebriefScorecard(ctx) {
    this.debriefModal.render(ctx, this.time);
  }
}
