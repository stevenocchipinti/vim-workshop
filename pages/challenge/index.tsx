import * as React from "react"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import styled from "styled-components"
import type {} from "styled-components/cssprop"

import Button from "../../components/Button"
import Window from "../../components/Window"
import Progress from "../../components/Progress"
import {
  Vim,
  VimWasmControl,
  checkVimWasmIsAvailable,
} from "../../components/Vim"

const VIM_WASM_AVAILABLITY_MESSAGE = checkVimWasmIsAvailable()

const DIRS = ["/challenge"]
const CMDARGS = ["/challenge/start"]

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
  font-family: monospace;
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

const ChallengePage: React.FC = () => {
  const [won, setWon] = useState<boolean | undefined>()
  const vimControl = React.useRef<VimWasmControl | null>()
  const [targetText, setTargetText] = useState("")
  const [targetKeystrokes, setTargetKeystrokes] = useState(0)
  const [keystrokes, setKeystrokes] = useState<string[]>([])
  const [files, setFiles] = useState<{ [path: string]: string }>()

  const onVimCreated = useCallback(
    vControl => {
      vimControl.current = vControl
    },
    [vimControl]
  )

  const onSubmit = useCallback(() => {
    vimControl.current?.vim?.cmdline("call EndChallenge()")
  }, [vimControl])

  const onRestart = useCallback(() => {
    vimControl.current?.restart()
    setWon(undefined)
    setKeystrokes([])
  }, [vimControl])

  const onKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter" && event.shiftKey) onSubmit()
      else if (event.key === "Escape" && event.shiftKey) onRestart()
      else setKeystrokes(keystrokes => [...keystrokes, event.key])
    },
    [onSubmit, onRestart]
  )

  const onFileExport = useCallback(
    (_path: string, buffer: ArrayBuffer) => {
      const td = new TextDecoder()
      const content = td.decode(buffer).replace(/\n$/, "")
      setWon(targetText === content)
      vimControl.current?.vim?.cmdline("qall!")
    },
    [targetText, vimControl]
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const start = params.get("start") || ""
    const end = (params.get("end") || "").replace(/\n$/, "")
    const target = parseInt(params.get("target") || "0")

    setTargetKeystrokes(target)
    setTargetText(params.get("end") || "")
    setFiles({
      "/challenge/start": start || "",
      "/challenge/end": end || "",
    })

    const cb = (event: KeyboardEvent) => {
      if (event.key === "Escape" && event.shiftKey) onRestart()
    }

    addEventListener("keydown", cb)
    return () => removeEventListener("keydown", cb)
  }, [onRestart])

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
        <Link href="/" passHref>
          <a>
            <Image
              src="/vim-workshop.svg"
              alt="Vim workshop logo"
              width={75}
              height={75}
            />
          </a>
        </Link>
        <Button onClick={onSubmit}>Submit</Button>
        <Button onClick={onRestart}>Restart</Button>
        <Progress keystrokes={keystrokes} targetKeystrokes={targetKeystrokes} />
      </Toolbar>

      <WindowManager>
        <IntroWindow>
          <h2 css="margin-bottom: 1rem">Welcome to Vim Workshop</h2>
          <p>
            Try to use the Vim window to transform the text into this target
            text in as few keystrokes as you can.
          </p>
        </IntroWindow>
        <TargetWindow>{targetText || "Loading..."}</TargetWindow>
        <VimWindow $border={getBorderState()}>
          {files && (
            <Vim
              worker="./vim-wasm/vim.js"
              onVimCreated={onVimCreated}
              onFileExport={onFileExport}
              cmdArgs={CMDARGS}
              dirs={DIRS}
              files={files}
              onKey={onKey}
            />
          )}
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

export default ChallengePage
