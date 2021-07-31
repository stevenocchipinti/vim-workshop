import type { FC } from "react"
import type {} from "styled-components/cssprop"
import { useEffect, useState, useRef, useCallback } from "react"
import styled from "styled-components"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"

import { Button, IconButton } from "../../components/Button"
import Window from "../../components/Window"
import Progress from "../../components/Progress"
import History from "../../components/History"
import {
  Vim,
  VimWasmControl,
  checkVimWasmIsAvailable,
} from "../../components/Vim"

import RefreshIcon from "../../components/icons/RefreshIcon"
import PencilIcon from "../../components/icons/PencilIcon"

import { useWindowSize } from "react-use"
import Confetti from "react-confetti"

const VIM_WASM_AVAILABLITY_MESSAGE = checkVimWasmIsAvailable()
const DEFAULT_NAME = "Welcome to Vim Workshop"
const DEFAULT_DESCRIPTION = `Try to use the Vim window to transform the text
into this target text in as few keystrokes as you can.`

const DIRS = ["/challenge"]
const CMDARGS = ["/challenge/start"]

const Layout = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: 100px 1fr 3rem;
`

const WindowManager = styled.main`
  width: 100%;
  max-width: var(--max-width);
  display: grid;
  padding: 2rem;
  margin: 0 auto;
  grid-gap: 2rem;
  grid-template-rows: max-content 1fr;
  grid-template-columns: 1fr;
  grid-template-areas:
    "intro"
    "target"
    "vim";

  @media (min-width: 1100px) {
    grid-template-columns: 1fr 1.5fr;
    grid-template-areas:
      "intro   vim"
      "target  vim";
  }
`

const Toolbar = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  padding: 0 2rem;
  background-color: var(--toolbar-color);
`

const ToolbarActions = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-areas:
    "restart submit"
    "edit  submit";
`

const IntroWindow = styled(Window)`
  grid-area: intro;
`

const TargetWindow = styled(Window).attrs({ title: "Target" })`
  grid-area: target;
`
const Pre = styled.pre`
  font-size: 1rem;
`

const VimWindow = styled(Window).attrs({ title: "Vim" })`
  grid-area: vim;

  :not(:focus-within) {
    filter: opacity(0.7);
  }
`

const Footer = styled.footer`
  font-family: monospace;
  display: flex;
  gap: 0.5rem;
  overflow: hidden;
  font-size: 14px;
  padding: 0 2rem;
  align-items: center;
  background-color: var(--toolbar-color);
`

const RestartIcon = styled(RefreshIcon)`
  height: 1rem;
  width: 1rem;
`

const EditIcon = styled(PencilIcon)`
  height: 1rem;
  width: 1rem;
