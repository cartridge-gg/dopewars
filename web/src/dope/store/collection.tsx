import { CairoCustomEnum } from "starknet";
import { StateCreator } from "zustand";
import { parseModels, queryAllModels } from "../toriiUtils";
import { decodeAsset, Rect } from "../helpers/decode";
import { feltToString } from "../helpers/felt";
import { DopeState } from "./store";

export type Collection = {
  id: string;
  name: string;
  components: string[];
};

export type CollectionComponent = {
  collection_id: string;
  id: number;
  slug: string;
  name: string;
  count: number;
  libraries_count: number[];
  libraries: string[];
};

export type CollectionComponentList = {
  collection_id: string;
  id: string;
  components: string[];
};

export type ComponentValueEvent = {
  collection_id: string;
  component_slug: string;
  component_id: number;
  id: number;
  value: string;
  palette: string;
  resources: Array<Rect[]>;
  stats?: Array<CairoCustomEnum>;
};

type State = {
  collections: Collection[];
  collectionComponents: CollectionComponent[];
  collectionComponentLists: CollectionComponentList[];
  componentValues: ComponentValueEvent[];
  palettes: Record<string, string[]>;
};

type Action = {
  init: (tokenAddresses: string[]) => void;
  initCollections: () => void;
  initCollectionComponents: () => void;
  initCollectionComponentLists: () => void;
  initComponentValues: () => void;
  initPalettes: () => void;
  //
  getCollectionById: (collectionId: string) => Collection[];
  getCollectionComponentsById: (collectionId: string) => CollectionComponent[];
  getCollectionComponentList: (
    collectionId: string,
    id: string
  ) => CollectionComponentList;
  getComponentValuesBySlug: (
    collectionId: string,
    componentSlug: string
  ) => ComponentValueEvent[];
};

export type CollectionState = State & Action;

export const createCollectionStore: StateCreator<
  DopeState,
  [],
  [],
  CollectionState
> = (set, get) => ({
  collections: [],
  collectionComponents: [],
  collectionComponentLists: [],
  componentValues: [],
  palettes: {},
  dopeLootClaimState: {},
  subscriptions: [],
  init: async (tokenAddresses: string[]) => {
    await get().initCollections();
    await get().initPalettes();
    await get().initCollectionComponents();
    await get().initCollectionComponentLists();
    await get().initComponentValues();
    //
    await get().initTokens(tokenAddresses);
    await get().initDopeLootClaimState();

    await get().subscribe(tokenAddresses);
  },
  //

  getCollectionById: (collectionId: string) => {
    return get().collections.filter((i) => i.id === collectionId);
  },
  getCollectionComponentsById: (collectionId: string) => {
    return get().collectionComponents.filter(
      (i) => i.collection_id === collectionId
    );
  },
  getComponentValuesBySlug: (collectionId: string, componentSlug: string) => {
    return get().componentValues.filter(
      (i) =>
        i.collection_id === collectionId && i.component_slug === componentSlug
    );
  },
  getCollectionComponentList: (collectionId: string, id: string) => {
    return get().collectionComponentLists.find(
      (i) => i.collection_id === collectionId && i.id === id
    )!;
  },

  //
  initCollections: async () => {
    const entities = await get().toriiClient!.getEntities(
      queryAllModels(["dope-Collection"], 10)
    );
    const collections = parseModels(entities, "dope-Collection");

    const parsed = collections.map((i) => ({
      ...i,
      id: feltToString(i.id),
      components: i.components.map((i: string) => feltToString(i)),
    }));

    set({
      collections: parsed,
    });
  },
  //
  initCollectionComponents: async () => {
    const entities = await get().toriiClient!.getEntities(
      queryAllModels(["dope-CollectionComponent"])
    );

    const components = parseModels(entities, "dope-CollectionComponent");
    const parsed = components
      .map((i) => ({
        ...i,
        collection_id: feltToString(i.collection_id),
        slug: feltToString(i.slug),
        id: Number(i.id),
      }))
      .sort((a, b) => a.component_id - b.component_id);

    set({
      collectionComponents: parsed,
    });
  },
  //
  initCollectionComponentLists: async () => {
    const entities = await get().toriiClient!.getEntities(
      queryAllModels(["dope-CollectionComponentList"])
    );
    const components = parseModels(entities, "dope-CollectionComponentList");
    const parsed = components.map((i) => ({
      ...i,
      collection_id: feltToString(i.collection_id),
      id: feltToString(i.id),
      components: i.components.map(feltToString),
    }));
    set({
      collectionComponentLists: parsed,
    });
  },
  //
  initComponentValues: async () => {
    const entities = await get().toriiClient!.getEventMessages(
      queryAllModels([
        "dope-ComponentValueEvent",
        "dope-ComponentValueResourceEvent",
        "dope-StatEvent",
      ])
    );

    const parsedComponentValues = parseModels(
      entities,
      "dope-ComponentValueEvent"
    )
      .map((i) => ({
        ...i,
        collection_id: feltToString(i.collection_id),
        component_slug: feltToString(i.component_slug),
        component_id: Number(i.component_id),
      }))
      .sort((a, b) => a.id - b.id);

    const parsedComponentValueResources = parseModels(
      entities,
      "dope-ComponentValueResourceEvent"
    )
      .map((i) => ({
        ...i,
        collection_id: feltToString(i.collection_id),
        component_slug: feltToString(i.component_slug),
      }))
      .sort((a, b) => a.id - b.id);

    const parsedStatsValues = parseModels(entities, "dope-StatEvent");

    for (const componentValue of parsedComponentValues) {
      const resource0 =
        parsedComponentValueResources
          .filter(
            (r) =>
              r.collection_id === componentValue.collection_id &&
              r.component_slug === componentValue.component_slug &&
              r.id === componentValue.id &&
              r.index === 0
          )
          .sort((a, b) => a.group_order - b.group_order)
          .map((r) => r.resource)
          .flat() || [];
      const resource1 =
        parsedComponentValueResources
          .filter(
            (r) =>
              r.collection_id === componentValue.collection_id &&
              r.component_slug === componentValue.component_slug &&
              r.id === componentValue.id &&
              r.index === 1
          )
          .sort((a, b) => a.group_order - b.group_order)
          .map((r) => r.resource)
          .flat() || [];
      const palette = get().palettes[componentValue.palette];
      if (palette) {
        componentValue.resources = [
          decodeAsset(resource0, palette).rects,
          decodeAsset(resource1, palette).rects,
        ];
      }
      componentValue.stats = parsedStatsValues.find(
        (i) =>
          i.slot_id === componentValue.component_id &&
          i.item_id === componentValue.id
      )?.stats;
    }
    set({
      componentValues: parsedComponentValues,
    });
  },
  //
  initPalettes: async () => {
    const entities = await get().toriiClient!.getEventMessages(
      queryAllModels(["dope-PaletteEvent"])
    );
    const parsedPaletteEvents = parseModels(entities, "dope-PaletteEvent");

    const uniquePaletteIds = new Set(parsedPaletteEvents.map((i) => i.id));
    const parsed = Array.from(uniquePaletteIds.values()).reduce(
      (o, id: string) => {
        return {
          ...o,
          [id]: (parsedPaletteEvents
            .filter((e) => e.id === id)
            .sort((a, b) => a.group_order - b.group_order)
            .map((r) => r.colors)
            .flat() || []) as string[],
        };
      },
      {}
    );
    set({ palettes: parsed });
  },
});

//
//
//
