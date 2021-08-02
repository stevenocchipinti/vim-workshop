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
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
`

const LinkButton = styled(Button).attrs({ as: "a" })`
  font-size: 1.5rem;
  margin: 3rem 1rem;
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
          <Link href="/create-challenge" passHref>
            <LinkButton>Create a challenge</LinkButton>
          </Link>
          <Link
            href="/challenge?start=Here+are+some+shortcuts%3A+*+Alt+%2B+Enter+%3D+Submit+*+Alt+%2B+Escape+%3D+Restart+*+Alt+%2B+Tab+%3D+Move+focus+away+from+Vim&end=Here+are+some+shortcuts%3A%0A++*+Alt+%2B+Enter+%3D+Submit%0A++*+Alt+%2B+Escape+%3D+Restart%0A++*+Alt+%2B+Tab+%3D+Move+focus+away+from+Vim&target=15"
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
