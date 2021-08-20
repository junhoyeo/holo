import dedent from 'dedent'
import { useMemo, useState } from 'react'

import styled from '@emotion/styled'

type Reflection = {
  color: string
  degrees: number
}

const DEFAULT_REFLECTIONS = [
  { color: '#ffffff', degrees: 0 },
  { color: '#000000', degrees: 43.12 },
  { color: '#ffffff', degrees: 84.38 },
  { color: '#000000', degrees: 133.12 },
  { color: '#ffffff', degrees: 183.75 },
  { color: '#000000', degrees: 238.12 },
  { color: '#ffffff', degrees: 288.75 },
  { color: '#000000', degrees: 339.37 },
  { color: '#ffffff', degrees: 360 },
]

export const HolographicGenerator = () => {
  const [reflections] = useState<Reflection[]>(DEFAULT_REFLECTIONS)
  const reflectionGradient = useMemo(() => {
    const layers = reflections
      .map(({ color, degrees }) => `${color} ${degrees}deg`)
      .join(', ')
    return dedent`
      conic-gradient(
        from 180deg at 50% 50%,
        ${layers}
      )
    `
  }, [reflections])

  return (
    <Container>
      <RainbowColors />
      <Reflections reflectionGradient={reflectionGradient} />
      <Merged reflectionGradient={reflectionGradient} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
`

const RainbowColors = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(
    80.8% 80.8% at 28% 11.8%,
    #2ad0ca 0%,
    #e1f664 28.12%,
    #feb0fe 44.27%,
    #abb3fc 65.62%,
    #5df7a4 79.69%,
    #58c4f6 100%
  );
`

type ReflectionsProps = {
  reflectionGradient: string
}
const Reflections = styled.div<ReflectionsProps>`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: ${({ reflectionGradient }) => reflectionGradient};
`

const Merged = styled.div<ReflectionsProps>`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: ${({ reflectionGradient }) =>
      `${reflectionGradient}, ${reflectionGradient}`},
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
