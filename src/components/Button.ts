import styled from '@emotion/styled'

export const Button = styled.button`
  min-width: 164px;
  padding: 16px 24px;
  cursor: pointer;

  border-radius: 8px;
  border: 1px solid #333;
  background-color: white;

  font-size: 16px;
  font-weight: bold;

  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.85);
  }
`
