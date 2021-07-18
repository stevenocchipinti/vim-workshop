import type { FC } from "react"
import styled from "styled-components"

const Stack = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  justify-content: space-evenly;
  flex: 1 0;
`

const Inline = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: baseline;
  flex-grow: 1;
`
const Big = styled.p`
  font-size: 2rem;
  margin: 0 0.5rem;
`
const CountUp: FC = ({ children }) => (
  <Inline>
    <Big>{children}</Big> keystrokes
  </Inline>
)

interface NotchProps {
  color: string
}

const Notch = styled.span<NotchProps>`
  transition: background-color 0.3s ease-out;
  height: 0.25rem;
  background-color: ${({ color }) => color};
  flex: 1 1;

  :first-of-type {
    border-radius: 2px 0 0 2px;
  }
  :last-of-type {
    border-radius: 0 2px 2px 0;
  }
`

const Bar = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  height: 10px;
  padding: 0.5rem;
  border-radius: 10px;
  border: 1px solid var(--text-color);
`

interface ProgressProps {
  keystrokes: string[]
  targetKeystrokes: number
}

const getNotchColor = (
  i: number,
  keystrokes: string[],
  targetKeystrokes: number
): string => {
  if (keystrokes.length > targetKeystrokes) return "var(--color-failure)"
  if (i < keystrokes.length) return "var(--color-success)"
  return "#FFF2"
}

const Progress: FC<ProgressProps> = ({ keystrokes, targetKeystrokes }) =>
  targetKeystrokes ? (
    <Stack>
      {`${keystrokes.length} / ${targetKeystrokes} keystrokes`}
      <Bar>
        {[...new Array(targetKeystrokes)].map((_keystroke, i) => (
          <Notch
            color={getNotchColor(i, keystrokes, targetKeystrokes)}
            key={i}
          />
        ))}
      </Bar>
    </Stack>
  ) : (
    <CountUp>{keystrokes.length}</CountUp>
  )

export default Progress
