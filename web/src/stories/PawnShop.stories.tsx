import type { Meta, StoryObj } from "@storybook/react";
import PawnShop from "@/pages/[gameId]/pawnshop";
import { withMockProviders } from "@/__mocks__/MockDojoProvider";
import { createMockGame } from "@/__mocks__/mockData";

const meta: Meta = {
  title: "Screens/PawnShop",
  component: PawnShop,
  decorators: [withMockProviders()],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      router: {
        pathname: "/[gameId]/pawnshop",
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

export const MaxedOut: Story = {
  decorators: [
    withMockProviders({
      game: createMockGame({
        items: {
          attackLevel: 3,
          defenseLevel: 3,
          speedLevel: 3,
          transportLevel: 3,
        },
      }),
    }),
  ],
};
