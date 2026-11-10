// Procedural Web Audio API Soundscape Synthesizer for "The Vigil of Gilgamesh"
// Generates authentic coastal surf against volcanic pebbles, nocturnal howling wind, and low bronze drone without external audio files.

class VigilSoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private waveInterval: number | null = null;

  public initAndPlay(cue: string = 'waves_dusk'): boolean {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      if (!this.isPlaying) {
        this.startContinuousAmbience();
      }
      this.triggerCueAccent(cue);
      return true;
    } catch {
      return false;
    }
  }

  private startContinuousAmbience() {
    if (!this.ctx) return;
    this.isPlaying = true;

    const master = this.ctx.createGain();
    master.gain.setValueAtTime(0.01, this.ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.28, this.ctx.currentTime + 1.5);
    master.connect(this.ctx.destination);
    this.masterGain = master;

    // Create pink/brown noise buffer for waves & wind over the Waters of Death
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 2.8;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(240, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.1, this.ctx.currentTime);

    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(master);
    whiteNoise.start();

    // Modulate filter frequency to simulate gray waves slapping volcanic pebbles every 5.5s
    const modulateSurf = () => {
      if (!this.ctx || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      filter.frequency.cancelScheduledValues(now);
      filter.frequency.setValueAtTime(190, now);
      filter.frequency.exponentialRampToValueAtTime(520, now + 2.2);
      filter.frequency.exponentialRampToValueAtTime(180, now + 5.2);

      waveGain.gain.cancelScheduledValues(now);
      waveGain.gain.setValueAtTime(0.12, now);
      waveGain.gain.linearRampToValueAtTime(0.32, now + 2.1);
      waveGain.gain.linearRampToValueAtTime(0.12, now + 5.2);
    };

    modulateSurf();
    this.waveInterval = window.setInterval(modulateSurf, 5400);
  }

  public triggerCueAccent(cue: string) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const cueGain = this.ctx.createGain();

    if (cue === 'waves_dusk') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(73.42, now); // D2 deep drone
    } else if (cue === 'grief_whisper') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110.0, now); // A2 mournful tone
    } else if (cue === 'deluge_resonance') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(65.41, now); // C2 abyssal drone
    } else if (cue === 'vigil_oath') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(98.0, now); // G2 tense undertone
    } else if (cue === 'night_wind') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(146.83, now);
      osc.frequency.exponentialRampToValueAtTime(92.5, now + 2.5);
    } else {
      // slumber_fall
      osc.type = 'sine';
      osc.frequency.setValueAtTime(82.41, now);
      osc.frequency.exponentialRampToValueAtTime(55.0, now + 3.0);
    }

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(220, now);

    cueGain.gain.setValueAtTime(0.001, now);
    cueGain.gain.exponentialRampToValueAtTime(0.16, now + 0.6);
    cueGain.gain.exponentialRampToValueAtTime(0.001, now + 3.4);

    osc.connect(lowpass);
    lowpass.connect(cueGain);
    cueGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 3.5);
  }

  public stop() {
    this.isPlaying = false;
    if (this.waveInterval !== null) {
      clearInterval(this.waveInterval);
      this.waveInterval = null;
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.ctx.close().catch(() => {});
      this.ctx = null;
      this.masterGain = null;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const soundscape = new VigilSoundscapeEngine();
