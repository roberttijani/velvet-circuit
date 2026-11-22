/**
 * guardFSM.js - Guard AI Finite State Machine & Patrol Engine
 * Controls patrol navigation, audio suspicion, investigation, and vision detection.
 */

import { hasLineOfSight } from '../world/raycast.js';

export class GuardFSM {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.x = config.x;
    this.y = config.y;
    this.facing = config.facing || 0;
    this.speed = config.speed || 60;
    this.viewDist = config.viewDist || 210;
    this.fov = config.fov || 1.25;
    this.patrol = config.patrol || [];
    this.currentWaypoint = 0;
    this.waitTimer = 0;

    // States: "PATROL", "SUSPICIOUS", "INVESTIGATING", "ALERT"
    this.state = "PATROL";
    this.investigateTarget = null;
    this.investigateTimer = 0;
    this.seeThiefTimer = 0;
    this.searchScanAngle = 0;
  }

  update(dt, thief, wallSegments, smokeClouds, alarmSystem, audioEngine) {
    // 1. Vision Check against thief
    const canSeeThief = this.checkVision(thief, wallSegments, smokeClouds);

    if (canSeeThief) {
      this.seeThiefTimer += dt;
      // If sneaking in shadows, detection takes slightly longer than running
      const detectThreshold = thief.isSneaking ? 0.45 : 0.15;
      if (this.seeThiefTimer >= detectThreshold) {
        if (this.state !== "ALERT") {
          this.state = "ALERT";
          alarmSystem.triggerDetection("GUARD VISUAL CONTACT", 45);
          if (audioEngine) audioEngine.playAlarmAlert();
        }
        // Turn directly to face thief
        this.facing = Math.atan2(thief.y - this.y, thief.x - this.x);
        this.investigateTarget = { x: thief.x, y: thief.y };
      }
    } else {
      this.seeThiefTimer = Math.max(0, this.seeThiefTimer - dt * 1.5);
      if (this.state === "ALERT" && this.seeThiefTimer <= 0) {
        // Lost visual, transition to investigating last known position
        this.state = "INVESTIGATING";
        this.investigateTimer = 4.0;
      }
    }

    // 2. FSM Execution
    switch (this.state) {
      case "PATROL":
        this.updatePatrol(dt);
        break;

      case "SUSPICIOUS":
        this.updateSuspicious(dt);
        break;

      case "INVESTIGATING":
        this.updateInvestigating(dt);
        break;

      case "ALERT":
        this.updateAlert(dt, thief, wallSegments);
        break;
    }
  }

  checkVision(thief, wallSegments, smokeClouds) {
    const dx = thief.x - this.x;
    const dy = thief.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > this.viewDist) return false;

    // Angle check
    const angleToThief = Math.atan2(dy, dx);
    let diff = (angleToThief - this.facing + Math.PI * 3) % (Math.PI * 2) - Math.PI;

    if (Math.abs(diff) > this.fov * 0.5) return false;

    // Occlusion check
    return hasLineOfSight(this.x, this.y, thief.x, thief.y, wallSegments, smokeClouds);
  }

  updatePatrol(dt) {
    if (this.patrol.length === 0) return;

    if (this.waitTimer > 0) {
      this.waitTimer -= dt;
      // Gentle head sweep while waiting
      this.facing += Math.sin(this.waitTimer * 2.5) * dt * 0.4;
      return;
    }

    const target = this.patrol[this.currentWaypoint];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 8) {
      this.x = target.x;
      this.y = target.y;
      this.waitTimer = target.wait || 1.5;
      this.currentWaypoint = (this.currentWaypoint + 1) % this.patrol.length;
    } else {
      const targetAngle = Math.atan2(dy, dx);
      this.facing = this.smoothRotate(this.facing, targetAngle, dt * 5);
      this.x += Math.cos(this.facing) * this.speed * dt;
      this.y += Math.sin(this.facing) * this.speed * dt;
    }
  }

  updateSuspicious(dt) {
    if (this.investigateTarget) {
      const dx = this.investigateTarget.x - this.x;
      const dy = this.investigateTarget.y - this.y;
      const targetAngle = Math.atan2(dy, dx);
      this.facing = this.smoothRotate(this.facing, targetAngle, dt * 7);
    }
    this.investigateTimer -= dt;
    if (this.investigateTimer <= 0) {
      this.state = "INVESTIGATING";
      this.investigateTimer = 5.0;
    }
  }

  updateInvestigating(dt) {
    if (!this.investigateTarget) {
      this.state = "PATROL";
      return;
    }

    const dx = this.investigateTarget.x - this.x;
    const dy = this.investigateTarget.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 16) {
      const targetAngle = Math.atan2(dy, dx);
      this.facing = this.smoothRotate(this.facing, targetAngle, dt * 6);
      this.x += Math.cos(this.facing) * (this.speed * 1.1) * dt;
      this.y += Math.sin(this.facing) * (this.speed * 1.1) * dt;
    } else {
      // Arrived at disturbance location, search around
      this.investigateTimer -= dt;
      this.facing += dt * 1.8;
      if (this.investigateTimer <= 0) {
        this.state = "PATROL";
        this.investigateTarget = null;
      }
    }
  }

  updateAlert(dt, thief) {
    // Aggressive pursuit towards thief
    const dx = thief.x - this.x;
    const dy = thief.y - this.y;
    const targetAngle = Math.atan2(dy, dx);
    this.facing = this.smoothRotate(this.facing, targetAngle, dt * 8);

    const dist = Math.hypot(dx, dy);
    if (dist > 20) {
      this.x += Math.cos(this.facing) * (this.speed * 1.35) * dt;
      this.y += Math.sin(this.facing) * (this.speed * 1.35) * dt;
    }
  }

  hearSound(noiseX, noiseY, noiseRadius) {
    const dist = Math.hypot(noiseX - this.x, noiseY - this.y);
    if (dist <= noiseRadius) {
      if (this.state !== "ALERT") {
        this.state = "SUSPICIOUS";
        this.investigateTarget = { x: noiseX, y: noiseY };
        this.investigateTimer = 1.0;
      }
      return true;
    }
    return false;
  }

  smoothRotate(current, target, rate) {
    let diff = (target - current + Math.PI * 3) % (Math.PI * 2) - Math.PI;
    return current + diff * Math.min(1, rate);
  }
}
