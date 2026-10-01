/**
 * CosmosLens Spatial Audio Synthesizer
 * Uses Web Audio API for zero-asset procedural ambient soundscapes & visionOS glass pings.
 */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.droneGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.isPlayingDrone = false;
    this.isMuted = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  toggleDrone(enable) {
    this.init();
    if (!this.ctx) return false;

    if (enable) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.startDrone();
      this.isMuted = false;
      return true;
    } else {
      this.stopDrone();
      this.isMuted = true;
      return false;
    }
  }

  startDrone() {
    if (this.isPlayingDrone || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // Master drone gain
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.12, now + 3);

      // Low-pass filter for deep space warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);
      filter.Q.setValueAtTime(3.5, now);

      // Sub-bass oscillator (55Hz - A1 note)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(55, now);

      // Harmonic harmonic drone with subtle beating (55.4Hz)
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(55.4, now);

      // Cosmic LFO modulation
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.08, now); // Slow 12.5s cycle
      lfoGain.gain.setValueAtTime(30, now);
      lfo.connect(filter.frequency);
      lfo.start(now);

      this.droneOsc1.connect(filter);
      this.droneOsc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.droneOsc1.start(now);
      this.droneOsc2.start(now);
      this.isPlayingDrone = true;
    } catch (e) {
      console.warn('Drone audio init error:', e);
    }
  }

  stopDrone() {
    if (!this.isPlayingDrone || !this.ctx || !this.droneGain) return;
    try {
      const now = this.ctx.currentTime;
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      setTimeout(() => {
        if (this.droneOsc1) {
          try { this.droneOsc1.stop(); this.droneOsc1.disconnect(); } catch (_) {}
          this.droneOsc1 = null;
        }
        if (this.droneOsc2) {
          try { this.droneOsc2.stop(); this.droneOsc2.disconnect(); } catch (_) {}
          this.droneOsc2 = null;
        }
        this.isPlayingDrone = false;
      }, 1300);
    } catch (e) {
      console.warn('Drone stop error:', e);
    }
  }

  playGlassPing(pitchMultiplier = 1) {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880 * pitchMultiplier, now);
      osc.frequency.exponentialRampToValueAtTime(1760 * pitchMultiplier, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(440 * pitchMultiplier, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (_) {}
  }

  playVisionClick() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (_) {}
  }
}

export const soundFx = new AudioSynthesizer();
