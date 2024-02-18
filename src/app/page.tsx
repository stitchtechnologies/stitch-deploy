import Head from "next/head"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-row items-center justify-center h-screen overscroll-none overflow-hidden">
      <Head>
        <title>Stitch Deploy</title>
      </Head>
      <div className="flex gap-2">
        <Image src="/favicon-dark.svg" alt="Stitch Deploy" width={32} height={32} />
        <span className="text-4xl font-bold">Stitch</span>
      </div>
    </div>
  )
}
