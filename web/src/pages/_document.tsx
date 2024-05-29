import { Head, Html, Main, NextScript } from "next/document";

const metas = {
  title: "Dope Wars",
  descritpion:
    "Onchain adaptation of the classic Drug Wars game. An immersive recreation of the 1999 TI-83 classic where street smarts reign supreme and every choice matters in the end.",
  image: {
    url: "/images/play-dope-wars.png",
    width: "1200",
    height: "648",
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
        <meta property="og:description" content={metas.descritpion} />
        <meta property="og:locale" content="en" />
        <meta property="og:image" content={metas.image.url} />
        <meta property="og:image:width" content={metas.image.width} />
        <meta property="og:image:height" content={metas.image.height} />
        <meta property="og:image:alt" content={metas.title} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metas.title} />
        <meta name="twitter:description" content={metas.descritpion} />
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
