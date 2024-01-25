import { create } from "zustand";

export interface ConfigStore {
  config: any;
  init: () => void;
}

export const useConfigStore = ({dojoProvider: DojoProvide}) => create<ConfigStore>((get,set) => ({
  config: {},

  init: () => {

   // dojoProvider.call()
    set({ config: { loaded: true } });
  },
}));
