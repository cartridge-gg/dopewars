// Mock for @/dope/store - provides stubs for all exports used by game screens
import React from "react";

export const CollectionStoreContext = React.createContext(undefined);

export function DopeProvider({ children }: { children: any }) {
  return children;
}

export function useDopeStore<T>(selector: (state: any) => T): T {
  const mockState = {
    dopeLootClaimState: {},
    isInitialized: false,
    lootItems: [],
    gearItems: [],
    hustlers: [],
    toriiClient: null,
    setToriiClient: () => {},
    init: async () => {},
    clearSubscriptions: () => {},
    collections: {},
    tokens: [],
    parsedTokens: [],
    componentValues: [],
    getComponentValuesBySlug: () => [],
  };
  return selector(mockState);
}

// Type stubs
export type ComponentValueEvent = {
  component_id: number;
  collection_id: string;
  component_slug: string;
  id: number;
  value: string;
};

export type ParsedToken = {
  tokenId: number;
  owner: string;
  metadata: any;
};

// Re-export anything else as no-ops
export const createDopeStore = () => ({
  getState: () => ({}),
  setState: () => {},
  subscribe: () => () => {},
  destroy: () => {},
});
