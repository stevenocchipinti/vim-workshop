import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { VimWasm, ScreenDrawer } from "vim-wasm"
export { checkBrowserCompatibility as checkVimWasmIsAvailable } from "vim-wasm"

export interface VimProps {
  worker: string
  drawer?: ScreenDrawer
  debug?: boolean
  perf?: boolean
  clipboard?: boolean
  onVimExit?: (status: number) => void
  onVimInit?: () => void
  onFileExport?: (fullpath: string, contents: ArrayBuffer) => void
  onKeyDown?: (event: KeyboardEvent) => void
  readClipboard?: () => Promise<string>
  onWriteClipboard?: (text: string) => Promise<void>
  onError?: (err: Error) => void
  onTitleUpdate?: (title: string) => void
  files?: { [path: string]: string }
  fetchFiles?: { [path: string]: string }
  dirs?: string[]
  persistentDirs?: string[]
  cmdArgs?: string[]
  className?: string
  style?: React.CSSProperties
  id?: string
  onVimCreated?: (vim: VimWasm) => void
  dependency?: number
}

export function useVim(
  {
    worker,
    drawer,
    debug,
    perf,
    clipboard,
    onVimExit,
    onVimInit,
    onFileExport,
    onKeyDown,
    readClipboard,
    onWriteClipboard,
    onError,
    onTitleUpdate,
    files,
    fetchFiles,
    dirs,
    persistentDirs,
    cmdArgs,
    onVimCreated
  }: VimProps,
  dependency: number
): [
  React.MutableRefObject<HTMLCanvasElement | null> | null,
  React.MutableRefObject<HTMLInputElement | null> | null,
  VimWasm | null
] {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const input = useRef<HTMLInputElement | null>(null)
  const [vim, setVim] = useState(null as null | VimWasm)

  console.log(dependency)

  useEffect(() => {
    console.log("effecting")

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const opts = {
      workerScriptPath: worker,
      canvas: canvas.current!,
      input: input.current!,
      onKeyDown
    }
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    const v = new VimWasm(opts)

    v.onVimInit = onVimInit
    v.onVimExit = onVimExit
    v.onFileExport = onFileExport
    v.readClipboard = readClipboard
    v.onWriteClipboard = onWriteClipboard
    v.onTitleUpdate = onTitleUpdate
    v.onError = onError

    if (onVimCreated !== undefined) onVimCreated(v)

    v.start({
      debug,
      perf,
      clipboard,
      files,
      fetchFiles,
      dirs,
      persistentDirs,
      cmdArgs
    })
    setVim(v)

    return () => {
      if (v.isRunning()) v.cmdline("qall!")
    }

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    worker,
    debug,
    perf,
    clipboard,
    files,
    dirs,
    persistentDirs,
    cmdArgs,
    dependency
  ])
  /* eslint-enable react-hooks/exhaustive-deps */

  // Note: Vim worker should be started once at componentDidMount `worker`,
  // `debug`, `perf` and `clipboard` are startup configuration. So when they
  // are changed, new Vim instance must be created with the new configuration.

  if (drawer !== undefined) return [null, null, vim]

  return [canvas, input, vim]
}

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
