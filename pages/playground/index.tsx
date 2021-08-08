import { FC, useCallback, useEffect, useRef, useState } from "react"
import type {} from "styled-components/cssprop"
import styled from "styled-components"
import Link from "next/link"
import Image from "next/image"
import { saveAs } from "file-saver"

import { Button } from "../../components/Button"
import Window from "../../components/Window"
import {
  Vim,
  VimWasmControl,
  checkVimWasmIsAvailable,
  playgroundVimrc as vimrc,
} from "../../components/Vim"

const VIM_WASM_AVAILABLITY_MESSAGE = checkVimWasmIsAvailable()
const DOT_VIM_DIRS = ["/home/web_user/.vim"]

const Layout = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: 100px 1fr;
  max-height: 100vh;
`

const Toolbar = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  padding: 0 2rem;
  background-color: var(--toolbar-color);
`

const VimWindow = styled(Window)`
  margin: 2rem auto;
  max-width: 100vh;
  width: 100%;

  :not(:focus-within) {
    filter: opacity(0.7);
  }
`

function downloadFile(fullpath: string, contents: ArrayBuffer) {
  const slashIdx = fullpath.lastIndexOf("/")
  const filename = slashIdx !== -1 ? fullpath.slice(slashIdx + 1) : fullpath
  const blob = new Blob([contents], { type: "application/octet-stream" })
  saveAs(blob, filename)
}

const PlaygroundPage: FC = () => {
  const vimControl = useRef<VimWasmControl | null>()
  const [title, setTitle] = useState<string>("Vim")
  const [files, setFiles] = useState<{ [path: string]: string }>()
  const [vimRunning, setVimRunning] = useState<boolean>()

  const onError = useCallback((e: Error) => {
    alert(`Error! ${e.message}`)
  }, [])

  const onTitleUpdate = useCallback((title: string) => {
    setTitle(title)
  }, [])

  useEffect(() => {
    setFiles({
      "/home/web_user/.vim/vimrc": vimrc,
    })
  }, [])

  if (VIM_WASM_AVAILABLITY_MESSAGE !== undefined) {
    const style = { color: "red", fontWeight: "bold" } as const
    return <div style={style}>{VIM_WASM_AVAILABLITY_MESSAGE}</div>
  }

  return (
    <Layout>
      <Toolbar>
        <Link href="/" passHref>
          <a aria-label="Go to homepage">
            <Image
              src="/vim-workshop.svg"
              alt="Vim workshop logo"
              width={50}
              height={50}
            />
          </a>
        </Link>
        <div>
          <Button
            title=":export to download the file"
            onClick={() => vimControl.current?.vim?.cmdline("export")}
          >
            Download
          </Button>
        </div>
      </Toolbar>

      <VimWindow title={title} active={vimRunning}>
        {files && (
          <Vim
            files={files}
            persistentDirs={DOT_VIM_DIRS}
            onFileExport={downloadFile}
            clipboard={true}
            readClipboard={() => navigator?.clipboard?.readText()}
            onWriteClipboard={text => navigator?.clipboard?.writeText(text)}
            onTitleUpdate={onTitleUpdate}
            onError={onError}
            onVimCreated={vControl => {
              vimControl.current = vControl
            }}
            onVimInit={() => setVimRunning(true)}
            onVimExit={() => setVimRunning(false)}
          />
        )}
      </VimWindow>
    </Layout>
  )
}

export default PlaygroundPage
