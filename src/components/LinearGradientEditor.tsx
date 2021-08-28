import produce from 'immer'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import styled from '@emotion/styled'

type Props = {
  linearGradient: string
  gradients: {
    color: string
    position: number
  }[]
  setGradients: (
    value: {
      color: string
      position: number
    }[],
  ) => void
}

export const LinearGradientEditor = ({
  linearGradient,
  gradients,
  setGradients,
}: Props) => {
  const gradientRefs = useRef<(HTMLLIElement | null)[]>([])
  const gradientColorRefs = useRef<(HTMLDivElement | null)[]>([])
  const gradientListRef = useRef<HTMLUListElement>(null)

  const [recentlySelectedGradientIndex, setRecentlySelectedGradientIndex] =
    useState<number | undefined>(undefined)

  const updatePosition = useCallback(
    (index: number, clientX: number) => {
      setRecentlySelectedGradientIndex(index)

      const MAX_OFFSET = gradientListRef.current.offsetWidth
      const MIN_OFFSET = 0

      let offset = clientX - gradientListRef.current.offsetLeft
      offset = Math.max(Math.min(offset, MAX_OFFSET), MIN_OFFSET)
      const position = (offset / gradientListRef.current.offsetWidth) * 100

      setGradients(
        produce(gradients, (draft) => {
          draft[index].position = parseFloat(position.toFixed(2))
        }),
      )
    },
    [gradients],
  )

  const onMouseUp = useCallback(() => {
    document.onmouseup = null
    document.onmousemove = null
  }, [])

  const onMouseMoveFactory = useCallback(
    (index: number) => (event: MouseEvent) =>
      updatePosition(index, event.clientX),
    [updatePosition],
  )

  const onMouseDownFactory = useCallback(
    (index: number) => () => {
      document.onmouseup = onMouseUp
      document.onmousemove = onMouseMoveFactory(index)
    },
    [onMouseUp, onMouseMoveFactory],
  )

  useEffect(() => {
    gradientRefs.current.forEach((ref, index) => {
      if (!ref) {
        return
      }
      if (index === 0 || index === gradients.length - 1) {
        return
      }
      ref.onmousedown = onMouseDownFactory(index)
    })

    return () => {
      gradientRefs.current.forEach((ref) => {
        if (ref === null) {
          return
        }
        ref.onmousedown = null
      })
    }
  }, [gradients])

  const scheduledAnimationFrame = useRef<boolean>(false)
  useEffect(() => {
    const touchMoveHandler = (event: TouchEvent) => {
      const element = event.target as HTMLDivElement

      if (!element.hasAttribute('color')) {
        return
      }

      const gradientColorIndex = gradientColorRefs.current.indexOf(element)
      if (gradientColorIndex === -1) {
        return
      }

      const isImmutable =
        gradientColorIndex === 0 || gradientColorIndex === gradients.length - 1
      if (isImmutable) {
        return
      }

      if (scheduledAnimationFrame.current) {
        return
      }

      scheduledAnimationFrame.current = true
      return requestAnimationFrame(() => {
        const clientX = event.touches[0].clientX
        updatePosition(gradientColorIndex, clientX)

        scheduledAnimationFrame.current = false
      })
    }

    document.addEventListener('touchmove', touchMoveHandler, {
      passive: true,
    })

    return () => {
      document.removeEventListener('touchmove', touchMoveHandler)
    }
  }, [gradients, updatePosition])

  const onClickRemoveGradient = useCallback(
    (index: number) =>
      setGradients(
        produce(gradients, (draft) => {
          draft.splice(index, 1)
        }),
      ),
    [gradients],
  )

  return (
    <LinearGradient ref={gradientListRef} linearGradient={linearGradient}>
      {gradients.map(({ color, position }, index) => {
        const isDeleteable = index === 0 || index === gradients.length - 1
        return (
          <LinearGradientColorItem
            key={index}
            position={position}
            selected={recentlySelectedGradientIndex === index}
            ref={(ref) => {
              gradientRefs.current[index] = ref
            }}
          >
            <LinearGradientColorWrapper>
              <LinearGradientColor
                color={color}
                index={index === gradients.length - 1 ? 0 : index}
                ref={(ref) => {
                  gradientColorRefs.current[index] = ref
                }}
              />
            </LinearGradientColorWrapper>
            {!isDeleteable && (
              <RemoveButton onClick={() => onClickRemoveGradient(index)}>
                <DeleteIcon src="/icons/delete.svg" />
              </RemoveButton>
            )}
          </LinearGradientColorItem>
        )
      })}
    </LinearGradient>
  )
}

type GradientColorProps = {
  color: string
  index: number
}
const LinearGradientColor = styled.div<GradientColorProps>`
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

const RemoveButton = styled.button`
  position: absolute;
  bottom: -36px;
  left: -14px;
  right: -14px;

  width: 28px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: thin solid #495057;
  border-radius: 50%;
  background-color: #343a40;

  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.25);
  }
`
const DeleteIcon = styled.img`
  width: 22px;
  height: 22px;

  user-select: none;
  -webkit-user-drag: none;
`

type LinearGradientProps = {
  linearGradient: string
}
const LinearGradient = styled.ul<LinearGradientProps>`
  margin: 0;
  margin-top: 36px;
  padding: 0;
  list-style-type: none;

  width: 100%;
  height: 100px;
  position: relative;

  background: ${({ linearGradient }) => linearGradient};
`

type LinearGradientColorItemProps = {
  position: number
  selected?: boolean
}
const LinearGradientColorItem = styled.li<LinearGradientColorItemProps>`
  width: 2px;
  height: 100%;

  position: absolute;
  top: 0;
  left: ${({ position }) => position}%;
  z-index: ${({ selected }) => (selected ? 9 : 'unset')};

  background-color: #f00785;
`
const LinearGradientColorWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`