`

// :help keycodes
const keyEventToVimCode = (event: KeyboardEvent) => {
  const { key, shiftKey, ctrlKey, metaKey, altKey } = event

  interface KeyToString {
    [index: string]: string
  }
  const keyToString: KeyToString = {
    Backspace: "BS",
    Delete: "Del",
    ArrowUp: "Up",
    ArrowDown: "Down",
    ArrowLeft: "Left",
    ArrowRight: "Right",
    Escape: "Esc",
    Enter: "Enter",
    Tab: "Tab",
    " ": "Space",
  }

  const isSpecial = keyToString[key]
  const keyString = keyToString[key] || key
  if (isSpecial && shiftKey) return `<S-${keyString}>`
  if (ctrlKey) return `<C-${keyString}>`
  if (metaKey) return `<D-${keyString}>`
  if (altKey) return `<A-${keyString}>`
  return isSpecial ? `<${keyString}>` : key
}

const ChallengePage: FC = () => {
  const vimControl = useRef<VimWasmControl | null>()
  const [vimRunning, setVimRunning] = useState<boolean>()
  const [correct, setCorrect] = useState<boolean | undefined>()
  const homeLinkRef = useRef<HTMLAnchorElement>(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [target, setTarget] = useState(0)
  const [filetype, setFiletype] = useState("")
  const [keystrokes, setKeystrokes] = useState<string[]>([])
  const [files, setFiles] = useState<{ [path: string]: string }>()

  const { width, height } = useWindowSize()

  const onSubmit = useCallback(() => {
    vimControl.current?.vim?.cmdline("call EndChallenge()")
  }, [vimControl])

  const onRestart = useCallback(() => {
    vimControl.current?.restart()
    setCorrect(undefined)
    setKeystrokes([])
  }, [vimControl])

  const router = useRouter()
  const onEdit = useCallback(() => {
    router.push({
      pathname: "/create-challenge",
      query: {
        start,
        end: end.replace(/\n$/, ""),
        name,
        description,
        target,
        filetype,
      },
    })
  }, [router, start, end, name, description, target, filetype])

  const onKey = useCallback(
    (event: KeyboardEvent) => {
      const { key, altKey } = event
      const vimCode = keyEventToVimCode(event)

      if (altKey && key === "Enter") onSubmit()
      else if (altKey && key === "Escape") onRestart()
      else if (altKey && key === "Tab") homeLinkRef.current?.focus()
      else setKeystrokes(keystrokes => [...keystrokes, vimCode])
    },
    [onSubmit, onRestart]
  )

  const onFileExport = useCallback(
    (_path: string, buffer: ArrayBuffer) => {
      const td = new TextDecoder()
      const content = td.decode(buffer)
      setCorrect(end === content)
      vimControl.current?.vim?.cmdline("qall!")
    },
    [end, vimControl]
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const name = params.get("name") || DEFAULT_NAME
    const description = params.get("description") || DEFAULT_DESCRIPTION
    const start = params.get("start") || ""
    const end = params.get("end") + "\n" || ""
    const target = parseInt(params.get("target") || "0")
    const filetype = params.get("filetype") || ""
    const sanitizedFiletype = filetype.replace(/[^a-zA-Z0-9]/g, "")

    setName(name)
    setDescription(description)
    setTarget(target)
    setFiletype(sanitizedFiletype)
    setStart(start)
    setEnd(end)
    setFiles({
      "/challenge/start": start || "",
      "/challenge/end": end || "",
    })

    const cb = (event: KeyboardEvent) => {
      if (event.key === "Escape" && event.altKey) onRestart()
    }

    addEventListener("keydown", cb)
    return () => removeEventListener("keydown", cb)
  }, [onRestart])

  if (VIM_WASM_AVAILABLITY_MESSAGE !== undefined)
    alert(VIM_WASM_AVAILABLITY_MESSAGE)

  const getBorderState = () => {
    if (correct === undefined) return undefined
    return correct ? "success" : "failure"
  }

  return (
    <Layout>
      {correct && (target ? keystrokes.length === target : true) && (
        <Confetti width={width} height={height} recycle={false} />
      )}
      <Toolbar>
        <Link href="/" passHref>
          <a ref={homeLinkRef} aria-label="Go to homepage">
            <Image
              src="/vim-workshop.svg"
              alt="Vim workshop logo"
              width={50}
              height={50}
            />
          </a>
        </Link>
        <Progress keystrokes={keystrokes} targetKeystrokes={target} />
        <ToolbarActions>
          {vimRunning && keystrokes.length > 0 && (
            <IconButton
              css="grid-area: restart;"
              onClick={onRestart}
              title="Restart (Alt + Escape)"
            >
              <RestartIcon />
            </IconButton>
          )}
          <IconButton css="grid-area: edit;" onClick={onEdit} title="Edit">
            <EditIcon />
          </IconButton>
          <Button
            css="grid-area: submit; min-width: 7rem;"
            onClick={vimRunning ? onSubmit : onRestart}
            title={
              vimRunning ? "Submit (Alt + Enter)" : "Restart (Alt + Escape)"
            }
          >
            {vimRunning ? "Submit" : "Restart"}
          </Button>
        </ToolbarActions>
      </Toolbar>

      <WindowManager>
        <IntroWindow title={name}>{description}</IntroWindow>
        <TargetWindow>
          <Pre>{end || "Loading..."}</Pre>
        </TargetWindow>
        <VimWindow active={vimRunning} border={getBorderState()}>
          {files && (
            <Vim
              onVimCreated={vControl => {
                vControl?.vim?.cmdline(`set filetype=${filetype}`)
                vimControl.current = vControl
              }}
              onFileExport={onFileExport}
              onVimInit={() => setVimRunning(true)}
              onVimExit={() => setVimRunning(false)}
              cmdArgs={CMDARGS}
              dirs={DIRS}
              files={files}
              onKey={onKey}
            />
          )}
        </VimWindow>
      </WindowManager>

      <Footer>
        <History keystrokes={keystrokes} />
      </Footer>
    </Layout>
  )
}

export default ChallengePage
