import type { Meta, StoryObj } from "@storybook/react";
import DrugTradePage from "@/pages/[gameId]/[locationSlug]/[drugSlug]/index";
import { withMockProviders } from "@/__mocks__/MockDojoProvider";
import { createMockGame, mockDrugs } from "@/__mocks__/mockData";

const meta: Meta = {
  title: "Screens/DrugTrade",
  component: DrugTradePage,
  decorators: [withMockProviders()],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      router: {
        pathname: "/[gameId]/[locationSlug]/[drugSlug]",
        query: {
          gameId: "0x1",
          locationSlug: "queens",
          drugSlug: "weed",
          tradeDirection: "buy",
        },
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const BuyMode: Story = {};

export const BuyModeMobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile" } },
};

export const SellMode: Story = {
  decorators: [
    withMockProviders({
      game: createMockGame({
        drugs: { drug: mockDrugs[2], _drug: mockDrugs[2], quantity: 20, _quantity: 20 },
      }),
    }),
  ],
  parameters: {
    nextjs: {
      router: {
        pathname: "/[gameId]/[locationSlug]/[drugSlug]",
        query: {
          gameId: "0x1",
          locationSlug: "queens",
          drugSlug: "weed",
          tradeDirection: "sell",
        },
      },
    },
  },
};

export const BuyAndSell: Story = {
  decorators: [
    withMockProviders({
      game: createMockGame({
        drugs: { drug: mockDrugs[2], _drug: mockDrugs[2], quantity: 10, _quantity: 10 },
      }),
    }),
  ],
};
