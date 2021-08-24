import { GlobalStyle } from '../components/GlobalStyle'
import { usePolyfills } from '../utils/polyfills'

export default function App({ Component, pageProps }) {
  usePolyfills()

  return (
    <>
      {GlobalStyle}
      <Component {...pageProps} />
    </>
  )
}
