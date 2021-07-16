import Image from "next/image"
import Link from "next/link"
import styled from "styled-components"

import Button from "../components/Button"

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
  line-height: 1.15;
  font-size: 4rem;
`

const SubTitle = styled.p`
  line-height: 1.5;
  font-size: 1.5rem;
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

        <Link href="/challenge?start=demo&end=fun&target=5" passHref>
          <LinkButton>Challenge</LinkButton>
        </Link>
      </Main>
    </Container>
  )
}

export default Home
