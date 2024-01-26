import { DojoProvider } from "@dojoengine/core";
import { Contract } from "starknet";
import { createStore } from "zustand";

export interface ConfigStore {
  config: any;
  init: () => void;
  // getConfig: () => void;
}

type ConfigStoreProps = {
  dojoProvider: DojoProvider;
  manifest: any;
};

export const createConfigStore = ({ dojoProvider, manifest }: ConfigStoreProps) => {
  return createStore<ConfigStore>((set, get) => ({
    isLoading: false,
    config: undefined,
    init: () => {
      const init_async = async () => {
        set({ isLoading: true });
        try {
          const contractInfos = manifest.contracts.find((i) => i.name === "rollyourown::config::config::config")!;

          // TODO: use typedv2 when its available
          const contract = new Contract(contractInfos.abi, contractInfos.address, dojoProvider.provider).typed(
            contractInfos.abi,
          );

          const res = await contract.get_config();
          console.log(res);
          set({ config: res, isLoading: false });
        } catch (e: any) {
          set({ isLoading: false });
        }
      };

      if (!get().config && !get().isLoading) {
        init_async();
      }
    },
  }));
};
