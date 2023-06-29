import { Howl, Howler } from "howler";
import { create } from "zustand";

type MediaItem = { name: string; filename: string; sound?: Howl };

const mediaLibrary: MediaItem[] = [
  { name: "NightDrive", filename: "1_NightDrive.mp3" },
  { name: "TheChronic", filename: "2_TheChronic.mp3" },
  { name: "KeyGenh", filename: "3_KeyGenh.mp3" },
  { name: "Upbeat", filename: "4_Upbeat.mp3" },
  { name: "MRYO G Funk", filename: "5_MRYO_G_Funk.mp3" },
  { name: "Hacked Trap", filename: "6_Hacked_Trap.mp3" },
  { name: "Dark Moody", filename: "7_Dark_Moody.mp3" },
];

export interface MediaState {
  isInitialized: boolean;
  medias: MediaItem[];
  currentIndex: number;
  isPlaying: boolean;
}

export const useMediaStore = create<MediaState>(() => ({
  isInitialized: false,
  medias: [],
  currentIndex: 0,
  isPlaying: false,
}));

export const initMediaStore = async () => {
  const state = useMediaStore.getState();
  if (state.isInitialized) return;

  for (let media of mediaLibrary) {
    state.medias.push({
      ...media,
      sound: new Howl({
        src: `/medias/${media.filename}`,
        html5: true,
        preload: true,
      }),
    });
  }

  useMediaStore.setState((state) => ({
    ...state,
    isInitialized: true,
  }));

  const disableAutoPlay =
    process.env.NEXT_PUBLIC_DISABLE_MEDIAPLAYER_AUTOPLAY === "true";
  if (!disableAutoPlay) {
    play();
  }
};

export const play = () => {
  const state = useMediaStore.getState();
  if (
    !state.medias[state.currentIndex] ||
    !state.medias[state.currentIndex]?.sound
  )
    return;

  if (!state.medias[state.currentIndex].sound?.playing()) {
    state.medias[state.currentIndex].sound?.play();
  }

  // play next when sound ends
  state.medias[state.currentIndex].sound?.on("end", () => {
    const state = useMediaStore.getState();

    useMediaStore.setState((state) => ({
      currentIndex: (state.currentIndex + 1) % state.medias.length,
    }));
    play();
  });

  useMediaStore.setState((state) => ({
    isPlaying: true,
  }));
};

export const pause = () => {
  const state = useMediaStore.getState();
  state.medias[state.currentIndex].sound?.pause();

  useMediaStore.setState((state) => ({
    isPlaying: false,
  }));
};

export const backward = () => {
  const state = useMediaStore.getState();
  state.medias[state.currentIndex].sound?.stop();

  useMediaStore.setState((state) => ({
    currentIndex:
      state.currentIndex === 0
        ? state.medias.length - 1
        : (state.currentIndex - 1) % state.medias.length,
  }));

  state.isPlaying && play();
};

export const forward = () => {
  const state = useMediaStore.getState();
  state.medias[state.currentIndex].sound?.stop();

  useMediaStore.setState((state) => ({
    currentIndex: (state.currentIndex + 1) % state.medias.length,
  }));

  state.isPlaying && play();
};
