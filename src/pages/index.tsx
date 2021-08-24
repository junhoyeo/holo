import { useMemo } from 'react'

import styled from '@emotion/styled'

import { Button } from '../components/Button'
import { GitHubSticker } from '../components/GitHubSticker'
import { HolographicGenerator } from '../components/HolographicGenerator'
import useWindowSize from '../utils/useWindowSize'

export default function Home() {
  const { windowWidth = 1980 } = useWindowSize()
  const githubStickerSize = useMemo(
    () => (windowWidth < 600 ? 300 : 500),
    [windowWidth],
  )

  return (
    <Container>
      <GitHubSticker size={githubStickerSize} />
      <Title>
        Holographic
        <br />
        Effect Generator
      </Title>
      <StarMeOnGitHubButton>
        Star me on GitHub <StarIcon src="/icons/star.svg" />
        <span>0</span>
      </StarMeOnGitHubButton>
      <HolographicGenerator />
    </Container>
  )
}

const Container = styled.div`
  padding: 96px 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h1`
  color: rgba(255, 255, 255, 0.95);
  font-weight: 800;
  font-size: 4.8rem;
  letter-spacing: -0.1px;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 11vw;
  }
`

const StarMeOnGitHubButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 18.5px;
  letter-spacing: -0.8px;
`
const StarIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-left: 8px;
  margin-bottom: 2px;
`
