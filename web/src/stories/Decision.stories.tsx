import type { Meta, StoryObj } from "@storybook/react";
import Decision from "@/pages/[gameId]/event/decision";
import { withMockProviders } from "@/__mocks__/MockDojoProvider";
import {
  createMockGame,
  createMockEncounter,
  createMockGameEvents,
} from "@/__mocks__/mockData";
import { Encounters, PlayerStatus } from "@/dojo/types";

const copsEncounter = createMockEncounter({
  encounter: Encounters.Cops,
  level: 3,
  health: 60,
  attack: 25,
  defense: 20,
  speed: 15,
  demand_pct: 40,
  payout: 800,
});

const gangEncounter = createMockEncounter({
  encounter: Encounters.Gang,
  level: 2,
  health: 40,
  attack: 18,
  defense: 12,
  speed: 20,
  demand_pct: 25,
  payout: 400,
});

const meta: Meta = {
  title: "Screens/Decision",
  component: Decision,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      router: {
        pathname: "/[gameId]/event/decision",
        query: { gameId: "0x1" },
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const CopsEncounter: Story = {
  decorators: [
    withMockProviders({
      game: createMockGame({
        player: { status: PlayerStatus.BeingArrested },
      }),
      gameEvents: createMockGameEvents({
        lastEncounter: {
          eventName: "TravelEncounter",
          event: copsEncounter,
          idx: 1,
        },
      }),
    }),
  ],
};

export const CopsEncounterMobile: Story = {
  ...CopsEncounter,
  parameters: { viewport: { defaultViewport: "mobile" } },
};

export const GangEncounter: Story = {
  decorators: [
    withMockProviders({
      game: createMockGame({
        player: { status: PlayerStatus.BeingMugged },
      }),
      gameEvents: createMockGameEvents({
        lastEncounter: {
          eventName: "TravelEncounter",
          event: gangEncounter,
          idx: 1,
        },
      }),
    }),
  ],
};

export const GangEncounterMobile: Story = {
  ...GangEncounter,
  parameters: { viewport: { defaultViewport: "mobile" } },
};
