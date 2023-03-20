import { Global } from '@emotion/react'

const Styles = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'ChicagoFLF';
        font-style: normal;
        src: url('./fonts/ChicagoFLF.ttf') format('truetype');
      }

      html,
      body,
      body > div:first-child,
      div#__next,
      div#__next > div {
        height: 100%;
      }
      `}
  />
)

export default Styles