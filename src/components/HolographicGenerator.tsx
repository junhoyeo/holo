import dedent from 'dedent'
import produce from 'immer'
import { useEffect, useMemo, useRef, useState } from 'react'

import styled from '@emotion/styled'

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
  { color: '#ffffff', degrees: 0 },
  { color: '#000000', degrees: 43.12 },
  { color: '#ffffff', degrees: 84.38 },
  { color: '#000000', degrees: 133.12 },
  { color: '#ffffff', degrees: 180 },
  { color: '#000000', degrees: 238.12 },
  { color: '#ffffff', degrees: 288.75 },
  { color: '#000000', degrees: 339.37 },
  { color: '#ffffff', degrees: 360 },
]

export const HolographicGenerator = () => {
  const [rainbowColors] = useState<GradientColor[]>(DEFAULT_RAINBOW_COLORS)
  const rainbowColorGradient = useMemo(() => {
    const layers = rainbowColors
      .map(({ color, position }) => `${color} ${position}%`)
      .join(', ')
    return dedent`
      radial-gradient(
        80.8% 80.8% at 28% 11.8%,
        ${layers}
      )
    `
  }, [rainbowColors])

  const reflectionRefs = useRef<(HTMLLIElement | null)[]>([])
  const reflectionListRef = useRef<HTMLUListElement>(null)
  const [reflections, setReflections] =
    useState<Reflection[]>(DEFAULT_REFLECTIONS)
  const reflectionConicGradient = useMemo(() => {
    const layers = reflections
      .map(({ color, degrees }) => `${color} ${degrees}deg`)
      .join(', ')
    return dedent`
      conic-gradient(
        ${layers}
      )
    `
  }, [reflections])

  const reflectionsWithPosition = useMemo(
    () =>
      reflections.map(({ color, degrees }) => ({
        color,
        position: `${(degrees / 360) * 100}%`,
      })),
    [reflections],
  )
  const reflectionLinearGradient = useMemo(() => {
    const layers = reflectionsWithPosition
      .map(({ color, position }) => `${color} ${position}`)
      .join(', ')
    return dedent`
      linear-gradient(
        to right,
        ${layers}
      )
    `
  }, [reflectionsWithPosition])

  useEffect(() => {
    const dragStart = (index: number) => (event: any) => {
      event = event || window.event

      if (event.type !== 'touchstart') {
        document.onmouseup = dragEnd
        document.onmousemove = dragAction(index)
      }
    }
    const dragEnd = () => {
      document.onmouseup = null
      document.onmousemove = null
    }
    const dragAction = (index: number) => (event) => {
      event = event || window.event

      let clientX = undefined
      if (event.type == 'touchmove') {
        clientX = event.touches[0].clientX
      } else {
        clientX = event.clientX
      }

      const MAX_OFFSET = reflectionListRef.current.offsetWidth
      const MIN_OFFSET = 0

      let offset = clientX - reflectionListRef.current.offsetLeft
      offset = Math.max(Math.min(offset, MAX_OFFSET), MIN_OFFSET)
      const degrees = (offset / reflectionListRef.current.offsetWidth) * 360

      setReflections(
        produce(reflections, (draft) => {
          draft[index].degrees = degrees
        }),
      )
    }

    reflectionRefs.current.forEach((ref, index) => {
      if (index === 0 || index === reflections.length) {
        return
      }
      ref.onmousedown = dragStart(index)
      ref.addEventListener('touchend', dragEnd, { passive: true })
      ref.addEventListener('touchmove', dragAction(index), { passive: true })
    })
  }, [reflections])

  return (
    <Container>
      <Section>
        <RainbowColors rainbowColorGradient={rainbowColorGradient} />
      </Section>
      <Section>
        <ReflectionContainer>
          <Reflections reflectionGradient={reflectionConicGradient} />
          {reflections.slice(0, -1).map(({ color, degrees }, index) => (
            <ReflectionFragment key={`${color}-${degrees}`} degrees={degrees}>
              <ReflectionIndicator>
                <ReflectionColorWrapper>
                  <ReflectionIndex>{index}</ReflectionIndex>
                </ReflectionColorWrapper>
              </ReflectionIndicator>
            </ReflectionFragment>
          ))}
        </ReflectionContainer>
        <ReflectionList
          ref={reflectionListRef}
          reflectionGradient={reflectionLinearGradient}
        >
          {reflectionsWithPosition.map(({ color, position }, index) => (
            <ReflectionItem
              ref={(ref) => {
                reflectionRefs.current[index] = ref
              }}
              key={`${color}-${position}`}
              position={position}
            >
              <ReflectionColorWrapper>
                <ReflectionColor
                  color={color}
                  index={index === reflections.length - 1 ? 0 : index}
                />
              </ReflectionColorWrapper>
            </ReflectionItem>
          ))}
        </ReflectionList>
      </Section>
      <Section>
        <Merged
          reflectionGradient={reflectionConicGradient}
          rainbowColorGradient={rainbowColorGradient}
        />
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

const ReflectionContainer = styled.div`
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
const ReflectionColorWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`
type ReflectionColorProps = {
  color: string
  index: number
}
const ReflectionColor = styled.div<ReflectionColorProps>`
  position: absolute;
  min-width: 36px;
  min-height: 36px;
  border-radius: 50%;

  cursor: pointer;
  transition: border-width 0.1s linear;
  pointer-events: auto;

  background-color: ${({ color }) => color};
  border: 2px solid #f00785;
  box-shadow: inset 0px 0px 1px rgba(240, 7, 131, 0.8);

  &:hover {
    border-width: 4px;
  }

  &::after {
    content: ${({ index }) => `'${index}'`};
    margin: 0 auto;
    min-width: 18px;
    max-width: 18px;
    min-height: 18px;

    position: absolute;
    top: 32px;
    left: 0;
    right: 0;

    color: white;
    background-color: #f00785;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
  }
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

const ReflectionList = styled.ul<ReflectionsProps>`
  margin: 0;
  margin-top: 36px;
  padding: 0;
  list-style-type: none;

  width: 100%;
  height: 100px;
  position: relative;

  background: ${({ reflectionGradient }) => reflectionGradient};
`

type ReflectionItemProps = {
  position: string
}
const ReflectionItem = styled.li<ReflectionItemProps>`
  width: 2px;
  height: 100%;

  position: absolute;
  top: 0;
  left: ${({ position }) => position};

  background-color: #f00785;
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
