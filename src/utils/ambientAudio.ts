import { Story } from '../types/story';

export type AmbientSceneId = 'forest' | 'library' | 'sea' | 'desert-night';

export interface AmbientSceneMeta {
  id: AmbientSceneId;
  label: string;
  description: string;
}

export const AMBIENT_SCENES: Record<AmbientSceneId, AmbientSceneMeta> = {
  forest: {
    id: 'forest',
    label: 'أصوات الغابة والعصافير',
    description: 'نسيم الأشجار وزقزقة عصافير لطيفة لقصص الطبيعة والحيوان',
  },
  library: {
    id: 'library',
    label: 'أجواء المكتبة الهادئة',
    description: 'هدوء دافئ ونغمات خفيفة تبعث على التركيز للقصص التعليمية',
  },
  sea: {
    id: 'sea',
    label: 'أمواج البحر الهادئة',
    description: 'صوت موج لطيف متدرج لقصص البحار والسفن',
  },
  'desert-night': {
    id: 'desert-night',
    label: 'سكينة الصحراء والنجوم',
    description: 'نسمات ليل هادئة ونغمات روحانية للقصص القرآنية والسيرة',
  },
};

export function getAmbientSceneForStory(story: Story): AmbientSceneId {
  // Specific illustration cues take priority for immersion
  if (
    story.illustrationId === 'khidr-sea' ||
    story.illustrationId === 'wooden-plank' ||
    story.illustrationId === 'kalila-monkey-turtle' ||
    story.illustrationId === 'kalila-three-fishes'
  ) {
    return 'sea';
  }

  if (
    story.illustrationId === 'rainbow-rabbit' ||
    story.illustrationId === 'hare-tortoise' ||
    story.illustrationId === 'bee-garden' ||
    story.illustrationId === 'ant-solomon' ||
    story.illustrationId === 'frogs-tower' ||
    story.illustrationId === 'garden-owners' ||
    story.illustrationId === 'cloud-garden' ||
    story.illustrationId === 'two-jars' ||
    story.illustrationId === 'turtle-fireplace' ||
    story.illustrationId === 'tamer-cat' ||
    story.illustrationId === 'kalila-pigeons' ||
    story.illustrationId === 'kalila-fox-drum' ||
    story.illustrationId === 'kalila-rabbit-lion'
  ) {
    return 'forest';
  }

  if (
    story.id === 'talia-leen-muadh-library' ||
    story.id === 'talia-leen-muadh-time' ||
    story.illustrationId === 'school-poem' ||
    story.illustrationId === 'pen-eraser' ||
    story.illustrationId === 'paradise-dust'
  ) {
    return 'library';
  }

  // Fallback based on story category
  switch (story.category) {
    case 'wisdom':
    case 'kalila':
      return 'forest';
    case 'poetry':
    case 'morals':
      return 'library';
    case 'quran':
    case 'seerah':
    default:
      return 'desert-night';
  }
}

/**
 * Procedural Web Audio API soundscape engine.
 * Generates soft, soothing children-friendly ambient backgrounds with zero external audio files.
 */
