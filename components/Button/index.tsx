import styled from "styled-components"

const Button = styled.button`
  color: inherit;
  font: inherit;
  background: transparent;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  border: var(--border);
  border-width: 2px;
  cursor: pointer;
  font-weight: 500;
  text-align: center;
  transition: 0.2s all;

  :disabled {
    opacity: 0.5;
    cursor: auto;
  }

  :not(:disabled):active {
    transform: scale(1.1);
  }

  :not(:disabled):focus {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--color-standard);
  }

  :not(:disabled):hover {
    background: #fff1;
    box-shadow: inset 0 0 0 2px var(--color-standard);
  }
`

const IconButton = styled(Button)`
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border: none;
`

export { Button, IconButton }
