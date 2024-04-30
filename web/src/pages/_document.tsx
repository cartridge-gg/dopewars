import { Head, Html, Main, NextScript } from "next/document";

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
        <meta
          name="description"
          content="Onchain adaptation of the classic Drug Wars game. An immersive recreation of the 1999 TI-83 classic where street smarts reign supreme and every choice matters in the end."
        />
        <meta name="keywords" content="Dope-Wars, Dojo, Starknet, Cartridge, On-chain gaming, Autonomous Worlds" />

        {/* Open graph */}
        <meta property="og:title" content="Rollyourown" />
        <meta property="og:locale" content="en" />

        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="432" />
        <meta property="og:image:alt" content="Rollyourown" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:title" content="Onchain adaptation of the classic Drug Wars game." />
        <meta name="twitter:image:width" content="800" />
        <meta name="twitter:image:height" content="432" />
        <meta name="twitter:image:alt" content="Rollyourown" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
