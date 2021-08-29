import React, { useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

import styled from '@emotion/styled'

type Props = {
  isVisible: boolean
  initialColor: string
  onSelect: (color: string) => void
}

export const ColorPickerModal: React.FC<Props> = ({
  isVisible = true,
  initialColor,
  onSelect,
}) => {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isVisible])

  const containerRef = useRef<HTMLDivElement>(null)
  const [colorDraft, setColorDraft] = useState<string>(initialColor)

  const onClickDismiss = (e: React.MouseEvent<HTMLDivElement>) => {
    const isModalClicked = e.target === containerRef.current
    if (isModalClicked) {
      onSelect(colorDraft)
    }
  }

  return (
    <ModalBackground onClick={onClickDismiss}>
      <ColorPickerContainer ref={containerRef}>
        <HexColorPicker color={colorDraft} onChange={setColorDraft} />
      </ColorPickerContainer>
    </ModalBackground>
  )
}

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0.85),
    rgba(0, 0, 0)
  );
  z-index: 9999;
  cursor: pointer;
`

const ColorPickerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`
