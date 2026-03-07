import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, "../src");
const mocksDir = path.resolve(srcDir, "__mocks__");
const hookMocksDir = path.resolve(mocksDir, "hooks");

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};

    config.resolve.alias = {
      ...config.resolve.alias,
      // Mock provider-dependent modules
      [path.resolve(srcDir, "hooks/PaperPriceContext")]: path.resolve(mocksDir, "hookMocks.ts"),
      [path.resolve(srcDir, "dope/store/DopeProvider")]: path.resolve(mocksDir, "dopeStoreMock.ts"),
      [path.resolve(srcDir, "dope/components")]: path.resolve(mocksDir, "dopeComponentsMock.tsx"),
      // Mock starknet hooks for connected wallet state
      "@starknet-react/core": path.resolve(mocksDir, "starknetCoreMock.ts"),
      // Mock data-fetching hooks
      [path.resolve(srcDir, "dojo/hooks/useSeasonByVersion")]: path.resolve(hookMocksDir, "useSeasonByVersion.tsx"),
      [path.resolve(srcDir, "dojo/hooks/useRegisteredGamesBySeason")]: path.resolve(hookMocksDir, "useRegisteredGamesBySeason.tsx"),
      [path.resolve(srcDir, "dojo/hooks/useSeasons")]: path.resolve(hookMocksDir, "useSeasons.tsx"),
      [path.resolve(srcDir, "dojo/hooks/useSystems")]: path.resolve(hookMocksDir, "useSystems.ts"),
      [path.resolve(srcDir, "dojo/hooks/useSql")]: path.resolve(hookMocksDir, "useSql.ts"),
      [path.resolve(srcDir, "dojo/hooks/useActiveGamesBySeason")]: path.resolve(hookMocksDir, "useOtherHooks.ts"),
      [path.resolve(srcDir, "dojo/hooks/useHallOfFame")]: path.resolve(hookMocksDir, "useOtherHooks.ts"),
      [path.resolve(srcDir, "dojo/hooks/useTokenBalance")]: path.resolve(hookMocksDir, "useOtherHooks.ts"),
      [path.resolve(srcDir, "dojo/hooks/useClaimable")]: path.resolve(hookMocksDir, "useOtherHooks.ts"),
      [path.resolve(srcDir, "dojo/hooks/useControllerUsername")]: path.resolve(hookMocksDir, "useOtherHooks.ts"),
      [path.resolve(srcDir, "dojo/hooks/useGameById")]: path.resolve(hookMocksDir, "useOtherHooks.ts"),
      // General path alias
      "@": srcDir,
    };

    // WASM support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    };

    return config;
  },
};

export default config;
