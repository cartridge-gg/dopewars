import { Global } from "@emotion/react";

export const fonts = {
  body: `'dos-vga', san-serif`,
  heading: `'ppmondwest', san-serif`,
};

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'dos-vga';
        font-weight: 400;
        font-style: normal;
        src: url('/fonts/DOS_VGA.ttf');
      }

      @font-face {
        font-family: 'pixel-script';
        font-weight: 400;
        font-style: normal;
        src: url('/fonts/PixelscriptPro.ttf');
      }

      @font-face {
        font-family: 'broken-console';
        font-weight: 400;
        font-style: normal;
        src: url('/fonts/broken-console-broken-console-regular-400.ttf');
      }

      @font-face {
        font-family: 'ppmondwest';
        font-weight: 400;
        font-style: normal;
        src: url('/fonts/PPMondwest-Regular.otf') format('opentype');
      }

      @font-face {
        font-family: 'chicago-flf';
        font-weight: 500;
        font-style: normal;
        src: url('/fonts/ChicagoFLF.ttf');
      }

      @font-face {
        font-family: 'ppneuebit';
        font-weight: 700;
        font-style: normal;
        src: url('/fonts/PPNeueBit-Bold.otf') format('opentype');
      }
`}
  />
);

export default Fonts;
