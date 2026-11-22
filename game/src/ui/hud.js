/**
 * hud.js - Diegetic Tactical Blueprint HUD & Alarm Meter
 * Displays mission status, objectives, tactical inventory, and the bold 3-stage Alarm Meter.
 */

export class GameHUD {
  constructor(width = 1280, height = 480) {
    this.width = width;
    this.height = height;
  }

  render(ctx, level, thief, alarmSystem, gadgetManager, audioEngine) {
    ctx.save();

    // 1. Top HUD Bar Background
    ctx.fillStyle = "rgba(7, 12, 22, 0.90)";
    ctx.fillRect(0, 0, this.width, 36);
    ctx.strokeStyle = "rgba(0, 240, 255, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 36);
    ctx.lineTo(this.width, 36);
    ctx.stroke();

    // 2. Top-Left: Mission & Sector Blueprint Header
    ctx.font = "bold 11px 'Courier New', monospace";
    ctx.fillStyle = "#00F0FF";
    ctx.fillText(`VELVET CIRCUIT // ${level.name}`, 14, 15);
    ctx.font = "9px 'Courier New', monospace";
    ctx.fillStyle = "rgba(148, 163, 184, 0.85)";
    ctx.fillText(`${level.subtitle} [${level.blueprintCode}]`, 14, 28);

    // 3. Top-Center: BOLD ALARM METER (Ghost / Suspicious / Lockdown)
    this.renderAlarmMeter(ctx, alarmSystem);

    // 4. Top-Right: Tactical Gadget Inventory
    this.renderGadgetBar(ctx, gadgetManager);

    // 5. Bottom Status Bar
    this.renderBottomBar(ctx, thief, level, audioEngine);

    // 6. Interaction Progress Wheel
    if (thief.interacting && thief.interactProgress > 0) {
      this.renderInteractionWheel(ctx, thief);
    }

    ctx.restore();
  }

  renderAlarmMeter(ctx, alarmSystem) {
    const cx = this.width * 0.5;
    const meterW = 260;
    const meterH = 14;
    const startX = cx - meterW * 0.5;
    const startY = 16;

    // Alarm State Badge
    ctx.font = "bold 11px 'Courier New', monospace";
    const stateColor = alarmSystem.getColor();
    ctx.fillStyle = stateColor;
    const stateLabel = `SECURITY THREAT: [ ${alarmSystem.state} ]`;
    const labelW = ctx.measureText(stateLabel).width;
    ctx.fillText(stateLabel, cx - labelW * 0.5, 12);

    // Meter Background Frame
    ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    ctx.fillRect(startX, startY, meterW, meterH);
    ctx.strokeStyle = stateColor;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(startX, startY, meterW, meterH);

    // Segmented Meter Fill
    const fillW = (alarmSystem.level / 100) * (meterW - 4);
    ctx.fillStyle = stateColor;
    ctx.fillRect(startX + 2, startY + 2, fillW, meterH - 4);

    // Grid divider ticks across meter
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = 1;
    for (let x = startX + 26; x < startX + meterW - 4; x += 26) {
      ctx.beginPath();
      ctx.moveTo(x, startY + 2);
      ctx.lineTo(x, startY + meterH - 2);
      ctx.stroke();
    }

    // Recent Security Feed Message
    ctx.font = "8px 'Courier New', monospace";
    ctx.fillStyle = alarmSystem.state === "LOCKDOWN" ? "#FF003C" : "rgba(226, 232, 240, 0.75)";
    const msg = `LOG: ${alarmSystem.lastAlertMessage}`;
    const msgW = ctx.measureText(msg).width;
    ctx.fillText(msg, cx - msgW * 0.5, 48);
  }

  renderGadgetBar(ctx, gadgetManager) {
    const startX = this.width - 340;
    const y = 8;

    const gadgets = [
      { key: "1", name: "DECOY COIN", count: gadgetManager.inventory.decoy, id: 1 },
      { key: "2", name: "EMP PULSE", count: gadgetManager.inventory.emp, id: 2 },
      { key: "3", name: "SMOKE VEIL", count: gadgetManager.inventory.smoke, id: 3 }
    ];

    gadgets.forEach((g, idx) => {
      const gx = startX + idx * 110;
      const isSelected = gadgetManager.selected === g.id;

      // Slot box
      ctx.fillStyle = isSelected ? "rgba(0, 240, 255, 0.20)" : "rgba(15, 23, 42, 0.6)";
      ctx.fillRect(gx, y, 102, 22);
      ctx.strokeStyle = isSelected ? "#00F0FF" : "rgba(100, 116, 139, 0.5)";
      ctx.lineWidth = isSelected ? 1.5 : 1;
      ctx.strokeRect(gx, y, 102, 22);

      // Label
      ctx.font = "9px 'Courier New', monospace";
      ctx.fillStyle = isSelected ? "#00F0FF" : "#94A3B8";
      ctx.fillText(`[${g.key}] ${g.name}`, gx + 5, y + 14);

      // Count
      ctx.font = "bold 9px 'Courier New', monospace";
      ctx.fillStyle = g.count > 0 ? "#10B981" : "#EF4444";
      ctx.fillText(`x${g.count}`, gx + 82, y + 14);
    });
  }

  renderBottomBar(ctx, thief, level, audioEngine) {
    const by = this.height - 24;

    ctx.fillStyle = "rgba(7, 12, 22, 0.85)";
    ctx.fillRect(0, by, this.width, 24);
    ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, by);
    ctx.lineTo(this.width, by);
    ctx.stroke();

    // Stance Indicator
    ctx.font = "9px 'Courier New', monospace";
    ctx.fillStyle = thief.isSneaking ? "#10B981" : "#00F0FF";
    ctx.fillText(`STANCE: ${thief.isSneaking ? "SNEAK [SILENT]" : "NORMAL [TACTICAL]"}`, 14, by + 15);

    // Objective Status
    ctx.fillStyle = thief.hasLoot ? "#10B981" : "#F59E0B";
    const objText = thief.hasLoot
      ? "OBJECTIVE: LOOT SECURED >> ESCAPE TO EXFIL CHUTE <<"
      : `OBJECTIVE: INFILTRATE VAULT & RETRIEVE ${level.loot.name}`;
    ctx.fillText(objText, 250, by + 15);

    // Controls hint
    ctx.fillStyle = "rgba(148, 163, 184, 0.75)";
    ctx.fillText("CONTROLS: WASD Move | SHIFT Sneak | SPACE/E Hack & Grab | MOUSE Aim/Gadget | [M] Mute", 720, by + 15);
  }

  renderInteractionWheel(ctx, thief) {
    ctx.save();
    ctx.translate(thief.x, thief.y);

    // Outer ring background
    ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();

    // Progress arc
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
