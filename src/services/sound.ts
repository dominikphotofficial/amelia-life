/**
 * Web Audio API procedural sound engine for ambient BGM, dialogue blips, water splash, and UI cues.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmInterval: number | null = null;
  private isMuted: boolean = false;
  private currentTrack: string | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.isMuted ? 0 : 0.14;
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.isMuted ? 0 : 0.22;
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgmGain) {
      this.bgmGain.gain.value = this.isMuted ? 0 : 0.14;
    }
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.isMuted ? 0 : 0.22;
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playSfx(type: 'click' | 'text' | 'heart' | 'splash' | 'whistle' | 'ding' | 'cheer' | 'breath' | 'achievement') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;

    switch (type) {
      case 'click': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.05);
        break;
      }

      case 'text': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        // Random subtle pitch variation for cute typewriter effect
        const baseFreq = 420 + Math.random() * 80;
        osc.frequency.setValueAtTime(baseFreq, t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.04);
        break;
      }

      case 'heart': {
        // Melodic twin chime for romance meter bump
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 - E5 - G5 - C6
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);
          gain.gain.setValueAtTime(0.18, t + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(this.sfxGain!);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 0.35);
        });
        break;
      }

      case 'splash': {
        // Noise buffer for water stroke in pool
        const bufferSize = this.ctx.sampleRate * 0.2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.06));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        // Bandpass filter for watery whoosh
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, t);
        filter.frequency.exponentialRampToValueAtTime(250, t + 0.18);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        noise.start(t);
        break;
      }

      case 'breath': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.linearRampToValueAtTime(440, t + 0.12);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.18);
        break;
      }

      case 'whistle': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, t);
        osc.frequency.setValueAtTime(1600, t + 0.08);
        osc.frequency.setValueAtTime(1500, t + 0.16);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.35);
        break;
      }

      case 'ding': {
        // Phone notification chime
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(880, t);
        osc2.frequency.setValueAtTime(1318.51, t + 0.08); // E6
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.sfxGain);
        osc1.start(t);
        osc1.stop(t + 0.15);
        osc2.start(t + 0.08);
        osc2.stop(t + 0.3);
        break;
      }

      case 'cheer': {
        // Harmonious victory fanfare
        const chords = [
          [523.25, 659.25, 783.99],
          [587.33, 739.99, 880.00],
          [659.25, 830.61, 987.77],
          [783.99, 987.77, 1174.66]
        ];
        chords.forEach((chord, step) => {
          chord.forEach(freq => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + step * 0.12);
            gain.gain.setValueAtTime(0.12, t + step * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, t + step * 0.12 + 0.4);
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            osc.start(t + step * 0.12);
            osc.stop(t + step * 0.12 + 0.4);
          });
        });
        break;
      }

      case 'achievement': {
        // Sparkling bell fanfare for milestone achievement unlock
        const notes = [587.33, 739.99, 880.00, 1174.66, 1479.98]; // D5, F#5, A5, D6, F#6
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);
          gain.gain.setValueAtTime(0.2, t + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.55);
          osc.connect(gain);
          gain.connect(this.sfxGain!);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 0.55);
        });
        break;
      }
    }
  }

  public playBGM(track: 'romantic' | 'pool' | 'school') {
    if (this.currentTrack === track && this.bgmInterval) return;
    this.stopBGM();
    this.currentTrack = track;
    this.initContext();
    if (!this.ctx || !this.bgmGain) return;

    // Progression of calm arpeggiated chords
    let chordIndex = 0;
    const chordProgressions: Record<string, number[][]> = {
      romantic: [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 392.00]  // G6
      ],
      pool: [
        [220.00, 293.66, 369.99, 440.00], // Dsus2/A
        [196.00, 261.63, 329.63, 392.00], // Csus2/G
        [164.81, 246.94, 329.63, 392.00], // Em7
        [174.61, 220.00, 261.63, 349.23]  // F
      ],
      school: [
        [261.63, 329.63, 392.00, 523.25], // C
        [293.66, 349.23, 440.00, 523.25], // Dm7
        [329.63, 392.00, 493.88, 587.33], // Em7
        [261.63, 349.23, 392.00, 523.25]  // Fadd9
      ]
    };

    const chords = chordProgressions[track] || chordProgressions.romantic;

    const playChordStep = () => {
      if (this.isMuted || !this.ctx || !this.bgmGain) return;
      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;
      const baseTime = this.ctx.currentTime;

      // Gentle mellow plucked arpeggio
      currentChord.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, baseTime + i * 0.35);

        gain.gain.setValueAtTime(0.04, baseTime + i * 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, baseTime + i * 0.35 + 1.2);

        osc.connect(gain);
        gain.connect(this.bgmGain!);
        osc.start(baseTime + i * 0.35);
        osc.stop(baseTime + i * 0.35 + 1.3);
      });
    };

    playChordStep();
    this.bgmInterval = window.setInterval(playChordStep, 2400);
  }

  public stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.currentTrack = null;
  }
}

export const sound = new SoundEngine();
