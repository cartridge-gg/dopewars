import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, "../src");
const mocksDir = path.resolve(srcDir, "__mocks__");

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
      // Mock modules that require unavailable providers
      [path.resolve(srcDir, "hooks/PaperPriceContext")]: path.resolve(mocksDir, "hookMocks.ts"),
      [path.resolve(srcDir, "dope/store/DopeProvider")]: path.resolve(mocksDir, "dopeStoreMock.ts"),
      [path.resolve(srcDir, "dope/components")]: path.resolve(mocksDir, "dopeComponentsMock.tsx"),
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
