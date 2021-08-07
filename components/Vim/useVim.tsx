import type { MutableRefObject } from "react"
import { useState, useEffect, useRef } from "react"
import { useRerender } from "./useRerender"
import { VimWasm } from "./vim-wasm"
import { VimProps, VimWasmControl } from "./types"

export function useVim({
  worker = "./vim-wasm/vim.js",
  debug,
  perf,
  clipboard,
  onVimExit,
  onVimInit,
  onFileExport,
  readClipboard,
  onWriteClipboard,
  onError,
  onTitleUpdate,
  files,
  fetchFiles,
  dirs,
  persistentDirs,
  cmdArgs,
  onVimCreated,
  onKey,
}: VimProps): [
  MutableRefObject<HTMLCanvasElement | null> | null,
  MutableRefObject<HTMLInputElement | null> | null,
  VimWasmControl | null
] {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const input = useRef<HTMLInputElement | null>(null)
  const [restartDep, restart] = useRerender()
  const [vimControl, setVimControl] = useState(null as null | VimWasmControl)

  useEffect(() => {
    const v = new VimWasm({
      workerScriptPath: worker,
      canvas: canvas.current!,
      input: input.current!,
      onKey,
    })

    v.onVimInit = onVimInit
    v.onVimExit = onVimExit
    v.onFileExport = onFileExport
    v.readClipboard = readClipboard
    v.onWriteClipboard = onWriteClipboard
    v.onTitleUpdate = onTitleUpdate
    v.onError = onError

    const vControl: VimWasmControl = { vim: v, restart }

    if (onVimCreated !== undefined) onVimCreated(vControl)

    v.start({
      debug,
      perf,
      clipboard,
      files,
      fetchFiles,
      dirs,
      persistentDirs,
      cmdArgs,
    })
    setVimControl(vControl)

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
    restartDep,
  ])
  /* eslint-enable react-hooks/exhaustive-deps */

  // Note: Vim worker should be started once at componentDidMount `worker`,
  // `debug`, `perf` and `clipboard` are startup configuration. So when they
  // are changed, new Vim instance must be created with the new configuration.

  return [canvas, input, vimControl]
}
