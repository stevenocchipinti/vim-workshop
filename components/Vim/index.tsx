import * as React from "react"
import { useVim } from "./useVim"
import { VimProps } from "./types"
import styled from "styled-components"

const Input = styled.input`
  width: 1px;
  color: transparent;
  background-color: transparent;
  padding: 0px;
  border: 0px;
  outline: none;
  position: relative;
  top: 0px;
  left: 0px;
`

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  margin-bottom: -28px;
`

const Vim: React.FC<VimProps> = ({ className, style, id, ...props }) => {
  const [canvasRef, inputRef] = useVim(props)

  return (
    <>
      <Canvas ref={canvasRef} style={style} className={className} id={id} />
      <Input ref={inputRef} autoComplete="off" autoFocus />
    </>
  )
}

export default Vim
export type { VimWasmControl } from "./types"
export {
  VimWasm,
  checkBrowserCompatibility as checkVimWasmIsAvailable,
} from "./vim-wasm"
