import dedent from 'dedent'

import { ArcText } from '@arctext/react'
import styled from '@emotion/styled'

export const GitHubSticker = () => {
  return (
    <HolographicSticker>
      <BlackBorder>
        <Image src="/images/octocat.png" />
      </BlackBorder>
      <Wording text="@junhoyeo" characterWidth={4} width={450}>
        <Wording
          text="Holographic Stickers"
          characterWidth={4}
          width={450}
          upsideDown
        />
      </Wording>
      <NoiseOverlay />
    </HolographicSticker>
  )
}

const HolographicSticker = styled.div`
  width: 500px;
  height: 500px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  background: conic-gradient(
      from 180deg at 50% 50%,
      #ffffff 0deg,
      #000000 46.87deg,
      #ffffff 93.75deg,
      #000000 140.63deg,
      #ffffff 185.62deg,
      #000000 228.75deg,
      #ffffff 275.62deg,
      #000000 337.5deg,
      #ffffff 360deg
    ),
    conic-gradient(
      from 180deg at 50% 50%,
      #ffffff 0deg,
      #000000 43.12deg,
      #ffffff 84.38deg,
      #000000 133.12deg,
      #ffffff 183.75deg,
      #000000 238.12deg,
      #ffffff 288.75deg,
      #000000 339.37deg,
      #ffffff 360deg
    ),
    radial-gradient(
      80.8% 80.8% at 28% 11.8%,
      #2ad0ca 0%,
      #e1f664 28.12%,
      #feb0fe 44.27%,
      #abb3fc 65.62%,
      #5df7a4 79.69%,
      #58c4f6 100%
    );
  background-blend-mode: screen, difference, normal;
  mix-blend-mode: normal;
`

const BlackBorder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 8px solid black;
  margin: 16px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
`

const Image = styled.img`
  width: 60%;
`

const noiseImage = dedent`
  url(data:image/png;base64,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)
`
const NoiseOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: ${noiseImage};
`

const Wording = styled(ArcText)`
  margin: 25px;

  & span.character {
    color: black;
    font-weight: bold;
    font-size: 24px;
    font-family: monospace;
  }
`
