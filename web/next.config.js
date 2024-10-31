/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  // images: {
  //   domains: ["static.cartridge.gg", "static.localhost"],
  // },
  // dev: "NODE_OPTIONS=--experimental-wasm-modules next dev",
  webpack: (config, options) => {
    // console.log(config)
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    };
    return config;
  },
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
