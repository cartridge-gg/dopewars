/** @type {import('next').NextConfig} */

import path from "path";
const nextConfig = {
  productionBrowserSourceMaps: true,
  // https://rishabhsharma.bio/next-js-issue-useeffect-hook-running-twice-in-client-9fb6712f6362
  reactStrictMode: false, // disable double rendering in dev mode, causing issues with controller
  // images: {
  //   domains: ["static.cartridge.gg", "static.localhost"],
  // },
  // dev: "NODE_OPTIONS=--experimental-wasm-modules next dev",
  // outputFileTracingRoot: import.meta.dirname,
  // outputFileTracingIncludes: {
  //    "/": ["./node_modules/@dope/dope-sdk/**"],
  // },
  webpack: (config, options) => {
    // console.log(config)
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
      // starknet: path.resolve("./node_modules/starknet"),
    };
    return config;
  },
  // turbopack: {
  //   root: import.meta.dirname,
  //   // root: path.resolve( import.meta.dirname,".."),
  //   resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".mjs", ".json", ".wasm"],
  //   resolveAlias: {
  //     "@dope/dope-sdk": "./node_modules/@dope/dope-sdk",
  //   },
  // },
};

import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disableDevLogs: true,
  disable: process.env.NODE_ENV === "development",
});

export default withPWA(nextConfig);

// "@next/bundle-analyzer": "^14.1.1",
// import bundleAnalyzer from "@next/bundle-analyzer";

// const withBundleAnalyzer = bundleAnalyzer({
//   enabled: true//process.env.ANALYZE === 'true',
// })

// export default withBundleAnalyzer(withPWA(nextConfig))
