import type { Meta, StoryObj } from "@storybook/react";
import SeasonIndex from "@/pages/season/index";
import { withMockProviders } from "@/__mocks__/MockDojoProvider";

const meta: Meta = {
  title: "Screens/Season",
  component: SeasonIndex,
  decorators: [withMockProviders()],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      router: { pathname: "/season", query: {} },
    },
  },
};
export default meta;

type Story = StoryObj;

export const SeasonList: Story = {};

export const SeasonListMobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile" } },
};
