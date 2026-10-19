/**
 * Sound Manager - Web Audio API Synthesizer
 * ROBOT MINI GAMES: Audio Efek Robotik & Sintesis Elektronik Mandiri
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private bgmStep: number = 0;

  private bgmVol: number = 0.35;
  private sfxVol: number = 0.6;
  private muted: boolean = false;

  constructor() {
    // Initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 1, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.bgmVol, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVol, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(bgm: number, sfx: number, muted: boolean) {
    this.bgmVol = Math.max(0, Math.min(1, bgm));
    this.sfxVol = Math.max(0, Math.min(1, sfx));
    this.muted = muted;

    if (this.ctx && this.bgmGain && this.sfxGain && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 1, this.ctx.currentTime, 0.05);
      this.bgmGain.gain.setTargetAtTime(this.bgmVol, this.ctx.currentTime, 0.05);
      this.sfxGain.gain.setTargetAtTime(this.sfxVol, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Sound effect: Robot Thruster Jump
   */
  public playJump() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.muted) return;

      const now = this.ctx.currentTime;
      // High-tech servo thruster
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio error ignored
    }
  }

  /**
   * Sound effect: Digital Energy Coin Pick-up
   */
  public playCoin() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.muted) return;

      const now = this.ctx.currentTime;
      // Futuristic crystal digital chime
      const notes = [1046.5, 1318.5, 2093.0]; // C6, E6, C7
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.2, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.14);
      });
    } catch {
      // Audio error ignored
    }
  }

  /**
   * Sound effect: Electric Zap / Glitch Damage
   */
  public playHurt() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.muted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.08);
      osc.frequency.linearRampToValueAtTime(320, now + 0.14);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio error ignored
    }
  }

  /**
   * Sound effect: Robot Drone Stomped & Neutralized
   */
  public playStomp() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.muted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Audio error ignored
    }
  }

  /**
   * Sound effect: Battery / Energy Core Restore
   */
  public playHeal() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.muted) return;

      const now = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.2, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.14);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.15);
      });
    } catch {
      // Audio error ignored
    }
  }

  /**
   * Sound effect: Level Victory Fanfare (Futuristic)
   */
  public playVictory() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.muted) return;

      const now = this.ctx.currentTime;
      const fanfares = [
        { f: 523.25, t: 0.0, d: 0.14 },
        { f: 659.25, t: 0.15, d: 0.14 },
        { f: 783.99, t: 0.3, d: 0.18 },
        { f: 1046.5, t: 0.5, d: 0.4 },
        { f: 1318.5, t: 0.65, d: 0.5 },
      ];

      fanfares.forEach(({ f, t, d }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0.25, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(now + t);
        osc.stop(now + t + d + 0.05);
      });
    } catch {
      // Audio error ignored
    }
  }

  /**
   * Sound effect: Robot Power Down (Game Over)
   */
  public playGameOver() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.muted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.6);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.7);
    } catch {
      // Audio error ignored
    }
  }

  /**
   * UI Click Sound
   */
  public playClick() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.muted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.04);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio error ignored
    }
  }

  /**
   * Procedural Looping BGM: Cyber Robot Adventure Melody
   */
  public startBGM() {
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.bgmStep = 0;
    this.scheduleNextBgmStep();
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  private scheduleNextBgmStep() {
    if (!this.isBgmPlaying) return;

    try {
      this.initContext();
      if (this.ctx && this.bgmGain && !this.muted) {
        // Futuristic electronic arpeggio in D Minor / F Major
        const melody = [
          587.33, 739.99, 880.00, 1174.66,
          880.00, 739.99, 880.00, 1046.50,
          659.25, 783.99, 987.77, 1318.51,
          987.77, 783.99, 880.00, 659.25,
          1174.66, 880.00, 1046.50, 783.99,
          880.00, 659.25, 783.99, 587.33,
          587.33, 739.99, 880.00, 1174.66,
          1318.51, 1174.66, 1046.50, 880.00
        ];

        const bassNotes = [
          146.83, 146.83, 146.83, 146.83, // D3
          110.00, 110.00, 110.00, 110.00, // A2
          130.81, 130.81, 130.81, 130.81, // C3
          98.00, 98.00, 98.00, 98.00,     // G2
          146.83, 146.83, 146.83, 146.83,
          110.00, 110.00, 110.00, 110.00,
          130.81, 130.81, 130.81, 130.81,
          98.00, 98.00, 98.00, 98.00
        ];

        const idx = this.bgmStep % melody.length;
        const noteFreq = melody[idx];
        const bassFreq = bassNotes[idx];
        const now = this.ctx.currentTime;

        // Lead electronic synth
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(noteFreq, now);

        gain.gain.setValueAtTime(0.12 * this.bgmVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(now);
        osc.stop(now + 0.18);

        // Synth Bass
        if (idx % 2 === 0) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bassOsc.type = 'sawtooth';
          bassOsc.frequency.setValueAtTime(bassFreq, now);

          bassGain.gain.setValueAtTime(0.13 * this.bgmVol, now);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

          bassOsc.connect(bassGain);
          bassGain.connect(this.bgmGain);

          bassOsc.start(now);
          bassOsc.stop(now + 0.3);
        }

        this.bgmStep++;
      }
    } catch {
      // Audio step error ignored
    }

    this.bgmTimer = window.setTimeout(() => {
      this.scheduleNextBgmStep();
    }, 190); // Snappy cyber tempo ~155 BPM
  }
}

export const soundManager = new SoundManager();
