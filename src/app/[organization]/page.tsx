"use client";
import Head from "next/head"
import LeftView from "@/components/onboarding/left-view";
import RightView from "@/components/onboarding/right-view";
import { useEffect } from "react";

export default function OrganizationOnboarding() {
    // TODO is there a better way to apply styles to the body?
    useEffect(() => {
        document.querySelector("body")!.classList.add("overflow-hidden");
    }, []);

    return (
        <div className="flex flex-row items-center h-screen overscroll-none overflow-hidden">
            <LeftView />
            <RightView />
        </div>
    )
}
