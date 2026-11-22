/**
 * hud.js - Studio Obsidian Glass Tactical HUD & Threat System (v4)
 * Features:
 * - Translucent obsidian glass panels with gold and cyan architectural trim
 * - Live Heist Valuation Counter ($62,500,000)
 * - 10-Segment high-contrast LED Alarm Meter (GHOST / SUSPICIOUS / LOCKDOWN)
 * - Canvas vector icons for Gadgets (Coin, EMP, Smoke)
 * - Embedded real-time Tactical Minimap pod
 */

import { TacticalMinimap } from './minimap.js';

export class GameHUD {
  constructor(width = 1280, height = 480) {
    this.width = width;
    this.height = height;
    this.minimap = new TacticalMinimap(this.width - 128, 4, 116, 32);
    this.time = 0;
  }

  render(ctx, level, thief, alarmSystem, gadgetManager, audioEngine, guards = []) {
    this.time += 0.016;
    ctx.save();

    // 1. Top HUD Bar Background (Obsidian Glass)
    ctx.fillStyle = "rgba(6, 11, 20, 0.95)";
    ctx.fillRect(0, 0, this.width, 40);

    // Bottom border with gold & cyan accent
    ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(this.width, 40);
    ctx.stroke();

    ctx.strokeStyle = "rgba(245, 158, 11, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 41);
    ctx.lineTo(this.width, 41);
    ctx.stroke();

    // 2. Top-Left: Mission & Sector Blueprint Header
    ctx.font = "bold 11px 'Courier New', monospace";
    ctx.fillStyle = "#00F0FF";
    ctx.fillText(`VELVET CIRCUIT // ${level.name}`, 14, 16);

    ctx.font = "8.5px 'Courier New', monospace";
    ctx.fillStyle = "rgba(148, 163, 184, 0.90)";
    ctx.fillText(`${level.subtitle} [${level.blueprintCode}]`, 14, 30);

    // 3. Heist Valuation Counter
    this.renderLootValuation(ctx, level, thief);

    // 4. Top-Center: BOLD SEGMENTED ALARM METER
    this.renderAlarmMeter(ctx, alarmSystem);

    // 5. Tactical Gadget Inventory with Canvas Vector Icons
    this.renderGadgetBar(ctx, gadgetManager);

    // 6. Tactical Minimap Radar Pod
    this.minimap.render(ctx, level, thief, guards, this.time);

    // 7. Bottom Status Bar
    this.renderBottomBar(ctx, thief, level, audioEngine);

    // 8. Interaction Progress Wheel
    if (thief.interacting && thief.interactProgress > 0) {
      this.renderInteractionWheel(ctx, thief);
    }

    ctx.restore();
  }

  renderLootValuation(ctx, level, thief) {
    const vx = 300;
    const vy = 8;
    const vw = 145;
    const vh = 24;

    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fillRect(vx, vy, vw, vh);
    ctx.strokeStyle = thief.hasLoot ? "#F59E0B" : "rgba(100, 116, 139, 0.55)";
    ctx.lineWidth = 1;
    ctx.strokeRect(vx, vy, vw, vh);

    ctx.font = "bold 7px 'Courier New', monospace";
    ctx.fillStyle = thief.hasLoot ? "#10B981" : "#94A3B8";
    ctx.fillText(thief.hasLoot ? "[ LOOT SECURED ]" : "[ TARGET VALUATION ]", vx + 8, vy + 9.5);

    ctx.font = "bold 10px 'Courier New', monospace";
    ctx.fillStyle = "#F59E0B";
    const valText = level.lootValue || "$62,500,000";
    ctx.fillText(valText, vx + 8, vy + 20.5);
  }

  renderAlarmMeter(ctx, alarmSystem) {
    const cx = 575;
    const meterW = 220;
    const meterH = 12;
    const startX = cx - meterW * 0.5;
    const startY = 19;

    // Alarm State Badge
    ctx.font = "bold 10px 'Courier New', monospace";
    const stateColor = alarmSystem.getColor();
    ctx.fillStyle = stateColor;
    const stateLabel = `SECURITY THREAT: [ ${alarmSystem.state} ]`;
    const labelW = ctx.measureText(stateLabel).width;
    ctx.fillText(stateLabel, cx - labelW * 0.5, 13);

    // Meter Background Frame
    ctx.fillStyle = "rgba(10, 16, 26, 0.95)";
    ctx.fillRect(startX, startY, meterW, meterH);
    ctx.strokeStyle = stateColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(startX, startY, meterW, meterH);

    // 10 High-Contrast LED Segment Blocks
    const totalSegments = 10;
    const activeSegments = Math.round((alarmSystem.level / 100) * totalSegments);
    const segGap = 2;
    const segW = (meterW - 4 - (totalSegments - 1) * segGap) / totalSegments;

    for (let i = 0; i < totalSegments; i++) {
      const sx = startX + 2 + i * (segW + segGap);
      const sy = startY + 2;
      const isActive = i < activeSegments;

      if (isActive) {
        ctx.fillStyle = stateColor;
        ctx.fillRect(sx, sy, segW, meterH - 4);
      } else {
        ctx.fillStyle = "rgba(30, 41, 59, 0.5)";
        ctx.fillRect(sx, sy, segW, meterH - 4);
      }
    }

    // Recent Security Feed Message
    ctx.font = "7.5px 'Courier New', monospace";
    ctx.fillStyle = alarmSystem.state === "LOCKDOWN" ? "#FF003C" : "rgba(226, 232, 240, 0.75)";
    const msg = `LOG: ${alarmSystem.lastAlertMessage}`;
    const msgW = ctx.measureText(msg).width;
    ctx.fillText(msg, cx - msgW * 0.5, 49);
  }

