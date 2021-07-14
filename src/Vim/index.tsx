import * as React from "react"
import { useVim } from "./useVim"
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
  left: "0px",
} as const

const Vim: React.FC<VimProps> = ({ className, style, id, ...props }) => {
  const [canvasRef, inputRef] = useVim(props)

  return (
    <>
      <canvas ref={canvasRef} style={style} className={className} id={id} />
      <input ref={inputRef} style={INPUT_STYLE} autoComplete="off" autoFocus />
    </>
  )
}

export default Vim
export { VimWasmControl } from "./types"
export {
  VimWasm,
  checkBrowserCompatibility as checkVimWasmIsAvailable,
} from "./vim-wasm"
