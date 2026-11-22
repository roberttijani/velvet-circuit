/**
 * textures.js - Procedural Canvas Texture & Pattern Synthesizer (v4)
 * Generates 100% offline procedural patterns and materials using offscreen canvases:
 * - Floor 1: Dark veined marble tiles, crimson & gold velvet runners
 * - Floor 2: Brushed gunmetal floor grates, glowing fiber conduits
 * - Floor 3: Dark mahogany herringbone parquet, gold-trimmed executive carpets
 */

export class TextureManager {
  constructor() {
    this.patterns = {};
    this.initialized = false;
  }

  init(ctx) {
    if (this.initialized) return;

    this.patterns.marble = this.createMarblePattern(ctx);
    this.patterns.grate = this.createGratePattern(ctx);
    this.patterns.parquet = this.createParquetPattern(ctx);
    this.patterns.velvet = this.createVelvetPattern(ctx);
    this.initialized = true;
  }

  /**
   * Procedural dark veined marble tiles (64x64 tile repeat).
   */
  createMarblePattern(ctx) {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const pctx = c.getContext('2d');

    // Base dark slate marble
    pctx.fillStyle = "#0c1524";
    pctx.fillRect(0, 0, 64, 64);

    // Subtle stone flecks & mottling
    pctx.fillStyle = "rgba(25, 42, 65, 0.4)";
    pctx.fillRect(4, 4, 24, 24);
    pctx.fillRect(36, 36, 24, 24);

    // Organic marble veins
    pctx.strokeStyle = "rgba(180, 225, 255, 0.05)";
    pctx.lineWidth = 1.2;
    pctx.beginPath();
    pctx.moveTo(0, 18);
    pctx.bezierCurveTo(20, 24, 40, 8, 64, 38);
    pctx.stroke();

    pctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
    pctx.lineWidth = 0.8;
    pctx.beginPath();
    pctx.moveTo(12, 0);
    pctx.bezierCurveTo(28, 30, 48, 44, 52, 64);
    pctx.stroke();

    // Tile bevel & 1px grout border
    pctx.strokeStyle = "rgba(4, 8, 16, 0.75)";
    pctx.lineWidth = 1;
    pctx.strokeRect(0.5, 0.5, 63, 63);

    pctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
    pctx.strokeRect(1.5, 1.5, 61, 61);

    return ctx.createPattern(c, 'repeat');
  }

  /**
   * Brushed gunmetal industrial floor grates with perforation (32x32 repeat).
   */
  createGratePattern(ctx) {
    const c = document.createElement('canvas');
    c.width = 32;
    c.height = 32;
    const pctx = c.getContext('2d');

    // Gunmetal substrate
    pctx.fillStyle = "#0a131e";
    pctx.fillRect(0, 0, 32, 32);

    // Subtle brushed metal sheen lines
    pctx.strokeStyle = "rgba(30, 48, 70, 0.35)";
    pctx.lineWidth = 1;
    for (let y = 2; y < 32; y += 4) {
      pctx.beginPath();
      pctx.moveTo(0, y);
      pctx.lineTo(32, y);
      pctx.stroke();
    }

    // Grid perforation holes
    const holes = [
      { x: 8, y: 8 }, { x: 24, y: 8 },
      { x: 16, y: 16 },
      { x: 8, y: 24 }, { x: 24, y: 24 }
    ];

    for (let h of holes) {
      // Recessed shadow
      pctx.fillStyle = "#05080e";
      pctx.beginPath();
      pctx.arc(h.x, h.y, 3.5, 0, Math.PI * 2);
      pctx.fill();

      // Rim highlight
      pctx.strokeStyle = "rgba(0, 240, 255, 0.12)";
      pctx.lineWidth = 0.7;
      pctx.beginPath();
      pctx.arc(h.x, h.y, 3.5, 0, Math.PI);
      pctx.stroke();
    }

    // Plate edge seams
    pctx.strokeStyle = "rgba(2, 5, 10, 0.9)";
    pctx.lineWidth = 1;
    pctx.strokeRect(0.5, 0.5, 31, 31);

    return ctx.createPattern(c, 'repeat');
  }

