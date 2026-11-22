/**
 * audio.js - 100% Offline Procedural Web Audio API Engine
 * Generates adaptive tension basslines, alarm sirens, and realistic tactical foley SFX.
 */

export class ProceduralAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.lastBassStep = 0;
    this.tensionState = "GHOST"; // "GHOST", "SUSPICIOUS", "LOCKDOWN"
    this.stepIndex = 0;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.initialized = true;
    } catch {
      // Running headless or without audio driver
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  setTension(alarmLevel) {
    if (alarmLevel >= 75) {
      this.tensionState = "LOCKDOWN";
    } else if (alarmLevel >= 30) {
      this.tensionState = "SUSPICIOUS";
    } else {
      this.tensionState = "GHOST";
    }
  }

  update(dt) {
    if (!this.initialized || !this.ctx || this.isMuted) return;

    this.lastBassStep += dt;
    // Rhythmic pulse interval depends on alarm tension
    const interval = this.tensionState === "LOCKDOWN" ? 0.35 : (this.tensionState === "SUSPICIOUS" ? 0.6 : 1.2);

    if (this.lastBassStep >= interval) {
      this.lastBassStep = 0;
      this.triggerBassPulse();
      this.stepIndex++;
    }
  }

  triggerBassPulse() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Sub-bass oscillator
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(140, now);

    let baseFreq = 55; // A1
    if (this.tensionState === "SUSPICIOUS") {
      const notes = [55, 65.4, 73.4, 82.4]; // A, C, D, E minor tension
      baseFreq = notes[this.stepIndex % notes.length];
      filter.frequency.setValueAtTime(260, now);
    } else if (this.tensionState === "LOCKDOWN") {
      baseFreq = this.stepIndex % 2 === 0 ? 82.4 : 73.4; // alternating urgent pulse
      filter.frequency.setValueAtTime(450, now);
    }

    osc.type = this.tensionState === "LOCKDOWN" ? "sawtooth" : "sine";
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.3);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  playFootstep(isSneaking = false) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(isSneaking ? 70 : 120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.06);

    const volume = isSneaking ? 0.05 : 0.15;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  playDecoyClink() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Metallic bell harmonic
    const freqs = [1760, 2637, 3520];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.3 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 1.25);
    });
  }

  playEMP() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Descending power shockwave
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.52);

    // High electrical buzz
    const buzz = this.ctx.createOscillator();
    const bGain = this.ctx.createGain();
    buzz.type = "sawtooth";
    buzz.frequency.setValueAtTime(120, now);
    bGain.gain.setValueAtTime(0.25, now);
    bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    buzz.connect(bGain);
    bGain.connect(this.sfxGain);
    buzz.start(now);
    buzz.stop(now + 0.32);
  }

  playSmoke() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Filtered noise hiss
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.8);
    filter.Q.value = 1.8;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + 0.9);
  }

  playHackTick() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1400 + Math.random() * 400, now);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playHackComplete() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    [1046, 1318, 1567].forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now + idx * 0.08);

      gain.gain.setValueAtTime(0.25, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.26);
    });
  }

  playLootGrab() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    // Major 7th ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.07);

      gain.gain.setValueAtTime(0.3, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.45);
    });
  }

  playAlarmAlert() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.linearRampToValueAtTime(440, now + 0.25);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return this.isMuted;
  }
}
