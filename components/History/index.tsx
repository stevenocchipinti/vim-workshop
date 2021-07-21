import { useEffect, useRef } from "react"
import styled from "styled-components"
import * as clipboard from "clipboard-polyfill"
import ClockIcon from "../icons/ClockIcon"
import { IconButton } from "../Button"

const HistoryIcon = styled(ClockIcon)`
  height: 1.5rem;
  width: 1.5rem;
`

const Keys = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 0.5rem;
  overflow: scroll;
  scroll-behavior: smooth;
`

const Key = styled.span`
  flex-shrink: 0;
  border: 1px solid var(--text-color);
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  min-width: 1rem;
  text-align: center;
`

interface HistoryProps {
  keystrokes: string[]
}
const History = ({ keystrokes }: HistoryProps) => {
  const keysRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = keysRef?.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [keystrokes, keysRef])

  const hasKeystrokes = keystrokes.length > 0
  return (
    <>
      <IconButton
        disabled={!hasKeystrokes}
        onClick={() => clipboard.writeText(keystrokes.join(""))}
        title={
          hasKeystrokes
            ? "Copy keystrokes to clipboard"
            : "Keystrokes will be recorded here"
        }
      >
        <HistoryIcon />
      </IconButton>
      <Keys ref={keysRef}>
        {keystrokes.map((keystroke, i) => (
          <Key key={i}>{keystroke}</Key>
        ))}
      </Keys>
    </>
  )
}

export default History
