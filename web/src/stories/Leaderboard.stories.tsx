import type { Meta, StoryObj } from "@storybook/react";
import { Leaderboard } from "@/components/pages/home";
import { withMockProviders } from "@/__mocks__/MockDojoProvider";

const meta: Meta = {
  title: "Screens/Leaderboard",
  component: Leaderboard,
  decorators: [withMockProviders()],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      router: { pathname: "/", query: {} },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile" } },
};
