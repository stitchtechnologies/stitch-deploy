import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Stitch | Langfuse | Onboarding'
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
        </>
    )
}