/**
 * alarmSystem.js - Global Security Alarm & Threat Level Engine
 * Tracks GHOST / SUSPICIOUS / LOCKDOWN states, decay, sirens, and strobe alerts.
 */

export class AlarmSystem {
  constructor() {
    this.level = 0; // 0 to 100
    this.state = "GHOST"; // "GHOST" (0-33), "SUSPICIOUS" (34-75), "LOCKDOWN" (76-100)
    this.lastAlertMessage = "SECTOR SECURE // ZERO DETECTION";
    this.alertTimer = 0;
    this.strobe = 0;
  }

  reset() {
    this.level = 0;
    this.state = "GHOST";
    this.lastAlertMessage = "SECTOR SECURE // ZERO DETECTION";
    this.alertTimer = 0;
    this.strobe = 0;
  }

  update(dt, audioEngine) {
    // Alarm decay over time if not in line of sight
    const decayRate = this.state === "LOCKDOWN" ? 1.5 : (this.state === "SUSPICIOUS" ? 3.5 : 5.0);
    this.level = Math.max(0, this.level - dt * decayRate);

    // State thresholds
    if (this.level >= 75) {
      this.state = "LOCKDOWN";
    } else if (this.level >= 34) {
      this.state = "SUSPICIOUS";
    } else {
      this.state = "GHOST";
    }

    if (audioEngine) {
      audioEngine.setTension(this.level);
    }

    // Strobe cycle for lockdown visual effects
    if (this.state === "LOCKDOWN") {
      this.strobe = (this.strobe + dt * 6) % (Math.PI * 2);
    } else {
      this.strobe = 0;
    }

    if (this.alertTimer > 0) {
      this.alertTimer -= dt;
      if (this.alertTimer <= 0 && this.level === 0) {
        this.lastAlertMessage = "SECTOR SECURE // ZERO DETECTION";
      }
    }
  }

  triggerDetection(reason, spikeAmount = 30) {
    this.level = Math.min(100, this.level + spikeAmount);
    this.lastAlertMessage = reason.toUpperCase();
    this.alertTimer = 4.0;

    if (this.level >= 75) {
      this.state = "LOCKDOWN";
    } else if (this.level >= 34) {
      this.state = "SUSPICIOUS";
    }
  }

  forceState(stateName, levelValue) {
    this.state = stateName;
    this.level = levelValue;
    if (stateName === "LOCKDOWN") {
      this.lastAlertMessage = "EMERGENCY PROTOCOL // LOCKDOWN ACTIVE";
    } else if (stateName === "SUSPICIOUS") {
      this.lastAlertMessage = "ANOMALY DETECTED // PATROLS ALERTED";
    } else {
      this.lastAlertMessage = "SECTOR SECURE // ZERO DETECTION";
    }
  }

  getColor() {
    if (this.state === "LOCKDOWN") return "#FF003C";
    if (this.state === "SUSPICIOUS") return "#F59E0B";
    return "#10B981"; // Ghost cyan-green
  }
}
