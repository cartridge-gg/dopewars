/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  images: {
    domains: ["static.cartridge.gg", "static.localhost"],
  },
  // webpack: (config, options) => {
  //   config.experiments = {
  //     asyncWebAssembly: true,
  //     syncWebAssembly: true,
  //     layers: true,
  //   }

  //   config.module = config.module ||{}
  //   config.module.rules = config.module.rules || [];
  //   config.module.rules = [
  //     ...config.module.rules,
  //     {
  //       test: /\.wasm$/,
  //       type: "webassembly/async", // for async modules
  //       // or
  //       //type: "webassembly/sync", // like webpack 4, but it's deprecated
  //     },
  //     // other ruless...
  //   ]

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