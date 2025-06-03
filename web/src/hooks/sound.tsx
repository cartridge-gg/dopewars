import { create } from "zustand";
import { useMediaStore } from "./media";

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
  // Chains = "Chains.mp3",
  Chains = "Punch.mp3",
  Roll = "Roll.mp3",
  SlotJackpot = "SlotJackpot.mp3",
  Ooo = "Ooo.wav",
  Death = "Flatline.mp3",
  Punch = "Punch.mp3",
  Door = "Door.mp3",
}

export enum WeaponSounds {
  AK47 = "/weapons/AK47.mp3",
  BaseballBat = "/weapons/Baseball_bat.mp3",
  BrassKnuckles = "/weapons/Brass_Knuckles.mp3",
  Chain = "/weapons/Chain.mp3",
  Crowbar = "/weapons/Crowbar&Tire_Iron.mp3",
  TireIron = "/weapons/Crowbar&Tire_Iron.mp3",
  Drone = "/weapons/Drone.mp3",
  Glock = "/weapons/Glock.mp3",
  Handgun = "/weapons/Handgun.mp3",
  Knife = "/weapons/Knife.mp3",
  PepperSpray = "/weapons/Pepper_Spray.mp3",
  PoiliceBaton = "/weapons/Police_baton.mp3",
  RazorBlade = "/weapons/Razor Blade&Pocket Knife.mp3",
  PocketKnife = "/weapons/Razor Blade&Pocket Knife.mp3",
  Shotgun = "/weapons/Shotgun.mp3",
  Shovel = "/weapons/Shovel.mp3",
  Taser = "/weapons/Taser.mp3",
  Uzi = "/weapons/Uzi.mp3",
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
      state.library.buffers[Sounds[soundKey]] = await loadSoundBuffer(`/sounds/${Sounds[soundKey]}`, context);
    } catch (e) {}
  }

  for (let sound in WeaponSounds) {
    const soundKey = sound as keyof typeof WeaponSounds;
    try {
      state.library.buffers[WeaponSounds[soundKey]] = await loadSoundBuffer(
        `/sounds/${WeaponSounds[soundKey]}`,
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

export const playSound = async (sound: Sounds | WeaponSounds, volume = 1, loop = false) => {
  const { context, library, isInitialized } = useSoundStore.getState();
  const { volume: mediaVolume } = useMediaStore.getState();

  if (!isInitialized) return;

  if (library.sources[sound]) library.sources[sound].stop();

  const gainNode = context.createGain();
  gainNode.gain.value = volume * mediaVolume;

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
  library.gains[sound].gain.exponentialRampToValueAtTime(0.001, context.currentTime + delay);

  setTimeout(() => {
    library.sources[sound].stop();
  }, delay);
};
