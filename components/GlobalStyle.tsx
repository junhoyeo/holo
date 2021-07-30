import { css, Global } from '@emotion/react'
import dedent from 'dedent'

const systemFontStack = dedent`
  Inter, -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, Helvetica, Arial, sans-serif,
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
`;

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
