import type { Meta, StoryObj } from "@storybook/react";
import End from "@/pages/[gameId]/end";
import { withMockProviders } from "@/__mocks__/MockDojoProvider";
import { createMockGame, createMockGameInfos } from "@/__mocks__/mockData";

const meta: Meta = {
  title: "Screens/GameOver",
  component: End,
  decorators: [withMockProviders()],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      router: {
        pathname: "/[gameId]/end",
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

export const Ranked: Story = {
  decorators: [
    withMockProviders({
      game: createMockGame({
        player: { _cash: 50000, cash: 50000, health: 60 },
      }),
      gameInfos: createMockGameInfos({
        game_mode: "Ranked",
        registered: true,
      }),
    }),
  ],
};

export const Died: Story = {
  decorators: [
    withMockProviders({
      game: createMockGame({
        player: { _cash: 1000, cash: 1000, health: 0 },
      }),
    }),
  ],
};

export const Unregistered: Story = {
  decorators: [
    withMockProviders({
      game: createMockGame({
        player: { _cash: 25000, cash: 25000, health: 40 },
      }),
      gameInfos: createMockGameInfos({
        game_mode: "Ranked",
        registered: false,
      }),
    }),
  ],
};
