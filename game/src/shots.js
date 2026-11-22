/**
 * shots.js - Deterministic Screenshot Scenario Staging
 * Sets up 4 authentic, high-impact gameplay scenes for headless capture.
 */

import { HEIST_LEVELS } from './world/levels.js';

export function stageScreenshotScenario(sceneName, worldState) {
  if (sceneName === '01-gallery-stealth' || sceneName === 'start') {
    // Floor 1: Hero stealth frame with all 5 mandatory elements
    worldState.loadFloor(0);
    worldState.thief.x = 420;
    worldState.thief.y = 240;
    worldState.thief.facing = 0.1;
    worldState.thief.isSneaking = true;
    worldState.alarmSystem.forceState("GHOST", 8);

    // Position guard 1 in Rotunda with cone visible
    if (worldState.guards[0]) {
      worldState.guards[0].x = 640;
      worldState.guards[0].y = 150;
      worldState.guards[0].facing = Math.PI * 0.9;
      worldState.guards[0].state = "PATROL";
    }
    // Position guard 2 in Classical Wing
    if (worldState.guards[1]) {
      worldState.guards[1].x = 240;
      worldState.guards[1].y = 180;
      worldState.guards[1].facing = -Math.PI * 0.4;
      worldState.guards[1].state = "PATROL";
    }

    // Camera pointing across rotunda
    if (worldState.cameraSystem.cameras[0]) {
      worldState.cameraSystem.cameras[0].currentAngle = Math.PI * 0.45;
    }

    // Footstep breadcrumb trail
    worldState.thief.footsteps = [
      { x: 380, y: 240, facing: 0, alpha: 0.8 },
      { x: 340, y: 240, facing: 0, alpha: 0.6 },
      { x: 300, y: 240, facing: 0, alpha: 0.4 }
    ];
  } else if (sceneName === '02-gadget-distraction' || sceneName === 'gadget') {
    // Floor 2: Gadget / EMP and Decoy distraction
    worldState.loadFloor(1);
    worldState.thief.x = 340;
    worldState.thief.y = 200;
    worldState.thief.facing = 0.2;
    worldState.thief.isSneaking = true;
    worldState.alarmSystem.forceState("SUSPICIOUS", 52);

    // Guard investigating decoy coin
    if (worldState.guards[0]) {
      worldState.guards[0].x = 520;
      worldState.guards[0].y = 130;
      worldState.guards[0].facing = -Math.PI * 0.85;
      worldState.guards[0].state = "INVESTIGATING";
      worldState.guards[0].investigateTarget = { x: 440, y: 90 };
    }

    // Active sound ripple from decoy coin
    worldState.gadgetManager.soundRipples = [
      { x: 440, y: 90, radius: 85, maxRadius: 220, alpha: 0.85, speed: 0, active: true },
      { x: 440, y: 90, radius: 45, maxRadius: 220, alpha: 0.95, speed: 0, active: true }
    ];

    // EMP flash shockwave disabling camera
    worldState.gadgetManager.empFlashes = [
      { x: 670, y: 440, radius: 95, maxRadius: 260, alpha: 0.85 }
    ];
    if (worldState.cameraSystem.cameras[1]) {
      worldState.cameraSystem.cameras[1].disabledTimer = 4.5;
    }
  } else if (sceneName === '03-vault-lockdown' || sceneName === 'lockdown') {
    // Floor 3: High-alert vault extraction & red lockdown
    worldState.loadFloor(2);
    worldState.thief.x = 880;
    worldState.thief.y = 220;
    worldState.thief.facing = -Math.PI * 0.9;
    worldState.thief.hasLoot = true;
    worldState.alarmSystem.forceState("LOCKDOWN", 92);

    // Guards pursuing thief
    if (worldState.guards[0]) {
      worldState.guards[0].x = 640;
      worldState.guards[0].y = 160;
      worldState.guards[0].facing = 0.2;
      worldState.guards[0].state = "ALERT";
    }
    if (worldState.guards[1]) {
      worldState.guards[1].x = 760;
      worldState.guards[1].y = 320;
      worldState.guards[1].facing = -0.4;
      worldState.guards[1].state = "ALERT";
    }

    // Dense smoke cloud deployed to block pursuit
    worldState.gadgetManager.smokeClouds = [
      { x: 780, y: 220, radius: 72, alpha: 0.88, timer: 6.0, maxDuration: 8.0, active: true }
    ];
  } else if (sceneName === '04-penthouse-extraction' || sceneName === 'extraction') {
    // Floor 3: Safe cracked, tactical exfil underway
    worldState.loadFloor(2);
    worldState.thief.x = 180;
    worldState.thief.y = 370;
    worldState.thief.facing = Math.PI;
    worldState.thief.hasLoot = true;
    worldState.alarmSystem.forceState("GHOST", 22);

    // Exfil point glowing
    worldState.thief.footsteps = [
      { x: 320, y: 370, facing: Math.PI, alpha: 0.8 },
      { x: 480, y: 350, facing: Math.PI, alpha: 0.6 },
      { x: 680, y: 300, facing: Math.PI, alpha: 0.5 },
      { x: 920, y: 240, facing: Math.PI, alpha: 0.4 }
    ];
  }
}
