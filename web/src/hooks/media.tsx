import { Howl } from "howler";
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

  { name: "2 of Amerika's Most Wanted", filename: "C1_2 of Amerika_s Most Wanted.mp3" },
  { name: "Ain't Nuthin But a G Thang", filename: "C2_Ain_t Nuthin But a G Thang.mp3" },
  { name: "Big Poppa", filename: "C3_Big Poppa.mp3" },
  { name: "Big Pimpin", filename: "C4_Big Pimpin_.mp3" },
  { name: "C.R.E.A.M.", filename: "C5_C.R.E.A.M..mp3" },
  { name: "Can't Knock The Hustle", filename: "C6_Can_t Knock The Hustle.mp3" },
  { name: "Shook Ones Pt 2", filename: "C7_Shook Ones Pt 2.mp3" },
  { name: "Gangsta's Paradise", filename: "C8_Gangsta_s Paradise.mp3" },
  { name: "I Got 5 On It", filename: "C9_I Got 5 On It.mp3" },
  { name: "Regulate", filename: "C10_Regulate.mp3" },

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

  state.currentIndex = Math.floor(Math.random() * mediaLibrary.length);

  for (let media of mediaLibrary) {
    state.medias.push({
      ...media,
      sound: new Howl({
        src: `/medias/${media.filename}`,
        html5: true,
        preload: true,
        onplay: () => {
          navigator.mediaSession.playbackState = "playing";
        },
        onpause: () => {
          navigator.mediaSession.playbackState = "paused";
        },
        onend: () => {
          const state = useMediaStore.getState();
          useMediaStore.setState((state) => ({
            currentIndex: (state.currentIndex + 1) % state.medias.length,
          }));
          play();
        },
      }),
    });
  }

  useMediaStore.setState((state) => ({
    ...state,
    isInitialized: true,
  }));

  if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", pause);
    navigator.mediaSession.setActionHandler("previoustrack", backward);
    navigator.mediaSession.setActionHandler("nexttrack", forward);
    navigator.mediaSession.setActionHandler("seekto", (event) => seekTo(event.seekTime || 0));
  }

  // Set initial metadata
  updateMetadata();
};

export const play = () => {
  const state = useMediaStore.getState();
  const currentMedia = state.medias[state.currentIndex];
  if (!currentMedia || !currentMedia?.sound) return;

  // force all other sounds to stop
  for (let media of state.medias) {
    if (media.sound?.playing()) {
      media.sound?.stop();
    }
  }

  // play sound
  if (!currentMedia.sound?.playing()) {
    currentMedia.sound?.play();
  }

  // Update Media Session API metadata
  updateMetadata();
  updatePositionState();

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
    currentIndex: state.currentIndex === 0 ? state.medias.length - 1 : (state.currentIndex - 1) % state.medias.length,
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

const updateMetadata = () => {
  const state = useMediaStore.getState();
  const currentMedia = state.medias[state.currentIndex];

  if ("mediaSession" in navigator && currentMedia) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentMedia.name || "Roll your own",
      artist: "Roll your own",
      artwork: [
        { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { src: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
        // Add more artwork sizes as needed
      ],
    });
  }
};

export const seekTo = (position: number) => {
  const state = useMediaStore.getState();
  const currentHowl = state.medias[state.currentIndex].sound;
  const seekTime = Math.min(Math.max(position, 0), currentHowl?.duration() || 0);

  currentHowl?.seek(seekTime);

  // Update Media Session API position state
  updatePositionState();
};

export const updatePositionState = () => {
  const state = useMediaStore.getState();
  const currentMedia = state.medias[state.currentIndex];

  if ("mediaSession" in navigator && currentMedia && currentMedia.sound) {
    navigator.mediaSession.setPositionState({
      duration: currentMedia.sound.duration(),
      playbackRate: currentMedia.sound.rate(),
      position: currentMedia.sound.seek(),
    });
  }
};
