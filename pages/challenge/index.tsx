import type { FC } from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import styled from "styled-components"
import type {} from "styled-components/cssprop"

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
  overflow: scroll;
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
  const [keystrokes, setKeystrokes] = useState<string[]>([])
  const [files, setFiles] = useState<{ [path: string]: string }>()

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
      query: { start, end: end.replace(/\n$/, ""), name, description, target },
    })
  }, [router, start, end, name, description, target])

  const onKey = useCallback(
    (event: KeyboardEvent) => {
      const { key, shiftKey } = event

      if (shiftKey && key === "Enter") onSubmit()
      else if (shiftKey && key === "Escape") onRestart()
      else if (shiftKey && key === "Tab") homeLinkRef.current?.focus()
      else setKeystrokes(keystrokes => [...keystrokes, key])
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

    setName(name)
    setDescription(description)
    setTarget(target)
    setStart(start)
    setEnd(end)
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
    if (correct === undefined) return undefined
    return correct ? "success" : "failure"
  }

  return (
    <Layout>
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
          <IconButton
            css="grid-area: restart;"
            onClick={onRestart}
            title="Restart (Shift + Escape)"
          >
            <RestartIcon />
          </IconButton>
          <IconButton css="grid-area: edit;" onClick={onEdit} title="Edit">
            <EditIcon />
          </IconButton>
          <Button
            css="grid-area: submit;"
            onClick={onSubmit}
            title="Submit (Shift + Enter)"
          >
            Submit
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
