import { OrganizationContext } from "@/app/[organization]/page";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

export default function LeftView() {
    const { organization } = useContext(OrganizationContext);

    return (
        <div className="flex flex-col flex-1 items-center justify-center h-screen overscroll-none overflow-hidden">
            <div className="flex gap-12 bg-white items-center m-auto">
                <Image src={organization.image} alt={organization.title} width={160} height={160} />
                <svg width="79" height="72" viewBox="0 0 79 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
                    <path d="M35.2574 64.2422C36.3826 65.3674 37.9087 65.9995 39.5 65.9995C41.0913 65.9995 42.6174 65.3674 43.7426 64.2422L62.3878 45.597C66.3475 41.7151 72.1667 35.4809 72.1667 26.6662C72.1667 21.185 69.9893 15.9284 66.1135 12.0526C62.2378 8.17689 56.9811 5.99951 51.5 5.99951C48.5522 5.99951 45.6943 6.42395 42.8441 7.66528C41.6705 8.17644 40.5628 8.7981 39.5 9.5193C38.4373 8.7981 37.3295 8.17644 36.1559 7.66528C33.3058 6.42395 30.4478 5.99951 27.5 5.99951C22.0189 5.99951 16.7622 8.17689 12.8865 12.0526C9.01072 15.9284 6.83334 21.185 6.83334 26.6662C6.83334 35.4912 12.5937 41.709 16.6261 45.6109L35.2574 64.2422Z" fill="#EF4444" stroke="#FEE2E2" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <Image src="/cloud.png" alt="cloud" width={160} height={160} />
            </div>
            <Link href="/">
                <footer className="text-sm text-slate-500 mb-4">
                    Powered by Stitch
                </footer>
            </Link>
        </div>
    )
}