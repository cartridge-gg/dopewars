import type { Meta, StoryObj } from "@storybook/react";
import Home from "@/pages/index";
import { withMockProviders } from "@/__mocks__/MockDojoProvider";

const meta: Meta = {
  title: "Screens/Home",
  component: Home,
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

export const SeasonPaused: Story = {
  decorators: [
    withMockProviders({
      config: (() => {
        const { createMockConfig } = require("@/__mocks__/mockData");
        const config = createMockConfig();
        config.ryo.paused = true;
        return config;
      })(),
    }),
  ],
};