  renderGadgetBar(ctx, gadgetManager) {
    const startX = 705;
    const y = 6;

    const gadgets = [
      { key: "1", name: "DECOY", count: gadgetManager.inventory.decoy, id: 1, type: "coin" },
      { key: "2", name: "EMP", count: gadgetManager.inventory.emp, id: 2, type: "emp" },
      { key: "3", name: "SMOKE", count: gadgetManager.inventory.smoke, id: 3, type: "smoke" }
    ];

    gadgets.forEach((g, idx) => {
      const gx = startX + idx * 88;
      const isSelected = gadgetManager.selected === g.id;

      // Slot box
      ctx.fillStyle = isSelected ? "rgba(0, 240, 255, 0.20)" : "rgba(15, 23, 42, 0.75)";
      ctx.fillRect(gx, y, 82, 28);
      ctx.strokeStyle = isSelected ? "#00F0FF" : "rgba(100, 116, 139, 0.55)";
      ctx.lineWidth = isSelected ? 1.5 : 1;
      ctx.strokeRect(gx, y, 82, 28);

      // Vector Icon
      this.renderGadgetIcon(ctx, gx + 13, y + 14, g.type, isSelected);

      // Label
      ctx.font = "bold 8px 'Courier New', monospace";
      ctx.fillStyle = isSelected ? "#00F0FF" : "#94A3B8";
      ctx.fillText(`[${g.key}] ${g.name}`, gx + 25, y + 13);

      // Count
      ctx.font = "bold 8.5px 'Courier New', monospace";
      ctx.fillStyle = g.count > 0 ? "#10B981" : "#EF4444";
      ctx.fillText(`x${g.count}`, gx + 25, y + 23);
    });
  }

  /**
   * Renders custom canvas vector icons for gadgets.
   */
  renderGadgetIcon(ctx, x, y, type, isSelected) {
    ctx.save();
    ctx.translate(x, y);

    const col = isSelected ? "#00F0FF" : "#CBD5E1";

    if (type === "coin") {
      // Golden coin with sound wave arc
      ctx.fillStyle = "#F59E0B";
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FEF08A";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Mini sound arc
      ctx.strokeStyle = "#F59E0B";
      ctx.beginPath();
      ctx.arc(0, 0, 8, -0.6, 0.6);
      ctx.stroke();
    } else if (type === "emp") {
      // Lightning bolt
      ctx.fillStyle = "#00F0FF";
      ctx.beginPath();
      ctx.moveTo(-1, -6);
      ctx.lineTo(3, -1);
      ctx.lineTo(0, 0);
      ctx.lineTo(2, 6);
      ctx.lineTo(-3, 1);
      ctx.lineTo(-1, 0);
      ctx.closePath();
      ctx.fill();
    } else if (type === "smoke") {
      // Aerosol grenade canister
      ctx.fillStyle = "#94A3B8";
      ctx.fillRect(-3, -4, 6, 9);
      ctx.strokeStyle = col;
      ctx.lineWidth = 1;
      ctx.strokeRect(-3, -4, 6, 9);

      // Swirling cloud ring
      ctx.strokeStyle = "rgba(226, 232, 240, 0.75)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, -1, 6, 0, Math.PI * 1.5);
      ctx.stroke();
    }

    ctx.restore();
  }

  renderBottomBar(ctx, thief, level, audioEngine) {
    const by = this.height - 24;

    ctx.fillStyle = "rgba(6, 11, 20, 0.95)";
    ctx.fillRect(0, by, this.width, 24);
    ctx.strokeStyle = "rgba(0, 240, 255, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, by);
    ctx.lineTo(this.width, by);
    ctx.stroke();

    // Stance Indicator
    ctx.font = "bold 9px 'Courier New', monospace";
    ctx.fillStyle = thief.isSneaking ? "#10B981" : "#00F0FF";
    ctx.fillText(`STANCE: ${thief.isSneaking ? "SNEAK [SILENT]" : "NORMAL [TACTICAL]"}`, 14, by + 15);

    // Objective Status
    ctx.fillStyle = thief.hasLoot ? "#10B981" : "#F59E0B";
    const objText = thief.hasLoot
      ? "OBJECTIVE: LOOT SECURED >> ESCAPE TO EXFIL CHUTE <<"
      : `OBJECTIVE: INFILTRATE VAULT & RETRIEVE ${level.loot.name}`;
    ctx.fillText(objText, 250, by + 15);

    // Controls hint
    ctx.fillStyle = "rgba(148, 163, 184, 0.85)";
    ctx.fillText("WASD Move | SHIFT Sneak | SPACE/E Hack & Grab | 1-3 Gadgets | CLICK Deploy | [M] Audio", 710, by + 15);
  }

  renderInteractionWheel(ctx, thief) {
    ctx.save();
    ctx.translate(thief.x, thief.y);

    ctx.strokeStyle = "rgba(0, 0, 0, 0.65)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 20, -Math.PI / 2, -Math.PI / 2 + thief.interactProgress * Math.PI * 2);
    ctx.stroke();

    ctx.font = "bold 8px 'Courier New', monospace";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("HACKING...", -22, -26);

    ctx.restore();
  }
}
