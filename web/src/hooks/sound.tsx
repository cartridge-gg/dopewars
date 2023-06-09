import { create } from "zustand";
// import { persist, createJSONStorage } from 'zustand/middleware'

/* utils */

const loadSoundBuffer = async (src, context) => {
  const sound = new Audio(src);
  const res = await fetch(sound.src);
  const buffer = await res.arrayBuffer();
  const decoded = await context.decodeAudioData(buffer);
  return decoded;
};

/* store */

export enum Sounds {
  Ambiance = "Ambiance.mp3",
  Ambiance2 = "Ambiance2.mp3",
  HoverClick = "HoverClick.wav",
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

export const useSoundStore = create<SoundState>(() => {
  return {
    isInitialized: false,
    isMuted: false,
    context: undefined,
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
    state.library.buffers[Sounds[sound]] = await loadSoundBuffer(
      `/sounds/${Sounds[sound]}`,
      context,
    );
  }

  useSoundStore.setState((state) => ({
    isInitialized: true,
    context,
    library: state.library,
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

  useSoundStore.setState(async (state) => {
    let s = await state;
    s.library.sources[sound] = source;
    s.library.gains[sound] = gainNode;
  });
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
