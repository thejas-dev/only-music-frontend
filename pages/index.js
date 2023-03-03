import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/Navbar'
import TheraphyComponent from '../components/TheraphyComponent'

export default function index()  {



  return (
    <div className="min-h-screen w-full bg-[#edfaef]">
      <Head>
        <title>Only Music</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full ">
        <Navbar/>
        <TheraphyComponent/>
      </main>
    </div>
  )
}


