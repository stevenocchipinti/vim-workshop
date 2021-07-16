import Head from "next/head"
import type { AppProps } from "next/app"
import "../styles/globals.css"

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Vim workshop</title>
      <meta name="description" content="A place to work on your vim skills" />
      <link rel="icon" type="image/svg+xml" href="/vim-workshop.svg" />
    </Head>
    <Component {...pageProps} />
  </>
)

export default App
