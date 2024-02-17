"use client";
import Head from "next/head"
import LeftView from "@/components/onboarding/left-view";
import RightView from "@/components/onboarding/right-view";

export default function OrganizationOnboarding() {
  return (
    <div className="flex flex-row items-center h-screen overscroll-none overflow-hidden">
      <Head>
        <title>Product x Acme | Onboarding</title>
      </Head>
      <LeftView />
      <RightView />
    </div>
  )
}
