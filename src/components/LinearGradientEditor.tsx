import produce from 'immer'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import styled from '@emotion/styled'

import { GradientColor, LinearGradientColor } from './LinearGradientColor'

type Props = {
  linearGradient: string
  gradients: GradientColor[]
  setGradients: (value: GradientColor[]) => void
}

export const LinearGradientEditor = ({
  linearGradient,
  gradients,
  setGradients,
}: Props) => {
  const gradientRefs = useRef<(HTMLLIElement | null)[]>([])
  const gradientColorRefs = useRef<(HTMLDivElement | null)[]>([])
  const gradientListRef = useRef<HTMLUListElement>(null)

  const eventListenerDisabledRef = useRef<boolean>(false)
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
          draft[index].position = position
          draft.sort((a, b) => a.position - b.position)
        }),
      )
    },
    [gradients],
  )

  const onMouseUp = useCallback(() => {
    if (eventListenerDisabledRef.current) {
      return
    }
    document.onmouseup = null
    document.onmousemove = null
  }, [])

  const onMouseMoveFactory = useCallback(
    (index: number) => (event: MouseEvent) => {
      if (eventListenerDisabledRef.current) {
        return
      }
      updatePosition(index, event.clientX)
    },
    [updatePosition],
  )

  const onMouseDownFactory = useCallback(
    (index: number) => () => {
      if (eventListenerDisabledRef.current) {
        return
      }
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
      if (eventListenerDisabledRef.current) {
        return
      }

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

  const onClickUpdateColor = useCallback(
    (index: number, color: string) =>
      setGradients(
        produce(gradients, (draft) => {
          draft[index].color = color
        }),
      ),
    [gradients],
  )

  return (
    <LinearGradient ref={gradientListRef} linearGradient={linearGradient}>
      {gradients.map((gradientColor, index) => (
        <LinearGradientColor
          key={index}
          selected={index === recentlySelectedGradientIndex}
          index={index}
          gradients={gradients}
          gradientRefs={gradientRefs}
          gradientColor={gradientColor}
          gradientColorRefs={gradientColorRefs}
          eventListenerDisabledRef={eventListenerDisabledRef}
          onClickRemoveGradient={onClickRemoveGradient}
          onClickUpdateColor={onClickUpdateColor}
        />
      ))}
    </LinearGradient>
  )
}

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
