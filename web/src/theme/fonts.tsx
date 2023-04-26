import { Global } from "@emotion/react";

export const fonts = {
  body: `'dos-vga', san-serif`,
  heading: `'pixel-script', san-serif`,
};

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'dos-vga';
        font-weight: 400;
        font-style: normal;
        src: url('./fonts/DOS_VGA.ttf');
      }

      @font-face {
        font-family: 'pixel-script';
        font-weight: 400;
        font-style: normal;
        src: url('./fonts/PixelscriptPro.ttf');
      }

      @font-face {
        font-family: 'broken-console';
        font-weight: 400;
        font-style: normal;
        src: url('./fonts/broken-console-broken-console-regular-400.ttf');
      }
`}
  />
);

export default Fonts;
