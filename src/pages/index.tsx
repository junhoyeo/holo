import styled from '@emotion/styled'

import { GitHubSticker } from '../components/GitHubSticker'
import { HolographicGenerator } from '../components/HolographicGenerator'

export default function Home() {
  return (
    <Container>
      <GitHubSticker size={500} />
      <Title>
        Holographic
        <br />
        Effect Generator
      </Title>
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
