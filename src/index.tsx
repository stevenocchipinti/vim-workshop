/* eslint-disable no-console */
import * as React from "react"
import { useState, useCallback } from "react"
import { render } from "react-dom"
import { Vim, checkVimWasmIsAvailable } from "./react-vim-wasm"
import "./styles.css"

const VIM_WASM_AVAILABLITY_MESSAGE = checkVimWasmIsAvailable()

const DIRS = ["/challenge"]
const CMDARGS = ["/challenge/start"]

const vimrc = `
set expandtab tabstop=2 shiftwidth=2 softtabstop=2
colorscheme onedark
syntax enable

function EndChallenge()
  vsplit /challenge/end
  vsplit /challenge/start
  windo diffthis
  call jsevalfunc('alert("done")')
endfunction

au QuitPre * call EndChallenge()
`.trim()

const VimWasmExample: React.SFC = () => {
  const FILES = React.useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    let start = params.get("start")
    let end = params.get("end")

    return {
      "/home/web_user/.vim/vimrc": vimrc,
      "/challenge/start": start || "",
      "/challenge/end": end || ""
    }
  }, [])
  const [keystrokes, setKeystrokes] = useState<string[]>([])

  const onError = useCallback((e: Error) => {
    console.error(`Error! ${e.message}`)
  }, [])

  const onVimExit = useCallback((status: number) => {
    alert(`Vim exited with status ${status}`)
  }, [])

  const onKey = useCallback(event => {
    setKeystrokes(keystrokes => [...keystrokes, event.key])
  }, [])

  const logArrayBuffer = useCallback((_path: string, buffer: ArrayBuffer) => {
    const td = new TextDecoder()
    alert(td.decode(buffer))
  }, [])

  if (VIM_WASM_AVAILABLITY_MESSAGE !== undefined)
    alert(VIM_WASM_AVAILABLITY_MESSAGE)

  return (
    <>
      <h1 style={{ color: "white" }}>{keystrokes.length} keystrokes</h1>
      <h2 style={{ color: "white" }}>{keystrokes.join(" - ")}</h2>
      <div className="screen-wrapper">
        <Vim
          worker="./static/vim-wasm/vim.js"
          className="vim-screen"
          onVimExit={onVimExit}
          onError={onError}
          onFileExport={logArrayBuffer}
          onKeyDown={onKey}
          cmdArgs={CMDARGS}
          dirs={DIRS}
          files={FILES}
        />
      </div>
    </>
  )
}

render(<VimWasmExample />, document.getElementById("react-root"))
