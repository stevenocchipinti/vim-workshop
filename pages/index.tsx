import Image from "next/image"
import Link from "next/link"
import styled from "styled-components"

import { Button } from "../components/Button"

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  margin: 2rem 1rem 0;
  line-height: 1.15;
  font-size: 4rem;
  text-align: center;
`

const SubTitle = styled.p`
  line-height: 1.5;
  font-size: 1.5rem;
`

const Actions = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 4rem;
`

const LinkButton = styled(Button).attrs({ as: "a" })`
  font-size: 1.5rem;
`

function Home() {
  return (
    <Container>
      <Main>
        <Image
          src="/vim-workshop.svg"
          alt="Vim workshop logo"
          width={300}
          height={300}
        />
        <Title>Vim Workshop</Title>
        <SubTitle>A place to work on your vim skills.</SubTitle>

        <Actions>
          <Link href="/playground" passHref>
            <LinkButton>Playground</LinkButton>
          </Link>
          <Link
            href="https://github.com/stevenocchipinti/vim-workshop"
            passHref
          >
            <LinkButton>Github</LinkButton>
          </Link>
          <Link href="/create-challenge" passHref>
            <LinkButton>Create a challenge</LinkButton>
          </Link>
          <Link
            href="/challenge?code=N4IgzgLghgThIC4QAkCmNUAJZbAewFtcALPOAYwFcIwFMAqTAQQBsJMBqTAUQDsJ0mALyYAypQBGBAJbtGrdl25hyUAA5YRAJVSRYc5m06YAKlAnDMAWTwA3LADM8VMNgDuUAJ6YHMQpgA1aQIQABoQVF4AE0QUdCwcTHwiJNIKaloAHV5MBkNFHn5BEXEpWWzc%2BSMlFXVNTB09OAq8hWMzCxEbex9nSlcoD29ffyCQ8N4oIliwkCjdchhpNQhpPF4Z8IdpFlQITw1NkGgYAHM92IBGAFYQAF8gA"
            passHref
          >
            <LinkButton>Try a challenge</LinkButton>
          </Link>
        </Actions>
      </Main>
    </Container>
  )
}

export default Home
