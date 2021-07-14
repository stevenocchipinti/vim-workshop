import * as React from "react"
import { useVim } from "./useVim"
export { checkBrowserCompatibility as checkVimWasmIsAvailable } from "vim-wasm"
import { VimProps } from "./types"

const INPUT_STYLE = {
  width: "1px",
  color: "transparent",
  backgroundColor: "transparent",
  padding: "0px",
  border: "0px",
  outline: "none",
  position: "relative",
  top: "0px",
  left: "0px"
} as const

export const Vim: React.SFC<VimProps> = props => {
  const [canvasRef, inputRef, vim] = useVim(props, props.dependency || 0)

  // When drawer prop is set, it has responsibility to render screen.
  // This component does not render screen and handle inputs.
  if (canvasRef === null || inputRef === null) return null

  const {
    style,
    className,
    id,
    onVimExit,
    onVimInit,
    onFileExport,
    onKeyDown,
    onWriteClipboard,
    onError,
    readClipboard
  } = props

  if (vim !== null) {
    vim.onVimExit = onVimExit
    vim.onVimInit = onVimInit
    vim.onFileExport = onFileExport
    vim.onKeyDown = onKeyDown
    vim.onWriteClipboard = onWriteClipboard
    vim.onError = onError
    vim.readClipboard = readClipboard
  }

  return (
    <>
      <canvas ref={canvasRef} style={style} className={className} id={id} />
      <input ref={inputRef} style={INPUT_STYLE} autoComplete="off" autoFocus />
    </>
  )
}
