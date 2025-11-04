import { ToriiClient } from "@dojoengine/torii-client";
import { StateCreator } from "zustand";

import { DopeState } from "./store";

type State = {
  toriiClient?: ToriiClient;
};

type Action = {
  setToriiClient: (toriiClient: ToriiClient) => void;
  // getClient: () => ToriiClient;
};

export type ClientState = State & Action;
// export type ClientStore = StoreApi<ClientState>;
//
//
//

export const createClientStore: StateCreator<DopeState, [], [], ClientState> = (
  set,
  _get
) => ({
  toriiClient: undefined,
  setToriiClient: (toriiClient: ToriiClient) => {
    set({ toriiClient });
  },
  // getClient: () => {
  //   return get().toriiClient!;
  // },
});
