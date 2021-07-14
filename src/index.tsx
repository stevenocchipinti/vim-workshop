/* eslint-disable no-console */
import * as React from "react"
import { useState, useCallback } from "react"
import { render } from "react-dom"
import Vim, { VimWasmControl, checkVimWasmIsAvailable } from "./Vim"
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
endfunction
`.trim()

const VimWasmExample: React.FC = () => {
  const [vimRunning, setVimRunning] = useState(false)
  const [won, setWon] = useState(false)
  const [vimControl, setVimControl] = useState<VimWasmControl | null>(null)
  const [targetText, setTargetText] = useState("")
  const [keystrokes, setKeystrokes] = useState<string[]>([])

  const FILES = React.useMemo(() => {
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
    setVimControl(vControl)
  }, [])

  const onKey = useCallback(event => {
    setKeystrokes(keystrokes => [...keystrokes, event.key])
  }, [])

  const onSubmit = useCallback(
    _event => {
      setVimRunning(false)
      vimControl?.vim?.cmdline("call EndChallenge()")
    },
    [vimControl]
  )

  const onRestart = useCallback(
    _event => {
      vimControl?.restart()
      setKeystrokes([])
    },
    [vimControl]
  )

  const onFileExport = useCallback(
    (_path: string, buffer: ArrayBuffer) => {
      const td = new TextDecoder()
      const content = td.decode(buffer).replace(/\n$/, "")
      setWon(targetText === content)
      vimControl?.vim?.cmdline("qall!")
    },
    [targetText, vimControl]
  )

  const state = vimRunning ? "Running" : won ? "You won!" : "You lost"

  if (VIM_WASM_AVAILABLITY_MESSAGE !== undefined)
    alert(VIM_WASM_AVAILABLITY_MESSAGE)

  return (
    <>
      <h1>{keystrokes.length} keystrokes</h1>
      <h2>{keystrokes.join(" - ")}</h2>
      <h2>{state}</h2>

      <button onClick={onSubmit}>Submit</button>
      <button onClick={onRestart}>Restart</button>

      <div className="screen-wrapper">
        <Vim
          worker="./vim-wasm/vim.js"
          className="vim-screen"
          onVimCreated={onVimCreated}
          onFileExport={onFileExport}
          onVimExit={() => setVimRunning(false)}
          onVimInit={() => setVimRunning(true)}
          cmdArgs={CMDARGS}
          dirs={DIRS}
          files={FILES}
          onKey={onKey}
        />
      </div>
    </>
  )
}

render(<VimWasmExample />, document.getElementById("app"))
