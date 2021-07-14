import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { VimWasm } from "vim-wasm"
import { VimProps } from "./types"

export function useVim(
  {
    worker,
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

  useEffect(() => {
    const opts = {
      workerScriptPath: worker,
      canvas: canvas?.current,
      input: input?.current,
      onKeyDown
    }

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

  return [canvas, input, vim]
}
