import type { Meta, StoryObj } from "@storybook/react";
import Logs from "@/pages/[gameId]/logs";
import { withMockProviders } from "@/__mocks__/MockDojoProvider";
import { createMockGame, createMockGameEvents } from "@/__mocks__/mockData";

const meta: Meta = {
  title: "Screens/GameLogs",
  component: Logs,
  decorators: [
    withMockProviders({
      gameEvents: createMockGameEvents({
        events: [
          {
            eventName: "Traveled",
            event: { game_id: 1, player_id: "0x1", turn: 1, from_location: 0, to_location: 1 },
            idx: 0,
          },
          {
            eventName: "TradeDrug",
            event: { game_id: 1, player_id: "0x1", turn: 1, drug_id: 2, quantity: 5, price: 30, is_buy: true },
            idx: 1,
          },
          {
            eventName: "Traveled",
            event: { game_id: 1, player_id: "0x1", turn: 2, from_location: 1, to_location: 3 },
            idx: 2,
          },
        ],
        sortedEvents: [],
      }),
    }),
  ],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      router: {
        pathname: "/[gameId]/logs",
        query: { gameId: "0x1" },
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile" } },
};