  /**
   * Dark mahogany herringbone parquet flooring (48x48 repeat).
   */
  createParquetPattern(ctx) {
    const c = document.createElement('canvas');
    c.width = 48;
    c.height = 48;
    const pctx = c.getContext('2d');

    // Base rich mahogany
    pctx.fillStyle = "#150c0a";
    pctx.fillRect(0, 0, 48, 48);

    // Chevron wooden planks
    const slats = [
      { x: 0, y: 0, w: 24, h: 12, col: "#1e110e" },
      { x: 24, y: 0, w: 24, h: 12, col: "#190e0c" },
      { x: 0, y: 12, w: 24, h: 12, col: "#221310" },
      { x: 24, y: 12, w: 24, h: 12, col: "#1c100d" },
      { x: 0, y: 24, w: 24, h: 12, col: "#180d0b" },
      { x: 24, y: 24, w: 24, h: 12, col: "#20120f" },
      { x: 0, y: 36, w: 24, h: 12, col: "#1c100d" },
      { x: 24, y: 36, w: 24, h: 12, col: "#170c0a" }
    ];

    for (let s of slats) {
      pctx.fillStyle = s.col;
      pctx.fillRect(s.x, s.y, s.w, s.h);

      // Fine grain striations
      pctx.strokeStyle = "rgba(0, 0, 0, 0.28)";
      pctx.lineWidth = 0.5;
      pctx.beginPath();
      pctx.moveTo(s.x + 2, s.y + 4);
      pctx.lineTo(s.x + s.w - 2, s.y + 4);
      pctx.moveTo(s.x + 4, s.y + 8);
      pctx.lineTo(s.x + s.w - 4, s.y + 8);
      pctx.stroke();

      // Slat edge shadow
      pctx.strokeStyle = "rgba(6, 3, 2, 0.75)";
      pctx.lineWidth = 0.8;
      pctx.strokeRect(s.x + 0.5, s.y + 0.5, s.w - 1, s.h - 1);
    }

    return ctx.createPattern(c, 'repeat');
  }

  /**
   * Rich crimson woven velvet carpet material.
   */
  createVelvetPattern(ctx) {
    const c = document.createElement('canvas');
    c.width = 16;
    c.height = 16;
    const pctx = c.getContext('2d');

    pctx.fillStyle = "#480b15";
    pctx.fillRect(0, 0, 16, 16);

    // Subtle weave grain
    pctx.fillStyle = "#5c0e1b";
    for (let x = 0; x < 16; x += 4) {
      for (let y = 0; y < 16; y += 4) {
        if ((x + y) % 8 === 0) pctx.fillRect(x, y, 2, 2);
      }
    }

    return ctx.createPattern(c, 'repeat');
  }

  /**
   * Renders ornate velvet carpet runners with gold braided trim and drop shadow.
   */
  renderCarpetRunner(ctx, runner) {
    ctx.save();

    // 1. Soft drop shadow onto floor
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillRect(runner.x + 3, runner.y + 3, runner.w, runner.h);

    // 2. Rich velvet body
    ctx.fillStyle = this.patterns.velvet || "#4a0b16";
    ctx.fillRect(runner.x, runner.y, runner.w, runner.h);

    // 3. Dual braided gold borders
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 2;
    ctx.strokeRect(runner.x + 1, runner.y + 1, runner.w - 2, runner.h - 2);

    ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
    ctx.lineWidth = 1;
    ctx.strokeRect(runner.x + 4, runner.y + 4, runner.w - 8, runner.h - 8);

    ctx.restore();
  }

  /**
   * Renders underfloor fiber-optic conduits with glowing pulsed core.
   */
  renderFiberConduit(ctx, conduit, time = 0) {
    ctx.save();

    // Conduit trench bed
    ctx.strokeStyle = "#05090f";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(conduit.x1, conduit.y1);
    ctx.lineTo(conduit.x2, conduit.y2);
    ctx.stroke();

    // Outer glow
    const pulse = 0.5 + 0.5 * Math.sin(time * 3 + conduit.x1 * 0.05);
    ctx.strokeStyle = `rgba(0, 240, 255, ${0.25 + pulse * 0.25})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(conduit.x1, conduit.y1);
    ctx.lineTo(conduit.x2, conduit.y2);
    ctx.stroke();

    // Core laser fiber
    ctx.strokeStyle = "#E0F7FA";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(conduit.x1, conduit.y1);
    ctx.lineTo(conduit.x2, conduit.y2);
    ctx.stroke();

    ctx.restore();
  }
}
