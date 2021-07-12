/* eslint-disable no-console */

import * as React from "react"
import { useState, useCallback } from "react"
import { render } from "react-dom"
import { useVim, checkVimWasmIsAvailable } from "./react-vim-wasm"
import "./styles.css"

const VIM_WASM_AVAILABLITY_MESSAGE = checkVimWasmIsAvailable()

const VimWasmExample: React.FC = () => {
  const [keystrokes, setKeystrokes] = useState(0)

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
    onFileExport: logArrayBuffer
    // cmdArgs: ["~/.vim/vimrc"]
    // dirs: ["/content"]
    // debug: true
  })

  // Ideally I would hook into vim-wasm's event handler but they sadly do not
  // provide a callback for this.
  const handler = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      event.preventDefault()
      event.stopPropagation()

      if (event.shiftKey && event.key === "Escape")
        vim?.cmdline("export solution")

      if (
        event.key === "Unidentified" ||
        event.key === "Control" ||
        event.key === "Shift" ||
        event.key === "Alt" ||
        event.key === "Meta"
      ) {
        console.log("Nope")
        return
      }

      setKeystrokes(keystrokes => keystrokes + 1)
      console.log("Key!", event.key, event.keyCode)
    },
    [vim]
  )

  if (VIM_WASM_AVAILABLITY_MESSAGE !== undefined) {
    const style = { color: "red", fontWeight: "bold" } as const
    return <div style={style}>{VIM_WASM_AVAILABLITY_MESSAGE}</div>
  }

  // FIXME: This should use onKeyDown instead of onKeyUp
  // to handle repeating keypresses but that is being captured by the library.
  return (
    <>
      <h1 style={{ color: "white" }}>{keystrokes} keystrokes</h1>
      <button onClick={() => vim?.cmdline("export solution")}>Submit</button>
      <div className="screen-wrapper">
        <canvas className="vim-screen" ref={canvasRef} />
        <input
          onKeyUp={handler}
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
