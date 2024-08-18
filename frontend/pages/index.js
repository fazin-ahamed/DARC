import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Home Page of the DARC Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to the School Project By Fazin</h1>
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
      </main>
    </div>
  )
}
