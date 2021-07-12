/* eslint-disable no-console */

import * as React from "react"
import { useState, useCallback } from "react"
import { render } from "react-dom"
import { useVim, checkVimWasmIsAvailable } from "./react-vim-wasm"
import "./styles.css"

const VIM_WASM_AVAILABLITY_MESSAGE = checkVimWasmIsAvailable()

const VimWasmExample: React.FC = () => {
  const [keystrokes, setKeystrokes] = useState<string[]>([])

  const onError = useCallback((e: Error) => {
    console.error(`Error! ${e.message}`)
  }, [])

  const onVimExit = useCallback((status: number) => {
    alert(`Vim exited with status ${status}`)
  }, [])

  const logArrayBuffer = useCallback((_path: string, buffer: ArrayBuffer) => {
    const td = new TextDecoder()
    alert(td.decode(buffer))
  }, [])

  const [canvasRef, inputRef, vim] = useVim({
    worker: "./static/vim-wasm/vim.js",
    className: "vim-screen",
    onVimExit: onVimExit,
    onError: onError,
    onFileExport: logArrayBuffer,
    onKeyDown: e => {
      setKeystrokes(keystrokes => [...keystrokes, e.key])
    }
    // FIXME: These options cause an infinite loop
    //   cmdArgs: ["~/.vim/vimrc"]
    //   dirs: ["/content"]
    //   debug: true
  })

  if (VIM_WASM_AVAILABLITY_MESSAGE !== undefined) {
    const style = { color: "red", fontWeight: "bold" } as const
    return <div style={style}>{VIM_WASM_AVAILABLITY_MESSAGE}</div>
  }

  return (
    <>
      <h1 style={{ color: "white" }}>{keystrokes.length} keystrokes</h1>
      <h2 style={{ color: "white" }}>{keystrokes.join(" - ")}</h2>
      <button onClick={() => vim?.cmdline("export solution")}>Submit</button>
      <div className="screen-wrapper">
        <canvas className="vim-screen" ref={canvasRef} />
        <input
          className="vim-input"
          ref={inputRef}
          autoComplete="off"
          autoFocus
        />
      </div>
    </>
  )
}

render(<VimWasmExample />, document.getElementById("react-root"))
