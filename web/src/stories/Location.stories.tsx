import type { Meta, StoryObj } from "@storybook/react";
import LocationPage from "@/pages/[gameId]/[locationSlug]/index";
import { withMockProviders } from "@/__mocks__/MockDojoProvider";
import { createMockGame, mockDrugs } from "@/__mocks__/mockData";

const meta: Meta = {
  title: "Screens/Location",
  component: LocationPage,
  decorators: [withMockProviders()],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      router: {
        pathname: "/[gameId]/[locationSlug]",
        query: { gameId: "0x1", locationSlug: "queens" },
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

export const LastDay: Story = {
  decorators: [
    withMockProviders({
      game: createMockGame({
        player: { turn: 29 },
        gameConfig: { max_turns: 30 },
      }),
    }),
  ],
};

export const WithDrugs: Story = {
  decorators: [
    withMockProviders({
      game: createMockGame({
        drugs: { drug: mockDrugs[2], _drug: mockDrugs[2], quantity: 15, _quantity: 15 },
      }),
    }),
  ],
};

export const BrokeCantBuy: Story = {
  decorators: [
    withMockProviders({
      game: createMockGame({
        player: { _cash: 0, cash: 0 },
      }),
    }),
  ],
};
