import styled from '@emotion/styled'

export default function Home() {
  return (
    <Container>
      <HolographicSticker />
    </Container>
  )
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const HolographicSticker = styled.div`
  width: 500px;
  height: 500px;
  border-radius: 50%;

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
