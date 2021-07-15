/* eslint-disable no-console */
import * as React from "react"
import { useEffect, useMemo, useState, useCallback } from "react"
import { render } from "react-dom"
import styled from "styled-components"
import Vim, { VimWasmControl, checkVimWasmIsAvailable } from "./Vim"
import Window from "./Window"
import "./styles.css"

const VIM_WASM_AVAILABLITY_MESSAGE = checkVimWasmIsAvailable()

const DIRS = ["/challenge"]
const CMDARGS = ["/challenge/start"]

const vimrc = `
set expandtab tabstop=2 shiftwidth=2 softtabstop=2
colorscheme onedark
syntax enable

function EndChallenge()
  write
  export
  vsplit /challenge/end
  windo diffthis
  redraw
  qall!
endfunction
`.trim()

const Layout = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: 100px 1fr 3rem;
`

const WindowManager = styled.main`
  max-width: 1400px;
  display: grid;
  margin: 2rem;
  grid-gap: 2rem;
  grid-template-columns: 1fr 1.5fr;
  grid-template-areas:
    "intro   vim"
    "target  vim";

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "intro"
      "target"
      "vim";
  }
`

const Toolbar = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0 2rem;
  background-color: var(--toolbar-color);
`

const IntroWindow = styled(Window)`
  grid-area: intro;
`

const TargetWindow = styled(Window)`
  grid-area: target;
`

const VimWindow = styled(Window)`
  grid-area: vim;

  :not(:focus-within) {
    filter: opacity(0.7);
  }
`

const Footer = styled.footer`
  font-family: monospace;
  display: flex;
  gap: 0.5rem;
  overflow: scroll;
  font-size: 14px;
  padding: 0 2rem;
  align-items: center;
  background-color: var(--toolbar-color);
`

const Key = styled.span`
  flex-shrink: 0;
  border: 1px solid var(--text-color);
  padding: 0.25rem;
  border-radius: 5px;
  min-width: 1rem;
  text-align: center;
`

const Button = styled.button`
  color: inherit;
  font: inherit;
  background: transparent;
  padding: 1rem;
  border-radius: 6px;
  border: var(--border);
  border-width: 2px;
`

const ChallengePage: React.FC = () => {
  const [won, setWon] = useState<boolean | undefined>()
  const vimControl = React.useRef<VimWasmControl | null>()
  const [targetText, setTargetText] = useState("")
  const [targetKeystrokes, setTargetKeystrokes] = useState(0)
  const [keystrokes, setKeystrokes] = useState<string[]>([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setTargetKeystrokes(parseInt(params.get("target") || "0"))

    const cb = (event: KeyboardEvent) => {
      console.log(event)
      if (event.key === "Escape" && event.shiftKey) {
        console.log("sdf")
        onRestart()
      }
    }
    addEventListener("keydown", cb)
    return () => removeEventListener("keydown", cb)
  }, [])

  const FILES = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const start = params.get("start") || ""
    const end = params.get("end") || ""

    setTargetText(params.get("end") || "")

    return {
      "/home/web_user/.vim/vimrc": vimrc,
      "/challenge/start": start || "",
      "/challenge/end": end || "",
    }
  }, [])

  const onVimCreated = useCallback(vControl => {
    vimControl.current = vControl
  }, [])

  const onKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter" && event.shiftKey) onSubmit()
      else if (event.key === "Escape" && event.shiftKey) onRestart()
      else setKeystrokes(keystrokes => [...keystrokes, event.key])
    },
    [vimControl.current, keystrokes]
  )

  const onSubmit = useCallback(() => {
    console.log("submit", vimControl.current)
    vimControl.current?.vim?.cmdline("call EndChallenge()")
  }, [vimControl.current])

  const onRestart = useCallback(() => {
    vimControl.current?.restart()
    setWon(undefined)
    setKeystrokes([])
  }, [vimControl.current])

  const onFileExport = useCallback(
    (_path: string, buffer: ArrayBuffer) => {
      const td = new TextDecoder()
      const content = td.decode(buffer).replace(/\n$/, "")
      setWon(targetText === content)
      vimControl.current?.vim?.cmdline("qall!")
    },
    [targetText, vimControl.current]
  )

  if (VIM_WASM_AVAILABLITY_MESSAGE !== undefined)
    alert(VIM_WASM_AVAILABLITY_MESSAGE)

  const getBorderState = () => {
    if (won) return "success"
    if (won === false) return "failure"
    if (won === undefined) return undefined
    return undefined
  }

  return (
    <Layout>
      <Toolbar>
        <Button onClick={onSubmit}>Submit</Button>
        <Button onClick={onRestart}>Restart</Button>
        <div>
          {keystrokes.length} / {targetKeystrokes || "∞"} keystrokes
        </div>
      </Toolbar>

      <WindowManager>
        <IntroWindow>Hello</IntroWindow>
        <TargetWindow>Target</TargetWindow>
        <VimWindow $border={getBorderState()}>
          <Vim
            worker="./vim-wasm/vim.js"
            onVimCreated={onVimCreated}
            onFileExport={onFileExport}
            cmdArgs={CMDARGS}
            dirs={DIRS}
            files={FILES}
            onKey={onKey}
          />
        </VimWindow>
      </WindowManager>

      <Footer>
        {keystrokes.map((keystroke, i) => (
          <Key key={i}>{keystroke}</Key>
        ))}
      </Footer>
    </Layout>
  )
}

render(<ChallengePage />, document.getElementById("app"))
