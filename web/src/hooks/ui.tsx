import { create } from "zustand";

import {
  Brooklyn,
  CentralPark,
  ConeyIsland,
  Manhattan,
  Queens,
  StatenIsland,
} from "@/components/icons/locations";

import {
  Ludes,
  Weed,
  Acid,
  Speed,
  Heroin,
  Cocaine,
} from "@/components/icons/drugs";

import { Drugs, Locations } from "./state";

import { Router, useRouter } from "next/router";

export interface LocationProps {
  name: Locations;
  slug: string;
  icon: ReactNode;
}

export const locations: LocationProps[] = [
  {
    name: Locations.Central,
    slug: "central",
    icon: <CentralPark />,
  },
  {
    name: Locations.Queens,
    slug: "queens",
    icon: <Queens />,
  },
  {
    name: Locations.Bronx,
    slug: "bronx",
    icon: <StatenIsland />,
  },
  {
    name: Locations.Jersey,
    slug: "jersey",
    icon: <Manhattan />,
  },
  {
    name: Locations.Coney,
    slug: "coney",
    icon: <ConeyIsland />,
  },
  {
    name: Locations.Brooklyn,
    slug: "brooklyn",
    icon: <Brooklyn />,
  },
];

export interface DrugProps {
  name: Drugs;
  slug: string;
  icon: ReactNode;
}

const drugs: DrugProps[] = [
  {
    name: Drugs.Ludes,
    slug: "ludes",
    icon: Ludes,
  },
  {
    name: Drugs.Speed,
    slug: "speed",
    icon: Speed,
  },
  {
    name: Drugs.Weed,
    slug: "weed",
    icon: Weed,
  },
  {
    name: Drugs.Acid,
    slug: "acid",
    icon: Acid,
  },
  {
    name: Drugs.Heroin,
    slug: "heroin",
    icon: Heroin,
  },
  {
    name: Drugs.Cocaine,
    slug: "cocaine",
    icon: Cocaine,
  },
];

export interface UiState {
  isConnected: boolean;
  locations: LocationProps[];
  drugs: DrugProps[];
  getLocationBySlug: (slug: string) => LocationProps | undefined;
  getLocationByName: (name: string) => LocationProps | undefined;
  getDrugBySlug: (slug: string) => DrugProps | undefined;
  getDrugByName: (name: string) => DrugProps | undefined;
  isBackButtonVisible: () => Boolean;
}

export const setIsConnected = (isConnected: boolean) =>
  useUiStore.setState((state) => ({ isConnected }));

export const isBackButtonVisible = (): Boolean => {
  const router = useRouter();
  return ["/[game]/location/[locationSlug]/[drugSlug]"].includes(
    router.pathname,
  );
};

export const getLocationBySlug = (slug: string): DrugProps | undefined => {
  const { locations } = useUiStore.getState();
  return locations.find((i) => i.slug === slug);
};

export const getLocationByName = (name: string): DrugProps | undefined => {
  const { locations } = useUiStore.getState();
  return locations.find((i) => i.name === name);
};

export const getDrugBySlug = (slug: string): DrugProps | undefined => {
  const { drugs } = useUiStore.getState();
  return drugs.find((i) => i.slug === slug);
};

export const getDrugByName = (name: string): DrugProps | undefined => {
  const { drugs } = useUiStore.getState();
  return drugs.find((i) => i.name === name);
};

export const useUiStore = create<UiState>(() => ({
  isConnected: false,
  locations,
  drugs,
  getLocationBySlug,
  getLocationByName,
  getDrugBySlug,
  getDrugByName,
  isBackButtonVisible,
}));
