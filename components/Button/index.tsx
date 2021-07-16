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
  transition: 0.2s box-shadow;
  font-weight: 500;

  :hover {
    background: #fff1;
    box-shadow: inset 0 0 0 2px var(--color-standard);
  }
`

export default Button
