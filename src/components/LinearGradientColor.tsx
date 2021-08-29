import { useMemo } from 'react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

export type GradientColor = {
  color: string
  position: number
}

type Props = {
  index: number
  gradients: GradientColor[]
  gradientRefs: React.MutableRefObject<HTMLLIElement[]>
  gradientColor: GradientColor
  gradientColorRefs: React.MutableRefObject<HTMLDivElement[]>
  onClickRemoveGradient: (index: number) => void
}

export const LinearGradientColor: React.FC<Props> = ({
  index,
  gradients,
  gradientRefs,
  gradientColor,
  gradientColorRefs,
  onClickRemoveGradient,
}) => {
  const { isDeleteable, displayIndex, containerRef, colorRef } = useMemo(
    () => ({
      isDeleteable: index === 0 || index === gradients.length - 1,
      displayIndex: index === gradients.length - 1 ? 0 : index,
      containerRef: (ref: HTMLLIElement) => {
        gradientRefs.current[index] = ref
      },
      colorRef: (ref: HTMLDivElement) => {
        gradientColorRefs.current[index] = ref
      },
    }),
    [index],
  )

  return (
    <Container //
      ref={containerRef}
      position={gradientColor.position}
    >
      <ColorWrapper>
        <Color
          ref={colorRef}
          color={gradientColor.color}
          index={displayIndex}
        />
      </ColorWrapper>
      {!isDeleteable && (
        <RemoveButton onClick={() => onClickRemoveGradient(index)}>
          <DeleteIcon src="/icons/delete.svg" />
        </RemoveButton>
      )}
      <ChangeColorButton />
    </Container>
  )
}

type ContainerProps = {
  position: number
  selected?: boolean
}
const Container = styled.li<ContainerProps>`
  width: 2px;
  height: 100%;

  position: absolute;
  top: 0;
  left: ${({ position }) => position}%;
  z-index: ${({ selected }) => (selected ? 9 : 'unset')};

  background-color: #f00785;
`
const ColorWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

type ColorProps = {
  color: string
  index: number
}
const Color = styled.div<ColorProps>`
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

const buttonStyles = css`
  position: absolute;
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

const RemoveButton = styled.button`
  ${buttonStyles}
  bottom: -72px;
`
const DeleteIcon = styled.img`
  width: 22px;
  height: 22px;

  user-select: none;
  -webkit-user-drag: none;
`

const ChangeColorButton = styled.button`
  ${buttonStyles}
  bottom: -36px;
`
