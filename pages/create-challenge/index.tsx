import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import styled from "styled-components"
import { Button } from "../../components/Button"

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 2rem;
`

const Header = styled.header`
  padding: 1.5rem;
`

const Heading = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  margin: 0 auto 2rem auto;
`

const Main = styled.main`
  max-width: var(--max-width);
  display: grid;
  padding: 2rem;
  margin: 0 auto;
  grid-gap: 2rem;
  grid-template-columns: 1fr;
  grid-template-areas:
    "start"
    "end"
    "details";

  @media (min-width: 1100px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "start details"
      "end   details";
  }
`

const Details = styled.div`
  grid-area: details;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
`

const Input = styled.input`
  background-color: var(--window-color);
  border: var(--border);
  border-radius: 6px;
  padding: 1rem;
  color: inherit;
  font: inherit;
  transition: 0.2s box-shadow;

  :focus {
    box-shadow: inset 0 0 0 2px;
    outline: none;
  }
`

const Textarea = styled.textarea`
  resize: vertical;
  width: 100%;
  border: 0;
  color: inherit;
  background-color: var(--window-color);
  border: var(--border);
  border-radius: 6px;
  padding: 1rem;
  font-size: 1rem;
  transition: 0.2s box-shadow;

  :focus {
    box-shadow: inset 0 0 0 2px;
    outline: none;
  }
`

// May need to use this to base64 / URL encoded the start and end text:
// const encode = (str: string) => btoa(encodeURIComponent(str))
// const decode = (str: string) => decodeURIComponent(atob(str))

const Page = () => {
  const [start, setStartText] = useState("")
  const [end, setEndText] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [target, setTarget] = useState("")
  const [filetype, setFiletype] = useState("")

  const router = useRouter()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push({
      pathname: "/challenge",
      query: { start, end, name, description, filetype, target },
    })
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setName(params.get("name") || "")
    setDescription(params.get("description") || "")
    setStartText(params.get("start") || "")
    setEndText(params.get("end") || "")
    setTarget(params.get("target") || "")
    setFiletype(params.get("filetype") || "")
  }, [])

  return (
    <>
      <Header>
        <Link href="/" passHref>
          <a>
            <Image
              src="/vim-workshop.svg"
              alt="Vim workshop logo"
              width={50}
              height={50}
            />
          </a>
        </Link>
      </Header>

      <Heading>Create a challenge</Heading>

      <form onSubmit={onSubmit}>
        <Main>
          <Textarea
            css="grid-area: start"
            placeholder="Start text"
            rows={10}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setStartText(e.target.value)
            }
            name="start"
            value={start}
          />

          <Textarea
            css="grid-area: end"
            placeholder="End text"
            rows={10}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setEndText(e.target.value)
            }
            name="end"
            value={end}
          />

          <Details>
            <Stack>
              <Input
                placeholder="Name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                name="name"
                value={name}
              />
              <Textarea
                css="flex-grow: 1; font: inherit;"
                placeholder="Description"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
                name="description"
                value={description}
              />
              <Input
                placeholder="Target keystrokes"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTarget(e.target.value)
                }
                name="target"
                value={target || ""}
                type="number"
              />
              <Input
                placeholder="Filetype"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFiletype(e.target.value)
                }
                name="target"
                value={filetype || ""}
              />
            </Stack>
            <Button>Generate</Button>
          </Details>
        </Main>
      </form>
    </>
  )
}

export default Page
