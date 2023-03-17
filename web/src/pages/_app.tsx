import { ModalProvider } from '@/components/Modal/ModalProvider'
import Styles from '@/theme/styles'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import theme from '../theme'

export default function App({ Component, pageProps }: AppProps) {
  return <ChakraProvider theme={theme}>
    <Styles />
    <ModalProvider>
      <Component {...pageProps} />
    </ModalProvider>
  </ChakraProvider>
}
