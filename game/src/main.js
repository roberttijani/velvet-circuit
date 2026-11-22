/**
 * main.js - Velvet Circuit Master Entrypoint & Simulation Loop (v2.0.0)
 * Coordinates rendering, audio, guards, cameras, gadgets, and input handling.
 * Native 1280x480 tactical widescreen resolution for desktop Chrome.
 */

import { HEIST_LEVELS } from './world/levels.js';
import { GameRenderer } from './engine/renderer.js';
import { LightingEngine } from './engine/lighting.js';
import { ProceduralAudioEngine } from './engine/audio.js';
import { ParticleEngine } from './engine/particles.js';
import { ThiefController } from './gameplay/thiefController.js';
import { GuardFSM } from './ai/guardFSM.js';
import { CameraSystem } from './ai/cameraSystem.js';
import { AlarmSystem } from './gameplay/alarmSystem.js';
import { GadgetManager } from './gameplay/gadgets.js';
import { GameHUD } from './ui/hud.js';
import { stageScreenshotScenario } from './shots.js';

export class VelvetGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    // Subsystems
    this.renderer = new GameRenderer(canvas);
    this.lighting = new LightingEngine(this.width, this.height);
    this.particles = new ParticleEngine();
    this.audio = new ProceduralAudioEngine();
    this.alarmSystem = new AlarmSystem();
    this.gadgetManager = new GadgetManager();
    this.hud = new GameHUD(this.width, this.height);

    // Game State
    this.currentFloorIndex = 0;
    this.level = null;
    this.thief = new ThiefController();
    this.guards = [];
    this.cameraSystem = null;

    // Input Tracking
    this.inputState = {
      keys: {},
      mouse: { x: this.width * 0.5, y: this.height * 0.5, isDown: false }
    };

    this.lastTime = performance.now();
    this.isPaused = false;
    this.isVictory = false;
    this.showDebriefOverlay = false;

    this.bindEvents();
    this.loadFloor(0);
  }

  loadFloor(index) {
    this.currentFloorIndex = index % HEIST_LEVELS.length;
    this.level = JSON.parse(JSON.stringify(HEIST_LEVELS[this.currentFloorIndex]));

    // Initialize Thief
    this.thief.reset(this.level.thiefStart.x, this.level.thiefStart.y, this.level.thiefStart.facing);

    // Initialize Guards
    this.guards = this.level.guards.map(g => new GuardFSM(g));

    // Initialize Cameras
    this.cameraSystem = new CameraSystem(this.level.cameras);

    // Reset Alarm System for new floor
    this.alarmSystem = new AlarmSystem();
    this.showDebriefOverlay = false;
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      this.inputState.keys[e.code] = true;
      this.audio.ensureContext();

      // Number keys for gadget selection
      if (e.code === 'Digit1') this.gadgetManager.select(1);
      if (e.code === 'Digit2') this.gadgetManager.select(2);
      if (e.code === 'Digit3') this.gadgetManager.select(3);

      // Mute toggle [M]
      if (e.code === 'KeyM') this.audio.toggleMute();

      // Restart floor [R]
      if (e.code === 'KeyR') this.loadFloor(this.currentFloorIndex);

      // Debrief Space toggle
      if (e.code === 'Space' && (this.showDebriefOverlay || this.isVictory)) {
        this.loadFloor(0);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.inputState.keys[e.code] = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;
      this.inputState.mouse.x = (e.clientX - rect.left) * scaleX;
      this.inputState.mouse.y = (e.clientY - rect.top) * scaleY;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.audio.ensureContext();
      if (e.button === 0) {
        this.inputState.mouse.isDown = true;
        this.gadgetManager.useCurrent(
          this.thief.x,
          this.thief.y,
          this.inputState.mouse.x,
          this.inputState.mouse.y,
          this.cameraSystem.cameras,
          this.level.lasers,
          this.guards,
          this.audio
        );
      }
    });

    this.canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.inputState.mouse.isDown = false;
    });
  }

  update(dt) {
    if (this.isVictory || this.showDebriefOverlay) return;

    // 1. Update Laser Grids
    for (let laser of this.level.lasers) {
      if (laser.disabledTimer > 0) {
        laser.disabledTimer -= dt;
        continue;
      }
      laser.phase = (laser.phase + dt) % laser.period;
      laser.active = laser.phase < (laser.period * laser.duty);

      // Laser collision with thief
      if (laser.active) {
        const d = this.distPointToSegment(this.thief.x, this.thief.y, laser.x1, laser.y1, laser.x2, laser.y2);
        if (d < this.thief.radius + 3) {
          this.alarmSystem.triggerDetection("LASER GRID INTERRUPTED", 60);
          this.audio.playAlarmAlert();
        }
      }
    }

    // 2. Update Gadgets
    this.gadgetManager.update(dt);

    // 3. Update Thief
    this.thief.update(
      dt,
      this.inputState,
      this.level.walls,
      this.level.loot,
      this.level.terminals,
      this.level.extraction,
      this.gadgetManager,
      this.audio,
      () => this.onFloorCleared()
    );

    // 4. Update Cameras with furniture occlusion
    this.cameraSystem.update(
      dt,
      this.thief,
      this.level.walls,
      this.gadgetManager.smokeClouds,
      this.alarmSystem,
      this.guards,
      this.audio,
      this.level.furniture
    );

    // 5. Update Guards FSM with furniture occlusion
    for (let guard of this.guards) {
      guard.update(
        dt,
        this.thief,
        this.level.walls,
        this.gadgetManager.smokeClouds,
        this.alarmSystem,
        this.audio,
        this.level.furniture
      );
    }

    // 6. Update Global Systems
    this.alarmSystem.update(dt, this.audio);
    this.lighting.update(dt);
    this.particles.update(dt);
    this.renderer.update(dt);
    this.audio.update(dt);
  }

  onFloorCleared() {
    if (this.currentFloorIndex < HEIST_LEVELS.length - 1) {
      this.audio.playLevelComplete();
      this.loadFloor(this.currentFloorIndex + 1);
    } else {
      this.isVictory = true;
      this.showDebriefOverlay = true;
      this.audio.playLevelComplete();
    }
  }

  render() {
    // 1. Clear & Blueprint Grid
    this.renderer.clear();

    // 2. Room Floor Tile Styling, Carpets, Conduits, Artworks & Blueprint Labels
    this.renderer.renderRooms(this.level);

    // 3. Footstep Trails
    this.lighting.renderFootsteps(this.ctx, this.thief.footsteps);

    // 4. Atmospheric Spotlight Pools & Ambient Illumination
    this.lighting.renderAtmosphericLighting(this.ctx, this.level, this.thief);

    // 5. Furniture & 2.5D Architectural Props
    this.renderer.renderFurniture(this.level.furniture);

    // 6. Terminals & Extraction
    this.renderer.renderTerminals(this.level.terminals, this.thief);
    this.renderer.renderExtraction(this.level.extraction, this.thief.hasLoot);

    // 7. Glowing Loot Target
    this.renderer.renderLoot(this.level.loot, this.thief.hasLoot);

    // 8. Laser Grids with floor bounce and emitter boxes
    for (let laser of this.level.lasers) {
      this.lighting.renderLaserBeam(this.ctx, laser);
    }

    // 9. Volumetric Guard Vision Cones with furniture obstacle shadow casting & lens flare
    for (let guard of this.guards) {
      this.lighting.renderGuardCone(this.ctx, guard, this.level.walls, this.gadgetManager.smokeClouds, this.level.furniture);
    }

    // 10. Volumetric Camera Beams & Scanlines with furniture obstacle shadow casting
    for (let cam of this.cameraSystem.cameras) {
      this.lighting.renderCameraCone(this.ctx, cam, this.level.walls, this.gadgetManager.smokeClouds, this.level.furniture);
    }

    // 11. Multi-Layered Particles: Dust Motes, Swirling Smoke Veil, EMP Lightning Arcs & Sound Waves
    this.particles.renderDustMotes(this.ctx);
    this.gadgetManager.render(this.ctx);
    this.particles.renderSmokeClouds(this.ctx, this.gadgetManager.smokeClouds, this.renderer.time);
    this.particles.renderEMPEffects(this.ctx, this.gadgetManager.empFlashes, this.cameraSystem.cameras);
    this.particles.renderSoundRipples(this.ctx, this.gadgetManager.soundRipples);

    // 12. Security Cameras & Armored Guards Bodies
    this.renderer.renderCameras(this.cameraSystem.cameras);
    this.renderer.renderGuards(this.guards);

    // 13. Articulated Thief Operative with Glowing Loot Satchel
    this.renderer.renderThief(this.thief, this.inputState.mouse.x, this.inputState.mouse.y);

    // 14. 2.5D Architectural Walls (Lit south facades, dark caps, drop shadows)
    this.renderer.renderWalls(this.level.walls);

    // 15. Emergency Strobe Light Overlay if LOCKDOWN
    if (this.alarmSystem.state === "LOCKDOWN") {
      const alpha = 0.08 + 0.07 * Math.sin(this.alarmSystem.strobe);
      this.ctx.fillStyle = `rgba(255, 0, 40, ${alpha})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // 16. Studio Obsidian Glass HUD (Valuation counter, segmented alarm meter, vector gadget icons & radar minimap)
    this.hud.render(
      this.ctx,
      this.level,
      this.thief,
      this.alarmSystem,
      this.gadgetManager,
      this.audio,
      this.guards
    );

    // 17. Tactical Debrief Scorecard Overlay (for Shot 4 or Victory)
    if (this.showDebriefOverlay) {
      this.renderer.renderDebriefScorecard(this.ctx);
    }
  }

  distPointToSegment(px, py, x1, y1, x2, y2) {
    const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }
}

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const game = new VelvetGame(canvas);

  const urlParams = new URLSearchParams(window.location.search);
  const shot = urlParams.get('shot');

  if (shot) {
    stageScreenshotScenario(shot, game);
    game.render();
  } else {
    function loop(timestamp) {
      const dt = Math.min(0.05, (timestamp - game.lastTime) / 1000);
      game.lastTime = timestamp;

      game.update(dt);
      game.render();

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }
});
