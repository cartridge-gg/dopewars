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

import { Drugs, Locations, TravelEvents } from "./state";

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

export interface EventProps {
  name: TravelEvents;
  slug: string;
  text: string;
  imageSrc: string;
}

export const events: EventProps[] = [
  {
    name: TravelEvents.Arrested,
    slug: "arrested",
    text: "You lost a turn",
    imageSrc: "/images/events/police_cruiser.gif",
  },
  {
    name: TravelEvents.Mugged,
    slug: "mugged",
    text: "You lost half your supply",
    imageSrc: "/images/events/smoking_gun.gif",
  },
];

export interface UiState {
  isConnected: boolean;
  locations: LocationProps[];
  drugs: DrugProps[];
  events: EventProps[];
  getLocationBySlug: (slug: string) => LocationProps;
  getLocationByName: (name: string) => LocationProps;
  getDrugBySlug: (slug: string) => DrugProps;
  getDrugByName: (name: string) => DrugProps;
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

export const getLocationByName = (name: string): LocationProps => {
  const { locations } = useUiStore.getState();
  const location = locations.find((i) => i.name === name);
  return location || locations[0];
};

export const getDrugBySlug = (slug: string): DrugProps => {
  const { drugs } = useUiStore.getState();
  const drug = drugs.find((i) => i.slug === slug);
  return drug || drugs[0];
};

export const getDrugByName = (name: string): DrugProps => {
  const { drugs } = useUiStore.getState();
  const drug = drugs.find((i) => i.name === name);
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
  getLocationByName,
  getDrugBySlug,
  getDrugByName,
  getEventBySlug,
  getEventByName,
  isBackButtonVisible,
}));
