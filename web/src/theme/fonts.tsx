import { Global } from '@emotion/react'

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'ChicagoFLF';
        font-style: normal;
        src: url('./fonts/ChicagoFLF.ttf') format('truetype');
      }
      `}
  />
)

export default Fonts