import React, { ReactNode } from "react";

// Mock Next.js router for Storybook
// @storybook/nextjs handles Next.js router automatically,
// but we provide this for explicit router query overrides.

export const mockRouterQuery = {
  gameId: "0x1",
  locationSlug: "queens",
  drugSlug: "weed",
  tradeDirection: "buy",
  seasonId: "1",
  gameModeName: "Ranked",
};

// For Storybook with @storybook/nextjs, use nextjs.router parameter:
// parameters: {
//   nextjs: {
//     router: {
//       pathname: '/[gameId]/travel',
//       query: { gameId: '0x1' },
//     },
//   },
// },
