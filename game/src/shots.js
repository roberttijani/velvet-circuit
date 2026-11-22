/**
 * shots.js - Deterministic Screenshot Scenario Staging (v2)
 * Sets up 4 authentic, high-impact gameplay scenes for headless capture:
 * 01: Hero Stealth (Floor 1 with all 5 mandatory elements)
 * 02: Tactical Gadget & Distraction (Floor 2 Mainframe)
 * 03: High-Alert Vault Lockdown (Floor 3 Penthouse)
 * 04: Mission Debrief Scorecard (Tactical debrief & 3-floor contract cards)
 */

export function stageScreenshotScenario(sceneName, worldState) {
  if (sceneName === '01-gallery-stealth' || sceneName === 'start') {
    // Floor 1: Hero stealth frame with all 5 mandatory elements
    worldState.loadFloor(0);
    // Position thief sneaking behind Corinthian column (casts realistic shadow)
    worldState.thief.x = 430;
    worldState.thief.y = 155;
    worldState.thief.facing = 0.2;
    worldState.thief.isSneaking = true;
    worldState.alarmSystem.forceState("GHOST", 8);

    // Guard 1 in Rotunda with volumetric cone sweeping across plinths
    if (worldState.guards[0]) {
      worldState.guards[0].x = 640;
      worldState.guards[0].y = 160;
      worldState.guards[0].facing = Math.PI * 0.95;
      worldState.guards[0].state = "PATROL";
    }
    // Guard 2 in Classical Wing
    if (worldState.guards[1]) {
      worldState.guards[1].x = 240;
      worldState.guards[1].y = 180;
      worldState.guards[1].facing = -Math.PI * 0.45;
      worldState.guards[1].state = "PATROL";
    }

    // Camera pointing across rotunda with cyan scanlines
    if (worldState.cameraSystem.cameras[0]) {
      worldState.cameraSystem.cameras[0].currentAngle = Math.PI * 0.45;
    }

    // Vault laser barrier active
    if (worldState.level.lasers[0]) {
      worldState.level.lasers[0].active = true;
      worldState.level.lasers[0].disabledTimer = 0;
    }

    // Footstep breadcrumb trail
    worldState.thief.footsteps = [
      { x: 390, y: 155, facing: 0, alpha: 0.8 },
      { x: 350, y: 155, facing: 0, alpha: 0.6 },
      { x: 310, y: 155, facing: 0, alpha: 0.4 }
    ];
  } else if (sceneName === '02-gadget-distraction' || sceneName === 'gadget') {
    // Floor 2: Gadget / EMP and Decoy distraction
    worldState.loadFloor(1);
    worldState.thief.x = 320;
    worldState.thief.y = 195;
    worldState.thief.facing = 0.2;
    worldState.thief.isSneaking = true;
    worldState.alarmSystem.forceState("SUSPICIOUS", 52);

    // Guard investigating decoy coin
    if (worldState.guards[0]) {
      worldState.guards[0].x = 510;
      worldState.guards[0].y = 135;
      worldState.guards[0].facing = -Math.PI * 0.85;
      worldState.guards[0].state = "INVESTIGATING";
      worldState.guards[0].investigateTarget = { x: 430, y: 90 };
    }

    // Active sound ripple from decoy coin
    worldState.gadgetManager.soundRipples = [
      { x: 430, y: 90, radius: 85, maxRadius: 220, alpha: 0.85, speed: 0, active: true },
      { x: 430, y: 90, radius: 45, maxRadius: 220, alpha: 0.95, speed: 0, active: true }
    ];

    // EMP flash shockwave disabling camera
    worldState.gadgetManager.empFlashes = [
      { x: 244, y: 50, radius: 88, maxRadius: 240, alpha: 0.90 }
    ];
    if (worldState.cameraSystem.cameras[0]) {
      worldState.cameraSystem.cameras[0].disabledTimer = 4.5;
    }
  } else if (sceneName === '03-vault-lockdown' || sceneName === 'lockdown') {
    // Floor 3: High-alert vault extraction & red lockdown
    worldState.loadFloor(2);
    worldState.thief.x = 830;
    worldState.thief.y = 220;
    worldState.thief.facing = -Math.PI * 0.9;
    worldState.thief.hasLoot = true;
    worldState.alarmSystem.forceState("LOCKDOWN", 92);

    // Guards pursuing thief
    if (worldState.guards[0]) {
      worldState.guards[0].x = 620;
      worldState.guards[0].y = 160;
      worldState.guards[0].facing = 0.25;
      worldState.guards[0].state = "ALERT";
    }
    if (worldState.guards[1]) {
      worldState.guards[1].x = 730;
      worldState.guards[1].y = 310;
      worldState.guards[1].facing = -0.45;
      worldState.guards[1].state = "ALERT";
    }

    // Dense smoke cloud deployed to block pursuit
    worldState.gadgetManager.smokeClouds = [
      { x: 740, y: 220, radius: 72, alpha: 0.88, timer: 6.0, maxDuration: 8.0, active: true }
    ];

    // High voltage laser grid active
    if (worldState.level.lasers[2]) {
      worldState.level.lasers[2].active = true;
      worldState.level.lasers[2].disabledTimer = 0;
    }
  } else if (sceneName === '04-heist-complete' || sceneName === '04-penthouse-extraction' || sceneName === 'extraction') {
    // Floor 3: Mission Debrief Scorecard Overlay
    worldState.loadFloor(2);
    worldState.thief.x = 180;
    worldState.thief.y = 370;
    worldState.thief.facing = Math.PI;
    worldState.thief.hasLoot = true;
    worldState.alarmSystem.forceState("GHOST", 15);
    worldState.showDebriefOverlay = true;
  }
}
