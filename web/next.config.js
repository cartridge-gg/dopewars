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


import withPWA from "next-pwa";
// const withPWA = require("next-pwa")

const config = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disableDevLogs: true,
  disable: process.env.NODE_ENV === 'development'
})(nextConfig);

export default config