import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import styled from "styled-components"
import Button from "../../components/Button"

const Stack = styled.div`
  display: flex;
  flex-direction: column;
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
`

const Textarea = styled.textarea`
  resize: vertical;
  height: 15rem;
  width: 100%;
  border: 0;
  color: inherit;
  background-color: var(--window-color);
  border: var(--border);
  border-radius: 6px;
  padding: 1rem;
  font-size: 1rem;
`

// May need to use this to base64 / URL encoded the start and end text:
// const encode = (str: string) => btoa(encodeURIComponent(str))
// const decode = (str: string) => decodeURIComponent(atob(str))

const Page = () => {
  const [start, setStartText] = useState("")
  const [end, setEndText] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [target, setTarget] = useState(0)

  const router = useRouter()
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push({
      pathname: "/challenge",
      query: { start, end, name, description, target },
    })
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setName(params.get("name") || "")
    setDescription(params.get("description") || "")
    setStartText(params.get("start") || "")
    setEndText(params.get("end") || "")
    setTarget(parseInt(params.get("target") || "0"))
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
                css="font: inherit;"
                placeholder="Description"
                rows={10}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
                name="description"
                value={description}
              />
              <Input
                placeholder="Target keystrokes"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTarget(parseInt(e.target.value))
                }
                name="target"
                value={target}
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
