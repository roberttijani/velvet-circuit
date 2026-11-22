/**
 * shots.js - Deterministic Screenshot Scenario Staging (v5)
 * Sets up 4 authentic, high-impact gameplay scenes at 1.65x cinematic tactical scale:
 * 01: Hero Stealth (Floor 1 with ALL 5 required elements + pillar shadows + radio callout)
 * 02: Tactical Gadget & Distraction (Floor 2 Mainframe with live circular Hack Ring + EMP + Decoy)
 * 03: High-Alert Vault Lockdown (Floor 3 Penthouse with breached titanium safe + smoke veil)
 * 04: Heist Complete Split-Screen (Left 52% live extraction climax, Right 48% S-Rank scorecard)
 */

export function stageScreenshotScenario(sceneName, worldState) {
  if (sceneName === '01-gallery-stealth' || sceneName === 'start') {
    // Floor 1: Hero stealth frame with ALL 5 mandatory elements in frame
    worldState.loadFloor(0);

    // Position thief sneaking behind Corinthian column cover outside camera & guard cones
    worldState.thief.x = 490;
    worldState.thief.y = 210;
    worldState.thief.facing = 0.15;
    worldState.thief.isSneaking = true;
    worldState.alarmSystem.forceState("GHOST", 8);

    // Guard 1 in Rotunda sweeping southwest across plinths with radio chatter
    if (worldState.guards[0]) {
      worldState.guards[0].x = 660;
      worldState.guards[0].y = 175;
      worldState.guards[0].facing = Math.PI * 0.78;
      worldState.guards[0].state = "PATROL";
      worldState.guards[0].radioCallout = "Checking sector...";
    }
    // Guard 2 in Classical Wing
    if (worldState.guards[1]) {
      worldState.guards[1].x = 240;
      worldState.guards[1].y = 180;
      worldState.guards[1].facing = -Math.PI * 0.45;
      worldState.guards[1].state = "PATROL";
    }

    // Camera pointing south across rotunda with cyan scanlines
    if (worldState.cameraSystem.cameras[0]) {
      worldState.cameraSystem.cameras[0].currentAngle = Math.PI * 0.58;
      worldState.cameraSystem.cameras[0].disabledTimer = 0;
    }
    if (worldState.cameraSystem.cameras[1]) {
      worldState.cameraSystem.cameras[1].currentAngle = -Math.PI * 0.65;
      worldState.cameraSystem.cameras[1].disabledTimer = 0;
    }

    // Vault laser barrier active guarding R-05
    if (worldState.level.lasers[0]) {
      worldState.level.lasers[0].active = true;
      worldState.level.lasers[0].disabledTimer = 0;
    }

    // Footstep breadcrumb trail
    worldState.thief.footsteps = [
      { x: 445, y: 210, facing: 0, alpha: 0.8 },
      { x: 405, y: 210, facing: 0, alpha: 0.6 },
      { x: 365, y: 210, facing: 0, alpha: 0.4 }
    ];

    // Frame camera smoothly at 1.28x zoom capturing all 5 elements (Thief, Guards, Camera, Vault Loot, HUD)
    worldState.camera.setZoom(1.28);
    worldState.camera.setFocus(760, 240, true);

  } else if (sceneName === '02-gadget-distraction' || sceneName === 'gadget') {
    // Floor 2: Gadget / EMP and Decoy distraction + Interactive Hack Ring
    worldState.loadFloor(1);
    worldState.thief.x = 380;
    worldState.thief.y = 125;
    worldState.thief.facing = 0.0;
    worldState.thief.isSneaking = true;
    worldState.alarmSystem.forceState("SUSPICIOUS", 52);

    // Active Hack Minigame Ring on terminal in aisle (safe clearance from S-03)
    worldState.hackRingActive = true;
    worldState.hackRingTarget = { x: 380, y: 125 };
    worldState.hackRingProgress = 0.68;
    worldState.hackRingLabel = "BYPASS CIPHER";

    // Guard investigating decoy coin with tactical radio callout
    if (worldState.guards[0]) {
      worldState.guards[0].x = 590;
      worldState.guards[0].y = 145;
      worldState.guards[0].facing = -Math.PI * 0.85;
      worldState.guards[0].state = "INVESTIGATING";
      worldState.guards[0].investigateTarget = { x: 510, y: 115 };
      worldState.guards[0].radioCallout = "Noise in North!";
    }

    // Lower guard in S-04 facing left
    if (worldState.guards[2]) {
      worldState.guards[2].x = 830;
      worldState.guards[2].y = 260;
      worldState.guards[2].facing = -Math.PI * 0.70;
      worldState.guards[2].state = "PATROL";
    }

    // Active sound ripple from decoy coin
    worldState.gadgetManager.soundRipples = [
      { x: 510, y: 115, radius: 70, maxRadius: 180, alpha: 0.85, speed: 0, active: true },
      { x: 510, y: 115, radius: 36, maxRadius: 180, alpha: 0.95, speed: 0, active: true }
    ];

    // EMP flash shockwave disabling camera (fully inside map, arcing over CAM_2A)
    worldState.gadgetManager.empFlashes = [
      { x: 252, y: 145, radius: 60, maxRadius: 180, alpha: 0.92 }
    ];
    if (worldState.cameraSystem.cameras[0]) {
      worldState.cameraSystem.cameras[0].disabledTimer = 4.5;
    }

    // Frame camera on the tactical action at 1.32x zoom
    worldState.camera.setZoom(1.32);
    worldState.camera.setFocus(510, 220, true);

  } else if (sceneName === '03-vault-lockdown' || sceneName === 'lockdown') {
    // Floor 3: High-alert vault extraction & red lockdown at 1.32x zoom
    worldState.loadFloor(2);
    worldState.thief.x = 880;
    worldState.thief.y = 240;
    worldState.thief.facing = -Math.PI * 0.95;
    worldState.thief.hasLoot = true;
    worldState.alarmSystem.forceState("LOCKDOWN", 92);

    // Guards pursuing thief (Guard 0 leads shout, Guard 1 alert pip)
    if (worldState.guards[0]) {
      worldState.guards[0].x = 730;
      worldState.guards[0].y = 180;
      worldState.guards[0].facing = 0.25;
      worldState.guards[0].state = "ALERT";
      worldState.guards[0].radioCallout = "LOCKDOWN — VAULT BREACHED!";
    }
    if (worldState.guards[1]) {
      worldState.guards[1].x = 750;
      worldState.guards[1].y = 300;
      worldState.guards[1].facing = -0.40;
      worldState.guards[1].state = "ALERT";
      worldState.guards[1].radioCallout = null;
    }

    // Dense smoke cloud deployed to block pursuit
    worldState.gadgetManager.smokeClouds = [
      { x: 920, y: 240, radius: 76, alpha: 0.90, timer: 6.0, maxDuration: 8.0, active: true }
    ];

    // High voltage laser grid active
    if (worldState.level.lasers[2]) {
      worldState.level.lasers[2].active = true;
      worldState.level.lasers[2].disabledTimer = 0;
    }

    // Frame camera on the tense vault corridor and breached master safe
    worldState.camera.setZoom(1.30);
    worldState.camera.setFocus(920, 240, true);

  } else if (sceneName === '04-heist-complete' || sceneName === '04-penthouse-extraction' || sceneName === 'extraction') {
    // Floor 3: Split-Screen Heist Complete Climax (Left 52% extraction, Right 48% S-Rank scorecard)
    worldState.loadFloor(2);
    worldState.thief.x = 105;
    worldState.thief.y = 365;
    worldState.thief.facing = Math.PI;
    worldState.thief.hasLoot = true;
    worldState.alarmSystem.forceState("GHOST", 15);

    // Camera focused on extraction zone in left split
    worldState.camera.setZoom(1.35);
    worldState.camera.setFocus(140, 360, true);

    worldState.showDebriefOverlay = true;
  }
}
