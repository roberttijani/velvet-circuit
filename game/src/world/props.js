/**
 * props.js - Rich Architectural Props & 2.5D Isometric World Decor (v4)
 * Provides detailed, authentic top-down decorative props for each heist floor:
 * - Floor 1: Glass vitrines with specular reflection sheen, wall-mounted fine art paintings
 *            with picture lights, fluted marble columns, brass stanchion posts, potted palms.
 * - Floor 2: Heavy server racks with animated LED banks and vent grilles, dual-monitor consoles.
 * - Floor 3: Executive boardroom table with chairs, circular titanium vault door with spoked wheel.
 */

export class WorldPropsRenderer {
  constructor() {}

  /**
   * Renders wall-mounted fine art paintings along south-facing wall segments.
   */
  renderWallArtworks(ctx, artworks = []) {
    ctx.save();
    for (let art of artworks) {
      // 1. Picture light cone casting soft downward glow
      const grad = ctx.createRadialGradient(art.x + art.w * 0.5, art.y + 4, 2, art.x + art.w * 0.5, art.y + 24, 32);
      grad.addColorStop(0, "rgba(255, 230, 160, 0.35)");
      grad.addColorStop(0.6, "rgba(255, 215, 120, 0.12)");
      grad.addColorStop(1, "rgba(255, 200, 100, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(art.x + art.w * 0.5 - 6, art.y + 4);
      ctx.lineTo(art.x + art.w + 12, art.y + 36);
      ctx.lineTo(art.x - 12, art.y + 36);
      ctx.closePath();
      ctx.fill();

      // 2. Heavy gilded gold frame
      ctx.fillStyle = "#B48222";
      ctx.fillRect(art.x - 2, art.y - 2, art.w + 4, art.h + 4);
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 1;
      ctx.strokeRect(art.x - 2, art.y - 2, art.w + 4, art.h + 4);

      // 3. Canvas painting surface
      ctx.fillStyle = art.palette ? art.palette[0] : "#1E293B";
      ctx.fillRect(art.x, art.y, art.w, art.h);

      // Procedural landscape / abstract brushwork on canvas
      if (art.palette && art.palette.length > 1) {
        ctx.fillStyle = art.palette[1];
        ctx.beginPath();
        ctx.arc(art.x + art.w * 0.65, art.y + art.h * 0.4, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = art.palette[2] || "#38BDF8";
        ctx.fillRect(art.x + 2, art.y + art.h * 0.55, art.w - 4, art.h * 0.4);
      }

      // 4. Brass picture light fixture mounted directly above frame
      ctx.fillStyle = "#D4AF37";
      ctx.fillRect(art.x + art.w * 0.5 - 10, art.y - 7, 20, 3.5);
      ctx.fillStyle = "#FDE68A";
      ctx.fillRect(art.x + art.w * 0.5 - 6, art.y - 4, 12, 1.5);
    }
    ctx.restore();
  }

  /**
   * Renders glass museum vitrines with interior velvet cushion, relic, and specular glass sheen.
   */
  renderVitrine(ctx, item, time = 0) {
    ctx.save();

    // 1. Soft floor drop shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillRect(item.x + 4, item.y + 4, item.w, item.h);

    // 2. Dark walnut / bronze pedestal base
    ctx.fillStyle = "#1E130D";
    ctx.fillRect(item.x, item.y, item.w, item.h);
    ctx.strokeStyle = "#B48222";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(item.x, item.y, item.w, item.h);

    // 3. Interior velvet display cushion
    ctx.fillStyle = "#500C16";
    ctx.fillRect(item.x + 4, item.y + 4, item.w - 8, item.h - 8);

    // 4. Exhibit artifact inside
    ctx.save();
    ctx.translate(item.x + item.w * 0.5, item.y + item.h * 0.5);
    if (item.label && item.label.includes("CROWN")) {
      ctx.fillStyle = "#F59E0B";
      ctx.strokeStyle = "#FEF08A";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-10, 6);
      ctx.lineTo(-12, -4);
      ctx.lineTo(-6, 0);
      ctx.lineTo(0, -7);
      ctx.lineTo(6, 0);
      ctx.lineTo(12, -4);
      ctx.lineTo(10, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Jewels
      ctx.fillStyle = "#EF4444";
      ctx.beginPath();
      ctx.arc(0, -1, 1.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Golden urn / relic
      ctx.fillStyle = "#D4AF37";
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FFFBEB";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    // 5. Diagonal specular glass reflection sheen
    ctx.save();
    ctx.beginPath();
    ctx.rect(item.x, item.y, item.w, item.h);
    ctx.clip();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(item.x - 10, item.y + item.h + 10);
    ctx.lineTo(item.x + item.w + 10, item.y - 10);
    ctx.stroke();

    ctx.strokeStyle = "rgba(200, 240, 255, 0.15)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(item.x - 2, item.y + item.h + 10);
    ctx.lineTo(item.x + item.w + 18, item.y - 10);
    ctx.stroke();

    ctx.restore();

    // 6. Brass corner brackets
    ctx.fillStyle = "#D4AF37";
    ctx.fillRect(item.x - 1, item.y - 1, 4, 4);
    ctx.fillRect(item.x + item.w - 3, item.y - 1, 4, 4);
    ctx.fillRect(item.x - 1, item.y + item.h - 3, 4, 4);
    ctx.fillRect(item.x + item.w - 3, item.y + item.h - 3, 4, 4);

    ctx.restore();
  }

  /**
   * Renders fluted classical marble columns with square plinths.
   */
  renderColumn(ctx, item) {
    ctx.save();

    // 1. Drop shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(item.x + 5, item.y + 5, item.w, item.h);

    // 2. Square plinth base
    ctx.fillStyle = "#162335";
    ctx.fillRect(item.x, item.y, item.w, item.h);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(item.x, item.y, item.w, item.h);

    // 3. Circular shaft
    const cx = item.x + item.w * 0.5;
    const cy = item.y + item.h * 0.5;
    const r = item.w * 0.38;

    ctx.fillStyle = "#263B54";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#64748B";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 4. Fluted grooves
    ctx.strokeStyle = "rgba(180, 225, 255, 0.25)";
    ctx.lineWidth = 1;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      ctx.beginPath();
      ctx.arc(cx, cy, r - 2, a - 0.2, a + 0.2);
      ctx.stroke();
    }

    // 5. Center specular highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 3, r * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Renders detailed 2.5D server rack with vents, cabling, and blinking LED arrays.
   */
  renderServerRack(ctx, item, time = 0) {
    ctx.save();

    // 1. Drop shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(item.x + 4, item.y + 4, item.w, item.h);

    // 2. Dark gunmetal rack chassis
    ctx.fillStyle = "#0c1522";
    ctx.fillRect(item.x, item.y, item.w, item.h);
    ctx.strokeStyle = "#1E293B";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(item.x, item.y, item.w, item.h);

    // 3. Horizontal server blade divisions
    const blades = 3;
    const bh = item.h / blades;
    for (let b = 0; b < blades; b++) {
      const by = item.y + b * bh;
      ctx.strokeStyle = "#162232";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(item.x, by);
      ctx.lineTo(item.x + item.w, by);
      ctx.stroke();

      // Blade vent slots
      ctx.fillStyle = "#05090f";
      ctx.fillRect(item.x + 6, by + 3, item.w * 0.45, bh - 6);

      // Blinking status LEDs on each blade
      for (let led = 0; led < 4; led++) {
        const lx = item.x + item.w * 0.58 + led * 6;
        const ly = by + bh * 0.5;
        const isBlinking = Math.sin(time * 6 + led * 1.5 + b * 2) > 0.1;
        const ledColor = led === 0 ? (isBlinking ? "#10B981" : "#065F46")
                       : led === 1 ? (isBlinking ? "#00F0FF" : "#0369A1")
                       : led === 2 ? (isBlinking ? "#F59E0B" : "#78350F")
                       : "#10B981";

        ctx.fillStyle = ledColor;
        ctx.beginPath();
        ctx.arc(lx, ly, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. Subtle cyan rack frame edge
    ctx.strokeStyle = "rgba(0, 240, 255, 0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(item.x + 0.5, item.y + 0.5, item.w - 1, item.h - 1);

    ctx.restore();
  }

  /**
   * Renders executive boardroom conference table with surround seating.
   */
  renderBoardroomTable(ctx, item) {
    ctx.save();

    // 1. Table drop shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(item.x + 6, item.y + 6, item.w, item.h);

    // 2. Executive chairs around perimeter
    ctx.fillStyle = "#0F172A";
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;

    // North chairs
    for (let cx = item.x + 16; cx < item.x + item.w - 12; cx += 26) {
      ctx.fillRect(cx - 6, item.y - 9, 12, 6);
      ctx.strokeRect(cx - 6, item.y - 9, 12, 6);
    }
    // South chairs
    for (let cx = item.x + 16; cx < item.x + item.w - 12; cx += 26) {
      ctx.fillRect(cx - 6, item.y + item.h + 3, 12, 6);
      ctx.strokeRect(cx - 6, item.y + item.h + 3, 12, 6);
    }

    // 3. Polished mahogany tabletop
    ctx.fillStyle = "#22110D";
    ctx.fillRect(item.x, item.y, item.w, item.h);

    // Gold inlay perimeter ring
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(item.x + 3, item.y + 3, item.w - 6, item.h - 6);

    // Center leather blotter strip
    ctx.fillStyle = "#150A08";
    ctx.fillRect(item.x + 10, item.y + 8, item.w - 20, item.h - 16);

    // Center glass carafe / documents
    ctx.fillStyle = "rgba(0, 240, 255, 0.35)";
    ctx.beginPath();
    ctx.arc(item.x + item.w * 0.5, item.y + item.h * 0.5, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Renders wall-mounted heavy titanium vault door with spoked locking wheel.
   */
  renderTitaniumVaultDoor(ctx, x, y, radius = 28, time = 0) {
    ctx.save();
    ctx.translate(x, y);

    // 1. Heavy circular steel door frame
    ctx.fillStyle = "#0A131F";
    ctx.beginPath();
    ctx.arc(0, 0, radius + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#38BDF8";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 2. Door locking lugs around perimeter
    ctx.fillStyle = "#64748B";
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const lx = Math.cos(a) * (radius + 4);
      const ly = Math.sin(a) * (radius + 4);
      ctx.fillRect(lx - 2.5, ly - 2.5, 5, 5);
    }

    // 3. Brushed titanium inner hatch
    ctx.fillStyle = "#1E293B";
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 4. Heavy central spoked locking wheel
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    // 4 Spokes
    ctx.lineWidth = 2;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * (radius * 0.45), Math.sin(a) * (radius * 0.45));
      ctx.stroke();
    }

    // Central hub
    ctx.fillStyle = "#FDE68A";
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Renders wall-mounted laser emitter casing with glowing ruby diode.
   */
  renderLaserEmitter(ctx, x, y, isTripped = false) {
    ctx.save();
    ctx.translate(x, y);

    // Emitter bracket
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(-5, -5, 10, 10);
    ctx.strokeStyle = isTripped ? "#EF4444" : "#475569";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-5, -5, 10, 10);

    // Ruby laser crystal lens
    ctx.fillStyle = isTripped ? "#FF003C" : "#EF4444";
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Hazard warning mark
    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(-3, -4, 6, 1.2);

    ctx.restore();
  }
}
