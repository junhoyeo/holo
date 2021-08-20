import dedent from 'dedent'

import { css, Global } from '@emotion/react'

const systemFontStack = dedent`
  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, Helvetica, Arial, sans-serif
`

export const GlobalStyle = (
  <Global
    styles={css`
      body {
        margin: 0;
        background: black;
        min-height: 100%;
        font-family: ${systemFontStack};
      }
    `}
  />
)
