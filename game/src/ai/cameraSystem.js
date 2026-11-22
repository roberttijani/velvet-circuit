/**
 * cameraSystem.js - Sweeping Wall-Mounted Security Camera System
 * Handles sinusoidal sweep motions, EMP disruption, digital scanline beam projection, and alarm detection.
 */

import { hasLineOfSight } from '../world/raycast.js';

export class CameraSystem {
  constructor(cameraConfigs = []) {
    this.cameras = cameraConfigs.map(c => ({
      id: c.id,
      x: c.x,
      y: c.y,
      mountAngle: c.mountAngle,
      sweepAngle: c.sweepAngle || 1.1,
      sweepSpeed: c.sweepSpeed || 0.85,
      range: c.range || 230,
      fov: c.fov || 0.8,
      currentAngle: c.mountAngle,
      disabledTimer: 0,
      alerted: false,
      sweepTimer: Math.random() * 5
    }));
  }

  update(dt, thief, wallSegments, smokeClouds, alarmSystem, guards, audioEngine) {
    for (let cam of this.cameras) {
      if (cam.disabledTimer > 0) {
        cam.disabledTimer -= dt;
        cam.alerted = false;
        continue;
      }

      // Sweep motion oscillation
      cam.sweepTimer += dt * cam.sweepSpeed;
      cam.currentAngle = cam.mountAngle + Math.sin(cam.sweepTimer) * (cam.sweepAngle * 0.5);

      // Vision check against thief
      const dx = thief.x - cam.x;
      const dy = thief.y - cam.y;
      const dist = Math.hypot(dx, dy);

      let detected = false;
      if (dist <= cam.range) {
        const angleToThief = Math.atan2(dy, dx);
        let diff = (angleToThief - cam.currentAngle + Math.PI * 3) % (Math.PI * 2) - Math.PI;

        if (Math.abs(diff) <= cam.fov * 0.5) {
          detected = hasLineOfSight(cam.x, cam.y, thief.x, thief.y, wallSegments, smokeClouds);
        }
      }

      if (detected) {
        if (!cam.alerted) {
          cam.alerted = true;
          alarmSystem.triggerDetection("CCTV INTRUDER CONFIRMED", 35);
          if (audioEngine) audioEngine.playAlarmAlert();

          // Alert nearest guard
          for (let g of guards) {
            g.hearSound(cam.x, cam.y, 400);
          }
        }
      } else {
        cam.alerted = false;
      }
    }
  }

  disableInRadius(x, y, radius, duration) {
    let affected = 0;
    for (let cam of this.cameras) {
      const dist = Math.hypot(cam.x - x, cam.y - y);
      if (dist <= radius) {
        cam.disabledTimer = duration;
        cam.alerted = false;
        affected++;
      }
    }
    return affected;
  }
}
