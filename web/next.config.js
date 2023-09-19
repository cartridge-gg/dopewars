/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  images: {
    domains: ["static.cartridge.gg", "static.localhost"],
  },
};


const withPWA = require("next-pwa");

module.exports = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV === 'development'
})(nextConfig);