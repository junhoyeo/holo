import { useEffect } from 'react'

import { GlobalStyle } from '../components/GlobalStyle'
import { polyfillRequestAnimationFrame } from '../utils/polyfills'

export default function App({ Component, pageProps }) {
  useEffect(() => polyfillRequestAnimationFrame(), [])

  return (
    <>
      {GlobalStyle}
      <Component {...pageProps} />
    </>
  )
}
