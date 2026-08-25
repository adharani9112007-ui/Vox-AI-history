/* ==========================================================================
   Smart History Education AI - Web Audio Sound Effects & Score Synthesizer
   ========================================================================== */

export class SoundFXEngine {
  constructor() {
    this.audioCtx = null;
    this.isEnabled = true;
    this.currentScoreNode = null;
    this.scoreInterval = null;
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playCannonFire() {
    if (!this.isEnabled) return;
    this.init();
    const ctx = this.audioCtx;

    // Cannon Boom - Low noise burst with sub-bass drop
    const bufferSize = ctx.sampleRate * 1.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.1);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.8, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  }

  playSwordClash() {
    if (!this.isEnabled) return;
    this.init();
    const ctx = this.audioCtx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(3200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  playHorseHooves() {
    if (!this.isEnabled) return;
    this.init();
    const ctx = this.audioCtx;

    [0, 0.12].forEach(offset => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime + offset);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + offset + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + offset + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.08);
    });
  }

  playMarchingDrum() {
    if (!this.isEnabled) return;
    this.init();
    const ctx = this.audioCtx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  playTrumpetFanfare() {
    if (!this.isEnabled) return;
    this.init();
    const ctx = this.audioCtx;

    const notes = [440, 554.37, 659.25, 880]; // A Major triad
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);

      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.5);
    });
  }

  playThunder() {
    if (!this.isEnabled) return;
    this.init();
    const ctx = this.audioCtx;

    const bufferSize = ctx.sampleRate * 2.0;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 2.0);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.0);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  }

  startCinematicScore(theme = 'battle') {
    this.stopCinematicScore();
    if (!this.isEnabled) return;
    this.init();

    // Loop periodic musical atmosphere
    this.scoreInterval = setInterval(() => {
      if (theme === 'battle') {
        this.playMarchingDrum();
        if (Math.random() > 0.7) this.playCannonFire();
      } else if (theme === 'palace') {
        if (Math.random() > 0.6) this.playTrumpetFanfare();
      } else if (theme === 'rain') {
        if (Math.random() > 0.8) this.playThunder();
      }
    }, 1800);
  }

  stopCinematicScore() {
    if (this.scoreInterval) {
      clearInterval(this.scoreInterval);
      this.scoreInterval = null;
    }
  }
}
