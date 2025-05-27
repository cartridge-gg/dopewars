import { createStore, StoreApi } from "zustand";

import { createTokenStore, TokenState } from "./tokens";
import { CollectionState, createCollectionStore } from "./collection";
import { ClientState, createClientStore } from "./client";

export type DopeState = ClientState & CollectionState & TokenState;
export type DopeStore = StoreApi<DopeState>;

export const createDopeStore = (): DopeStore => {
  return createStore<DopeState>()((...props) => ({
    ...createClientStore(...props),
    ...createTokenStore(...props),
    ...createCollectionStore(...props),
  }));
};
