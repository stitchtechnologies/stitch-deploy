import Footer from "@/components/onboarding/footer"
import Image from "next/image"

export default function Home() {
  return (
    <div>
      <div className="flex flex-row items-center justify-center h-[95vh] overscroll-none overflow-hidden">
        <div className="flex gap-2">
          <Image src="/favicon-dark.svg" alt="Stitch Deploy" width={32} height={32} />
          <span className="text-4xl font-bold">Stitch</span>
        </div>
      </div>
      <Footer />
    </div>
  )
}
