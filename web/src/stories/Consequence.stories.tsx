import type { Meta, StoryObj } from "@storybook/react";
import Consequence from "@/pages/[gameId]/event/consequence";
import { withMockProviders } from "@/__mocks__/MockDojoProvider";
import {
  createMockGame,
  createMockEncounter,
  createMockEncounterResult,
  createMockGameEvents,
} from "@/__mocks__/mockData";
import { Encounters, EncounterOutcomes } from "@/dojo/types";

const copsEncounterEvent = {
  eventName: "TravelEncounter",
  event: createMockEncounter({ encounter: Encounters.Cops, level: 3 }),
  idx: 1,
};

const gangEncounterEvent = {
  eventName: "TravelEncounter",
  event: createMockEncounter({ encounter: Encounters.Gang, level: 2 }),
  idx: 1,
};

const meta: Meta = {
  title: "Screens/Consequence",
  component: Consequence,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      router: {
        pathname: "/[gameId]/event/consequence",
        query: { gameId: "0x1" },
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Victory: Story = {
  decorators: [
    withMockProviders({
      gameEvents: createMockGameEvents({
        events: [{}, {}],
        lastEncounter: copsEncounterEvent,
        lastEncounterResult: {
          eventName: "TravelEncounterResult",
          event: createMockEncounterResult({
            outcome: EncounterOutcomes.Victorious,
            action: "Fight",
            cash_earnt: 800,
            rep_pos: 5,
          }),
          idx: 2,
        },
      }),
    }),
  ],
};

export const VictoryMobile: Story = {
  ...Victory,
  parameters: { viewport: { defaultViewport: "mobile" } },
};

export const Died: Story = {
  decorators: [
    withMockProviders({
      game: createMockGame({ player: { health: 0 } }),
      gameEvents: createMockGameEvents({
        events: [{}, {}],
        isGameOver: true,
        lastEncounter: gangEncounterEvent,
        lastEncounterResult: {
          eventName: "TravelEncounterResult",
          event: createMockEncounterResult({
            outcome: EncounterOutcomes.Died,
            action: "Fight",
            cash_loss: 5000,
          }),
          idx: 2,
        },
      }),
    }),
  ],
};

export const Escaped: Story = {
  decorators: [
    withMockProviders({
      gameEvents: createMockGameEvents({
        events: [{}, {}],
        lastEncounter: gangEncounterEvent,
        lastEncounterResult: {
          eventName: "TravelEncounterResult",
          event: createMockEncounterResult({
            outcome: EncounterOutcomes.Escaped,
            action: "Run",
            drug_loss: [2],
            drug_id: 2,
          }),
          idx: 2,
        },
      }),
    }),
  ],
};

export const Paid: Story = {
  decorators: [
    withMockProviders({
      gameEvents: createMockGameEvents({
        events: [{}, {}],
        lastEncounter: copsEncounterEvent,
        lastEncounterResult: {
          eventName: "TravelEncounterResult",
          event: createMockEncounterResult({
            outcome: EncounterOutcomes.Paid,
            action: "Pay",
            drug_loss: [5],
            drug_id: 2,
            rep_neg: 3,
          }),
          idx: 2,
        },
      }),
    }),
  ],
};

export const Jailed: Story = {
  decorators: [
    withMockProviders({
      gameEvents: createMockGameEvents({
        events: [{}, {}],
        lastEncounter: copsEncounterEvent,
        lastEncounterResult: {
          eventName: "TravelEncounterResult",
          event: createMockEncounterResult({
            outcome: EncounterOutcomes.Jailed,
            action: "Run",
            turn_loss: 2,
            rep_neg: 5,
          }),
          idx: 2,
        },
      }),
    }),
  ],
};

export const Hospitalized: Story = {
  decorators: [
    withMockProviders({
      gameEvents: createMockGameEvents({
        events: [{}, {}],
        lastEncounter: gangEncounterEvent,
        lastEncounterResult: {
          eventName: "TravelEncounterResult",
          event: createMockEncounterResult({
            outcome: EncounterOutcomes.Hospitalized,
            action: "Fight",
            turn_loss: 1,
            rep_neg: 5,
          }),
          idx: 2,
        },
      }),
    }),
  ],
};
