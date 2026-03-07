import type { Meta, StoryObj } from "@storybook/react";
import Travel from "@/pages/[gameId]/travel";
import { withMockProviders } from "@/__mocks__/MockDojoProvider";
import { createMockGame, mockLocations, mockDrugs } from "@/__mocks__/mockData";

const meta: Meta = {
  title: "Screens/Travel",
  component: Travel,
  decorators: [withMockProviders()],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      router: { pathname: "/[gameId]/travel", query: { gameId: "0x1" } },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile" } },
};

export const FirstTurn: Story = {
  decorators: [
    withMockProviders({
      game: createMockGame({
        player: { turn: 0, location: undefined },
      }),
    }),
  ],
};

export const WithDrugs: Story = {
  decorators: [
    withMockProviders({
      game: createMockGame({
        drugs: { drug: mockDrugs[7], _drug: mockDrugs[7], quantity: 20, _quantity: 20 },
      }),
    }),
  ],
};
