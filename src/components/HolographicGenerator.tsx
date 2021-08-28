import dedent from 'dedent'
import { useMemo, useState } from 'react'

import styled from '@emotion/styled'

import { copyToClipboard } from '../utils/clipboard'
import { Button } from './Button'
import { LinearGradientEditor } from './LinearGradientEditor'

type GradientColor = {
  color: string
  position: number
}

type Reflection = {
  color: string
  degrees: number
}

const DEFAULT_RAINBOW_COLORS = [
  { color: '#2ad0ca', position: 0 },
  { color: '#e1f664', position: 28.12 },
  { color: '#feb0fe', position: 44.27 },
  { color: '#abb3fc', position: 65.62 },
  { color: '#5df7a4', position: 79.69 },
  { color: '#58c4f6', position: 100 },
]

const DEFAULT_REFLECTIONS = [
  { color: '#ffffff', position: 0.0 },
  { color: '#000000', position: 11.98 },
  { color: '#ffffff', position: 23.44 },
  { color: '#000000', position: 36.98 },
  { color: '#ffffff', position: 50.0 },
  { color: '#000000', position: 66.14 },
  { color: '#ffffff', position: 80.21 },
  { color: '#000000', position: 94.27 },
  { color: '#ffffff', position: 100 },
]

export const HolographicGenerator = () => {
  const [rainbowColors, setRainbowColors] = useState<GradientColor[]>(
    DEFAULT_RAINBOW_COLORS,
  )
  const rainbowColorGradient = useMemo(() => {
    const layers = rainbowColors
      .map(({ color, position }) => `${color} ${position.toFixed(2)}%`)
      .join(', ')
    return dedent`
      radial-gradient(
        80.8% 80.8% at 28% 11.8%,
        ${layers}
      )
    `
  }, [rainbowColors])
  const rainbowColorLinearGradient = useMemo(() => {
    const layers = rainbowColors
      .map(({ color, position }) => `${color} ${position}%`)
      .join(', ')
    return dedent`
      linear-gradient(
        to right,
        ${layers}
      )
    `
  }, [rainbowColors])

  const [reflections, setReflections] =
    useState<GradientColor[]>(DEFAULT_REFLECTIONS)
  const reflectionConicGradient = useMemo(() => {
    const layers = reflections
      .map(({ color, position }) => `${color} ${(position / 100) * 360}deg`)
      .join(', ')
    return dedent`
      conic-gradient(
        ${layers}
      )
    `
  }, [reflections])

  const reflectionLinearGradient = useMemo(() => {
    const layers = reflections
      .map(({ color, position }) => `${color} ${position}%`)
      .join(', ')
    return dedent`
      linear-gradient(
        to right,
        ${layers}
      )
    `
  }, [reflections])

  const generatedCode = useMemo(() => {
    const reflectionGradientLayers = reflections
      .map(
        ({ color, position }) =>
          `${color} ${((position / 100) * 360).toFixed(2)}deg`,
      )
      .join(', ')
    const rainbowGradientLayers = rainbowColors
      .map(({ color, position }) => `${color} ${position.toFixed(2)}%`)
      .join(', ')

    return dedent`
      // NOTE: effects from holo.junho.io
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background:
        conic-gradient(${reflectionGradientLayers}),
        conic-gradient(${reflectionGradientLayers}),
        radial-gradient(
          80.8% 80.8% at 28% 11.8%,
          ${rainbowGradientLayers}
        );
      background-blend-mode: screen, difference, normal;
      mix-blend-mode: normal;
    `
  }, [reflections, rainbowColors])

  return (
    <Container>
      <Section>
        <CircleContainer>
          <RainbowColors rainbowColorGradient={rainbowColorGradient} />
        </CircleContainer>
        <LinearGradientEditor
          gradients={rainbowColors}
          setGradients={setRainbowColors}
          linearGradient={rainbowColorLinearGradient}
        />
      </Section>
      <Section>
        <CircleContainer>
          <Reflections reflectionGradient={reflectionConicGradient} />
          {reflections.slice(0, -1).map(({ position }, index) => (
            <ReflectionFragment key={index} degrees={(position / 100) * 360}>
              <ReflectionIndicator>
                <LinearGradientColorWrapper>
                  <ReflectionIndex>{index}</ReflectionIndex>
                </LinearGradientColorWrapper>
              </ReflectionIndicator>
            </ReflectionFragment>
          ))}
        </CircleContainer>
        <LinearGradientEditor
          gradients={reflections}
          setGradients={setReflections}
          linearGradient={reflectionLinearGradient}
        />
      </Section>
      <Section>
        <Merged
          reflectionGradient={reflectionConicGradient}
          rainbowColorGradient={rainbowColorGradient}
        />
        <CodeBlock>{generatedCode}</CodeBlock>
        <Button onClick={() => copyToClipboard(generatedCode)}>
          Copy CSS to clipboard
        </Button>
      </Section>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const Section = styled.section`
  margin: 0 auto;
  padding: 64px 30px 48px;

  width: 100%;
  max-width: 1040px;

  display: flex;
  flex-direction: column;
  align-items: center;

  & > * {
    user-select: none;
  }
`

type RainbowColorsProps = {
  rainbowColorGradient: string
}
const RainbowColors = styled.div<RainbowColorsProps>`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: ${({ rainbowColorGradient }) => rainbowColorGradient};
`

const CircleContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
`

type ReflectionsProps = {
  reflectionGradient: string
}
const Reflections = styled.div<ReflectionsProps>`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: ${({ reflectionGradient }) => reflectionGradient};
`

const ReflectionFragment = styled.div<Omit<Reflection, 'color'>>`
  width: 150px;
  height: 150px;

  position: absolute;
  left: 0;
  right: 0;

  transform-origin: right bottom;
  transform: ${({ degrees }) => `rotate(${degrees}deg)`};
  pointer-events: none;
`
const ReflectionIndicator = styled.div`
  width: 2px;
  height: 150px;
  border-radius: 1px;

  position: absolute;
  top: 0;
  right: -1px;

  background-color: #f00785;
  box-shadow: 0px 0px 1px rgba(240, 7, 131, 0.8);
`
const LinearGradientColorWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ReflectionIndex = styled.span`
  margin: 0 auto;
  min-width: 18px;
  max-width: 18px;
  min-height: 18px;

  position: absolute;
  top: 0;

  color: white;
  background-color: #f00785;
  box-shadow: 0px 0px 1px rgba(240, 7, 131, 0.8);
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
`

const Merged = styled.div<ReflectionsProps & RainbowColorsProps>`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: ${({ reflectionGradient, rainbowColorGradient }) =>
    `${reflectionGradient}, ${reflectionGradient}, ${rainbowColorGradient}`};
  background-blend-mode: screen, difference, normal;
  mix-blend-mode: normal;
`

const CodeBlock = ({ children }) => (
  <Pre>
    <code>{children}</code>
  </Pre>
)
const Pre = styled.pre`
  padding: 28px 36px;
  width: 100%;
  max-width: 1040px;

  border: 1px solid #333;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);

  font-size: 14px;
  color: white;

  overflow-x: scroll;
  user-select: text;
`
