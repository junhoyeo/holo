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

      * {
        box-sizing: border-box;
      }

      a {
        text-decoration: none;
      }

      &::selection {
        color: rgba(255, 255, 255, 0.75);
        background-color: #f00785;
      }
    `}
  />
)
