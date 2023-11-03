import { create } from "zustand";

/* utils */

const loadSoundBuffer = async (src: string, context: AudioContext) => {
  const sound = new Audio(src);
  const res = await fetch(sound.src);
  const buffer = await res.arrayBuffer();
  const decoded = await context.decodeAudioData(buffer);
  return decoded;
};

/* store */

export enum Sounds {
  HoverClick = "HoverClick.wav",
  Magnum357 = "Magnum357.mp3",
  Trade = "Trade.mp3",
  Police = "Police.mp3",
  Gang = "Gang.mp3",
  GameOver = "GameOver.mp3",
  Knife = "Knife.wav",
  Uzi = "Uzi.wav",
  Run = "Run.mp3",
  Pay = "Pay.wav",
  Ooo = "Ooo.wav",
  Death = "Flatline.mp3",
  Punch = "Punch.mp3",
}

export interface SoundState {
  isInitialized: boolean;
  context: AudioContext;
  isMuted: boolean;
  library: {
    buffers: any;
    sources: any;
    gains: any;
  };
}

// @ts-ignore
export const useSoundStore = create<SoundState>(() => {
  return {
    isInitialized: false,
    isMuted: false,
    context: {}, // can't be initialized server side
    library: {
      buffers: {},
      sources: {},
      gains: {},
    },
  };
});

export const initSoundStore = async () => {
  const state = useSoundStore.getState();
  if (state.isInitialized) return;
  const context = new AudioContext();

  for (let sound in Sounds) {
    const soundKey = sound as keyof typeof Sounds;
    try {
      state.library.buffers[Sounds[soundKey]] = await loadSoundBuffer(
        `/sounds/${Sounds[soundKey]}`,
        context,
      );
    } catch (e) {}
  }

  useSoundStore.setState((state) => ({
    isInitialized: true,
    library: state.library,
    context: context,
  }));
};

export const toggleIsMuted = () =>
  useSoundStore.setState((state) => {
    if (!state.isMuted) {
      state.context && state.context.suspend();
    } else {
      state.context && state.context.resume();
    }
    return { isMuted: !state.isMuted };
  });

export const playSound = async (sound: Sounds, volume = 1, loop = false) => {
  const { context, library, isInitialized } = useSoundStore.getState();
  if (!isInitialized) return;

  if (library.sources[sound]) library.sources[sound].stop();

  const gainNode = context.createGain();
  gainNode.gain.value = volume;

  const source = context.createBufferSource(); // creates a sound source
  source.buffer = library.buffers[sound]; // tell the source which sound to play
  source.connect(gainNode); // connect the source to node gain
  gainNode.connect(context.destination); // connect node gain to speakers

  source.loop = loop;
  source.start();

  library.sources[sound] = source;
  library.gains[sound] = gainNode;
};

export const stopSound = (sound: Sounds, delay = 20) => {
  const { library, context } = useSoundStore.getState();

  if (!library.gains[sound]) return;
  library.gains[sound].gain.exponentialRampToValueAtTime(
    0.001,
    context.currentTime + delay,
  );

  setTimeout(() => {
    library.sources[sound].stop();
  }, delay);
};
