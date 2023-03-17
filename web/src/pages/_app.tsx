import { ModalProvider } from '@/components/Modal/ModalProvider'
import Fonts from '@/theme/fonts'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import theme from '../theme'

export default function App({ Component, pageProps }: AppProps) {
  return <ChakraProvider theme={theme}>
    <Fonts />
    <ModalProvider>
      <Component {...pageProps} />
    </ModalProvider>
  </ChakraProvider>
}
