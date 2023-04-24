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
        font-style: normal;
        src: url('./fonts/DOS_VGA.ttf');
      }

      @font-face {
        font-family: 'pixel-script';
        font-style: normal;
        src: url('./fonts/PixelscriptPro.ttf');
      }
`}
  />
);

export default Fonts;
