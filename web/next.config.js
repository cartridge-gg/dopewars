/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  images: {
    domains: ["static.cartridge.gg", "static.localhost"],
  },

  // "dev": "NODE_OPTIONS=--experimental-wasm-modules next dev",
  // webpack: (config, options) => {
  //   config.experiments = {
  //     asyncWebAssembly: true,
  //   };
  //   return config
  // },
};


// "@next/bundle-analyzer": "^14.1.1",
// import bundleAnalyzer from "@next/bundle-analyzer";

// const withBundleAnalyzer = bundleAnalyzer({
//   enabled: true//process.env.ANALYZE === 'true',
// })


import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disableDevLogs: true,
  disable: process.env.NODE_ENV === 'development'
})


export default withPWA(nextConfig)
