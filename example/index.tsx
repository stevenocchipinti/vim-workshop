import * as React from "react"
import { useState, useCallback } from "react"
import { render } from "react-dom"
import { VimWasm } from "vim-wasm"
import { Vim, checkVimWasmIsAvailable } from ".."
import "./styles.css"

const VIM_WASM_AVAILABLITY_MESSAGE = checkVimWasmIsAvailable()

const VimWasmExample: React.FC = () => {
  const [, setVim] = useState<VimWasm | null>(null)

  const onVim = useCallback(v => {
    setVim(v)
  }, [])

  const onError = useCallback((e: Error) => {
    alert(`Error! ${e.message}`)
  }, [])

  const onVimExit = useCallback((status: number) => {
    alert(`Vim exited with status ${status}`)
  }, [])

  if (VIM_WASM_AVAILABLITY_MESSAGE !== undefined) {
    const style = { color: "red", fontWeight: "bold" } as const
    return <div style={style}>{VIM_WASM_AVAILABLITY_MESSAGE}</div>
  }

  return (
    <div className="screen-wrapper">
      <Vim
        worker="./static/vim-wasm/vim.js"
        className="vim-screen"
        onVimExit={onVimExit}
        onError={onError}
        onVimCreated={onVim}
      />
    </div>
  )
}

render(<VimWasmExample />, document.getElementById("react-root"))
