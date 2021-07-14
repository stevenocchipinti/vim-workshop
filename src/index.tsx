/* eslint-disable no-console */
import * as React from "react"
import { useState, useCallback } from "react"
import { render } from "react-dom"
import { VimWasm } from "vim-wasm"
import { Vim, checkVimWasmIsAvailable } from "./Vim"
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

const VimWasmExample: React.SFC = () => {
  const [vim, setVim] = useState<VimWasm | null>(null)
  const [targetText, setTargetText] = useState("")
  const [keystrokes, setKeystrokes] = useState<string[]>([])

  const [count, setCount] = useState(0)

  const FILES = React.useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const start = params.get("start") || ""
    const end = params.get("end") || ""

    setTargetText(params.get("end") || "")

    return {
      "/home/web_user/.vim/vimrc": vimrc,
      "/challenge/start": start || "",
      "/challenge/end": end || ""
    }
  }, [])

  const onVimCreated = useCallback(v => {
    setVim(v)
  }, [])

  const onError = useCallback((e: Error) => {
    console.error(`Error! ${e.message}`)
  }, [])

  const onVimExit = useCallback((status: number) => {
    console.log(`Vim exited with status ${status}`)
  }, [])

  const onKey = useCallback(event => {
    setKeystrokes(keystrokes => [...keystrokes, event.key])
  }, [])

  const onSubmit = useCallback(
    _event => {
      vim?.cmdline("call EndChallenge()")
    },
    [vim]
  )

  const onRestart = useCallback(_event => {
    setCount(count => count + 1)
  }, [])

  const onFileExport = useCallback(
    (_path: string, buffer: ArrayBuffer) => {
      const td = new TextDecoder()
      const content = td.decode(buffer).replace(/\n$/, "")
      console.log(targetText === content ? "You win" : "You lose")
      vim?.cmdline("qall!")
    },
    [targetText, vim]
  )

  if (VIM_WASM_AVAILABLITY_MESSAGE !== undefined)
    alert(VIM_WASM_AVAILABLITY_MESSAGE)

  return (
    <>
      <h1 style={{ color: "white" }}>{keystrokes.length} keystrokes</h1>
      <h2 style={{ color: "white" }}>{keystrokes.join(" - ")}</h2>
      <button onClick={onSubmit}>Submit</button>
      <button onClick={onRestart}>Restart</button>

      <div className="screen-wrapper">
        <Vim
          worker="./vim-wasm/vim.js"
          className="vim-screen"
          onVimCreated={onVimCreated}
          onVimExit={onVimExit}
          onError={onError}
          onFileExport={onFileExport}
          onKeyDown={onKey}
          cmdArgs={CMDARGS}
          dirs={DIRS}
          files={FILES}
          dependency={count}
        />
      </div>
    </>
  )
}

render(<VimWasmExample />, document.getElementById("react-root"))
