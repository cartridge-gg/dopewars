import { ComponentType, createContext, useContext, useEffect, useRef, useState } from "react";
import { createDopeStore, DopeState, DopeStore } from "./store";
import { useStore } from "zustand";
import { ToriiClient } from "@dojoengine/torii-client";

export const CollectionStoreContext = createContext<DopeStore | undefined>(undefined);

export function DopeProvider({
  toriiClient,
  children,
  ErrorComponent,
}: {
  toriiClient: ToriiClient;
  children: any;
  ErrorComponent?: ComponentType;
  onError?: (e: any) => void;
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasError, setHasError] = useState(false);

  const storeRef = useRef<DopeStore>(undefined);
  useEffect(() => {
    storeRef.current = createDopeStore();
    storeRef.current.getState().setToriiClient(toriiClient);

    return () => {
      storeRef.current?.getState().clearSubscriptions();
    };
  }, [toriiClient]);

  useEffect(() => {
    const initAsync = async () => {
      try {
        await storeRef.current?.getState().init([
          // "0x061ad9cc4708f908457c35a37da377b74f3c60b2d1fd27a09e9e9af0a555b2e4",
          //  "0x07de16f0faf7ef5469a310c0faa702087b3c9bb7e87b0466c3e9f8eb3c52b065",
          // "0x01167ccc71087888b9fcf986101a42eb09994701c1818e86278f945d01293938",
        ]);
        setIsInitialized(true);
      } catch (e: any) {
        console.log(e);
        setHasError(true);
      }
    };

    if (toriiClient) {
      initAsync();
    }
  }, [toriiClient]);

  if (!isInitialized && !hasError) return null;

  if (!isInitialized && hasError) {
    return <>{ErrorComponent && <ErrorComponent />}</>;
  }

  return <CollectionStoreContext.Provider value={storeRef.current}>{children}</CollectionStoreContext.Provider>;
}

export function useDopeStore<T>(selector: (state: DopeState) => T): T {
  const store = useContext(CollectionStoreContext);
  if (!store) throw new Error("Missing CollectionStoreContext.Provider in the tree");
  return useStore(store, selector);
}
