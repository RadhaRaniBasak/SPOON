// Native Web Audio API Procedural Brown Noise Synthesizer (1/f^2 Acoustic Shield)
export class BrownNoiseEngine {
  private static instance: BrownNoiseEngine | null = null;
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private scriptNode: ScriptProcessorNode | null = null;
  private isPlaying: boolean = false;
  private lastOut: number = 0.0;

  private constructor() {}

  public static getInstance(): BrownNoiseEngine {
    if (!BrownNoiseEngine.instance) {
      BrownNoiseEngine.instance = new BrownNoiseEngine();
    }
    return BrownNoiseEngine.instance;
  }

  public start(volume: number = 0.35): void {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) {
      this.setVolume(volume);
      return;
    }

    const bufferSize = 4096;
    this.scriptNode = this.ctx.createScriptProcessor(bufferSize, 1, 1);
    this.lastOut = 0.0;

    this.scriptNode.onaudioprocess = (e: AudioProcessingEvent) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (this.lastOut + 0.02 * white) / 1.02;
        this.lastOut = output[i];
        output[i] *= 3.2; // Warm gain compensation
      }
    };

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(380, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(0.7, this.ctx.currentTime);

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(
      Math.max(0.01, Math.min(1, volume)) * 0.35,
      this.ctx.currentTime + 0.45
    );

    this.scriptNode.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
    this.isPlaying = true;
  }

  public setVolume(volume: number): void {
    if (!this.ctx || !this.gainNode || !this.isPlaying) return;
    const clamped = Math.max(0, Math.min(1, volume));
    this.gainNode.gain.setTargetAtTime(clamped * 0.35, this.ctx.currentTime, 0.08);
  }

  public stop(): void {
    if (!this.ctx || !this.gainNode || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    this.gainNode.gain.setTargetAtTime(0.0001, now, 0.08);
    setTimeout(() => {
      try {
        this.scriptNode?.disconnect();
        this.filterNode?.disconnect();
        this.gainNode?.disconnect();
      } catch {
        // Ignore disconnect errors if already cleaned up
      }
      this.isPlaying = false;
    }, 220);
  }
}
