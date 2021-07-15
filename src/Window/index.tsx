import styled from "styled-components"

interface Props {
  $border?: "success" | "failure"
}

const Window = styled.div<Props>`
  border-radius: 10px;
  background-color: var(--window-color);
  padding: 0.75rem;
  --border-color: var(--border-color-standard);
  border: 1px solid var(--border-color);

  ${({ $border }) =>
    $border === "success" && `--border-color: var(--border-color-success);`}
  ${({ $border }) =>
    $border === "failure" && `--border-color: var(--border-color-failure);`}
`

export default Window
