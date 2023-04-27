import '@/styles/globals.css'
import Layout from '../components/layout'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
      <Layout>
        <style global jsx>{`
          html,
          body,
          body > div:first-child,
          div#__next,
          div#__next > div {
            min-height: 100vh;
          }
        `}</style>
        <Component {...pageProps} />
      </Layout>
    )
}
