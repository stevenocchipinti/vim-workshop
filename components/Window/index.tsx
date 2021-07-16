import type { FC } from "react"
import styled from "styled-components"

interface ContainerProps {
  $border: "success" | "failure" | "standard"
}
const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  ${({ $border }) => `--border-color: var(--color-${$border});`}
`

interface TitleProps {
  $active: boolean
}
const Title = styled.div<TitleProps>`
  color: ${({ $active }) => ($active ? "inherit" : "var(--dim-text-color)")};
  border-radius: 10px 10px 0 0;
  background-color: var(--window-titlebar-color);
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  border-bottom: 0;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  letter-spacing: 1px;
`

interface ContentProps {
  $hasTitle?: boolean
}
const Content = styled.div<ContentProps>`
  border-radius: ${({ $hasTitle }) => ($hasTitle ? "0 0 10px 10px" : "10px")};
  background-color: var(--window-color);
  border: 1px solid var(--border-color);
  padding: 1rem;
  flex-grow: 1;
`

interface WindowProps {
  border?: "success" | "failure" | "standard"
  active?: boolean
  title?: string
}
const Window: FC<WindowProps> = ({
  children,
  title,
  border = "standard",
  active = true,
  ...props
}) => (
  <Container $border={border} {...props}>
    {title && (
      <Title $active={active}>
        {title} {!active && "(inactive)"}
      </Title>
    )}
    <Content $hasTitle={!!title}>{children}</Content>
  </Container>
)

export default Window
