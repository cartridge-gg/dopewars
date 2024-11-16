import { Head, Html, Main, NextScript } from "next/document";

const baseUrl = process.env.NODE_ENV === "production" ? "https://dopewars.game" : "";
const metas = {
  title: "Dope Wars",
  descritpion:
    "Dope Wars is an onchain adaptation of the classic arbitrage game Drug Wars, built by Cartridge in partnership with Dope DAO",
  socialDescription:
    "Prove you're the ultimate hustler. Move product, stack paper, and rise to the top in Dope Wars. Play now and claim your spot on the leaderboard!",
  image: {
    url: `${baseUrl}/images/play-dope-wars.png`,
    width: "1200",
    height: "630",
  },
};

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/icon.png" />

        {/* pwa */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#11ED83" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* General */}
        <meta name="description" content={metas.descritpion} />
        <meta name="keywords" content="Dope-Wars, Dojo, Starknet, Cartridge, On-chain gaming, Autonomous Worlds" />

        {/* Open graph */}
        <meta property="og:title" content={metas.title} />
        <meta property="og:description" content={metas.socialDescription} />
        <meta property="og:locale" content="en" />
        <meta property="og:image" content={metas.image.url} />
        <meta property="og:image:width" content={metas.image.width} />
        <meta property="og:image:height" content={metas.image.height} />
        <meta property="og:image:alt" content={metas.title} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metas.title} />
        <meta name="twitter:description" content={metas.socialDescription} />
        <meta name="twitter:image" content={metas.image.url} />
        <meta name="twitter:image:width" content={metas.image.width} />
        <meta name="twitter:image:height" content={metas.image.height} />
        <meta name="twitter:image:alt" content={metas.title} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