export class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: AudioNode[] = [];
  private activeIntervals: number[] = [];
  private currentScene: AmbientSceneId | null = null;
  private volume = 0.35;
  private isPlaying = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0;
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    return this.ctx;
  }

  private createPinkNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * seconds;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;

    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    return buffer;
  }

  private clearActiveSceneNodes() {
    this.activeIntervals.forEach((id) => window.clearInterval(id));
    this.activeIntervals = [];

    this.activeNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // Ignore already-stopped nodes
      }
    });
    this.activeNodes = [];
  }

  public setVolume(newVol: number) {
    this.volume = Math.max(0.05, Math.min(0.85, newVol));
    if (this.ctx && this.masterGain && this.isPlaying) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.25);
    }
  }

  public start(scene: AmbientSceneId) {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    if (this.isPlaying && this.currentScene === scene) {
      return;
    }

    this.clearActiveSceneNodes();
    this.currentScene = scene;
    this.isPlaying = true;

    const now = ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0.001, now);
    this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 1.0);

    if (scene === 'forest') {
      this.buildForestScene(ctx, this.masterGain);
    } else if (scene === 'sea') {
      this.buildSeaScene(ctx, this.masterGain);
    } else if (scene === 'library') {
      this.buildLibraryScene(ctx, this.masterGain);
    } else {
      this.buildDesertNightScene(ctx, this.masterGain);
    }
  }

  public stop() {
    this.isPlaying = false;
    this.currentScene = null;

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.35);
      window.setTimeout(() => {
        if (!this.isPlaying) {
          this.clearActiveSceneNodes();
        }
      }, 380);
    } else {
      this.clearActiveSceneNodes();
    }
  }

  public dispose() {
    this.stop();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      this.masterGain = null;
    }
  }

  private buildForestScene(ctx: AudioContext, dest: GainNode) {
    // Gentle rustling leaves breeze
    const noise = ctx.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer(ctx, 5);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 650;
    filter.Q.value = 0.7;

    const breezeGain = ctx.createGain();
    breezeGain.gain.value = 0.28;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.14;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(breezeGain);
    breezeGain.connect(dest);

    noise.start();
    lfo.start();
    this.activeNodes.push(noise, filter, breezeGain, lfo, lfoGain);

    // Periodic gentle bird chirps
    const scheduleChirp = () => {
      if (!this.ctx || !this.isPlaying || this.currentScene !== 'forest') return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const baseFreq = 1850 + Math.random() * 900;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, t + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.92, t + 0.17);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.06, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + 0.24);
    };

    scheduleChirp();
    const intervalId = window.setInterval(() => {
      if (Math.random() > 0.25) {
        scheduleChirp();
        if (Math.random() > 0.5) {
          window.setTimeout(scheduleChirp, 210);
        }
      }
    }, 2400);
    this.activeIntervals.push(intervalId);
  }

  private buildSeaScene(ctx: AudioContext, dest: GainNode) {
    // Rhythmic rolling ocean waves
    const noise = ctx.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer(ctx, 6);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 480;

    const waveGain = ctx.createGain();
    waveGain.gain.value = 0.35;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.11; // ~9 second wave cycle

    const filterMod = ctx.createGain();
    filterMod.gain.value = 340;
    lfo.connect(filterMod);
    filterMod.connect(filter.frequency);

    const ampMod = ctx.createGain();
    ampMod.gain.value = 0.2;
    lfo.connect(ampMod);
    ampMod.connect(waveGain.gain);

    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(dest);

    noise.start();
    lfo.start();
    this.activeNodes.push(noise, filter, waveGain, lfo, filterMod, ampMod);
  }

  private buildLibraryScene(ctx: AudioContext, dest: GainNode) {
    // Cozy warm room hush + gentle soft clock tick & calm study chord
    const noise = ctx.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer(ctx, 4);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 280;

    const hushGain = ctx.createGain();
    hushGain.gain.value = 0.14;

    noise.connect(filter);
    filter.connect(hushGain);
    hushGain.connect(dest);
    noise.start();
    this.activeNodes.push(noise, filter, hushGain);

    // Subtle soft warm tone pad (C4 + G4)
    [261.63, 392.0].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0.028;
      osc.connect(g);
      g.connect(dest);
      osc.start();
      this.activeNodes.push(osc, g);
    });

    // Very soft cozy library clock tick every 1.2s
    const tickId = window.setInterval(() => {
      if (!this.ctx || !this.isPlaying || this.currentScene !== 'library') return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(920, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.02);
      g.gain.setValueAtTime(0.025, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
      osc.connect(g);
      g.connect(dest);
      osc.start(t);
      osc.stop(t + 0.03);
    }, 1200);
    this.activeIntervals.push(tickId);
  }

  private buildDesertNightScene(ctx: AudioContext, dest: GainNode) {
    // Tranquil warm desert night breeze + soft pentatonic starlight chimes
    const noise = ctx.createBufferSource();
    noise.buffer = this.createPinkNoiseBuffer(ctx, 5);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 360;

    const breezeGain = ctx.createGain();
    breezeGain.gain.value = 0.18;

    noise.connect(filter);
    filter.connect(breezeGain);
    breezeGain.connect(dest);
    noise.start();
    this.activeNodes.push(noise, filter, breezeGain);

    // Gentle warm drone
    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.value = 196.0; // G3
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.03;
    drone.connect(droneGain);
    droneGain.connect(dest);
    drone.start();
    this.activeNodes.push(drone, droneGain);

    const notes = [392.0, 440.0, 523.25, 587.33, 659.25];
    const chimeId = window.setInterval(() => {
      if (!this.ctx || !this.isPlaying || this.currentScene !== 'desert-night') return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = notes[Math.floor(Math.random() * notes.length)];
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.045, t + 0.12);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
      osc.connect(g);
      g.connect(dest);
      osc.start(t);
      osc.stop(t + 1.9);
    }, 3200);
    this.activeIntervals.push(chimeId);
  }
}
