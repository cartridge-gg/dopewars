import { create } from "zustand";

import {
  Brooklyn,
  CentralPark,
  ConeyIsland,
  Manhattan,
  Queens,
  Bronx,
} from "@/components/icons/locations";

import {
  Ludes,
  Weed,
  Acid,
  Speed,
  Heroin,
  Cocaine,
} from "@/components/icons/drugs";

import { Drugs, Locations, TravelEvents } from "./state";
import React from "react";

export interface LocationProps {
  name: Locations;
  slug: string;
  icon: React.FC;
  id: string;
}

export const locations: LocationProps[] = [
  {
    name: Locations.Central,
    slug: "central",
    icon: CentralPark,
    id: "0x43656e7472616c205061726b",
  },
  {
    name: Locations.Queens,
    slug: "queens",
    icon: Queens,
    id: "0x517565656e73",
  },
  {
    name: Locations.Bronx,
    slug: "bronx",
    icon: Bronx,
    id: "0x5468652042726f6e78",
  },
  {
    name: Locations.Jersey,
    slug: "jersey",
    icon: Manhattan,
    id: "0x4a65727365792043697479",
  },
  {
    name: Locations.Coney,
    slug: "coney",
    icon: ConeyIsland,
    id: "0x436f6e65792049736c616e64",
  },
  {
    name: Locations.Brooklyn,
    slug: "brooklyn",
    icon: Brooklyn,
    id: "0x42726f6f6b6c796e",
  },
];

export interface DrugProps {
  name: Drugs;
  slug: string;
  icon: React.FC;
  id: string;
}

const drugs: DrugProps[] = [
  {
    name: Drugs.Ludes,
    slug: "ludes",
    icon: Ludes,
    id: "0x4c75646573",
  },
  {
    name: Drugs.Speed,
    slug: "speed",
    icon: Speed,
    id: "0x5370656564",
  },
  {
    name: Drugs.Weed,
    slug: "weed",
    icon: Weed,
    id: "0x57656564",
  },
  {
    name: Drugs.Acid,
    slug: "acid",
    icon: Acid,
    id: "0x41636964",
  },
  {
    name: Drugs.Heroin,
    slug: "heroin",
    icon: Heroin,
    id: "0x4865726f696e",
  },
  {
    name: Drugs.Cocaine,
    slug: "cocaine",
    icon: Cocaine,
    id: "0x436f6361696e65",
  },
];

export interface EventProps {
  name: TravelEvents;
  slug: string;
  description: string;
  imageSrc: string;
}

export const events: EventProps[] = [
  {
    name: TravelEvents.Arrested,
    slug: "arrested",
    description: "You lost a turn",
    imageSrc: "/images/events/police_cruiser.gif",
  },
  {
    name: TravelEvents.Mugged,
    slug: "mugged",
    description: "You lost half your cash",
    imageSrc: "/images/events/smoking_gun.gif",
  },
];

export interface UiState {
  isConnected: boolean;
  locations: LocationProps[];
  drugs: DrugProps[];
  events: EventProps[];
  getLocationBySlug: (slug: string) => LocationProps;
  getLocationById: (id: string) => LocationProps;
  getDrugBySlug: (slug: string) => DrugProps;
  getDrugById: (name: string) => DrugProps;
  getEventBySlug: (slug: string) => EventProps;
  getEventByName: (name: string) => EventProps;
  isBackButtonVisible: (pathname: string) => Boolean;
}

export const setIsConnected = (isConnected: boolean) =>
  useUiStore.setState((state) => ({ isConnected }));

export const isBackButtonVisible = (pathname: string): Boolean => {
  return ["/[game]/[locationSlug]/[drugSlug]"].includes(pathname);
};

export const getLocationBySlug = (slug: string): LocationProps => {
  const { locations } = useUiStore.getState();
  const location = locations.find((i) => i.slug === slug);
  return location || locations[0];
};

export const getLocationById = (id: string): LocationProps => {
  const { locations } = useUiStore.getState();
  const location = locations.find((i) => i.id === id);
  return location || locations[0];
};

export const getDrugBySlug = (slug: string): DrugProps => {
  const { drugs } = useUiStore.getState();
  const drug = drugs.find((i) => i.slug === slug);
  return drug || drugs[0];
};

export const getDrugById = (id: string): DrugProps => {
  const { drugs } = useUiStore.getState();
  const drug = drugs.find((i) => i.id === id);
  return drug || drugs[0];
};

export const getEventByName = (name: string): EventProps => {
  const { events } = useUiStore.getState();
  const event = events.find((i) => i.name === name);
  return event || events[0];
};

export const getEventBySlug = (slug: string): EventProps => {
  const { events } = useUiStore.getState();
  const event = events.find((i) => i.slug === slug);
  return event || events[0];
};

export const useUiStore = create<UiState>(() => ({
  isConnected: false,
  locations,
  drugs,
  events,
  getLocationBySlug,
  getLocationById,
  getDrugBySlug,
  getDrugById,
  getEventBySlug,
  getEventByName,
  isBackButtonVisible,
}));
