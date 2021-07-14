import { VimWasm } from "vim-wasm"

export interface VimProps {
  worker: string
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
