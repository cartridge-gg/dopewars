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
import React from "react";

export interface LocationProps {
  name: Locations;
  slug: string;
  icon: React.FC;
}

export const locations: LocationProps[] = [
  {
    name: Locations.Central,
    slug: "central",
    icon: CentralPark,
  },
  {
    name: Locations.Queens,
    slug: "queens",
    icon: Queens,
  },
  {
    name: Locations.Bronx,
    slug: "bronx",
    icon: StatenIsland,
  },
  {
    name: Locations.Jersey,
    slug: "jersey",
    icon: Manhattan,
  },
  {
    name: Locations.Coney,
    slug: "coney",
    icon: ConeyIsland,
  },
  {
    name: Locations.Brooklyn,
    slug: "brooklyn",
    icon: Brooklyn,
  },
];

export interface DrugProps {
  name: Drugs;
  slug: string;
  icon: React.FC;
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
  getLocationBySlug: (slug: string) => LocationProps;
  getLocationByName: (name: string) => LocationProps;
  getDrugBySlug: (slug: string) => DrugProps;
  getDrugByName: (name: string) => DrugProps;
  isBackButtonVisible: (pathname: string) => Boolean;
}

export const setIsConnected = (isConnected: boolean) =>
  useUiStore.setState((state) => ({ isConnected }));

export const isBackButtonVisible = (pathname: string): Boolean => {
  return ["/[game]/location/[locationSlug]/[drugSlug]"].includes(pathname);
};

export const getLocationBySlug = (slug: string): LocationProps => {
  const { locations } = useUiStore.getState();
  const location = locations.find((i) => i.slug === slug);
  return location || locations[0] ;
};

export const getLocationByName = (name: string): LocationProps => {
  const { locations } = useUiStore.getState();
  const location = locations.find((i) => i.name === name);
  return location || locations[0] ;
};

export const getDrugBySlug = (slug: string): DrugProps => {
  const { drugs } = useUiStore.getState();
  const drug = drugs.find((i) => i.slug === slug);
  return drug || drugs[0] ;
};

export const getDrugByName = (name: string): DrugProps => {
  const { drugs } = useUiStore.getState();
  const drug = drugs.find((i) => i.name === name);
  return drug || drugs[0] ;
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
