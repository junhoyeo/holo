import styled from '@emotion/styled'

import { GitHubSticker } from '../components/GitHubSticker'

export default function Home() {
  return (
    <Container>
      <GitHubSticker />
      <Title>Holographic Stickers</Title>
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
  font-size: 3.2rem;
  letter-spacing: -0.1px;
`
