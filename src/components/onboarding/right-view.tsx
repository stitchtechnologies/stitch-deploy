"use client";
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useContext, useState } from "react"
import ProgressView from "@/components/onboarding/progress-view/progress-view"
import AWSForm from "@/components/onboarding/asw-form"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Footer from "./footer";
import { OrganizationContext } from "@/lib/organization-context";

const PLATFORMS_COMING_SOON = [
    {
        id: "azure",
        displayName: "Azure",
        image: "/azure.png"
    },
    {
        id: "gcp",
        displayName: "GCP",
        image: "/gcp.png"
    },
    {
        id: "custom",
        displayName: "Custom",
        image: "/custom.png"
    }
]

export default function RightView() {
    const { organization } = useContext(OrganizationContext);
    const [showProgess, setShowProgress] = useState(false);
    const [id, setId] = useState("");

    return (
        <div className="flex flex-col flex-1 bg-[#00000005] h-screen px-6 pt-12 overflow-y-auto overscroll-none">
            <div>
                <h1 className="text-3xl font-medium mb-12">Deploy {organization.title} to your Cloud</h1>
                {!showProgess && (
                    <>
                        <div className="mb-3 text-sm">Select Platform</div>
                        <Tabs defaultValue="aws" className="w-full">
                            <TabsList className="w-full justify-between">
                                <TabsTrigger value="aws" className="w-full flex gap-2"><Image src={"/aws.png"} alt={"aws"} width={14} height={14} />AWS</TabsTrigger>
                                {/* TODO: clean up */}
                                {PLATFORMS_COMING_SOON.map((platform) => (
                                    <TooltipProvider key={platform.id} delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger asChild className="w-full flex gap-2">
                                                <span tabIndex={0}>
                                                    <TabsTrigger value={platform.id} className="w-full flex gap-2" disabled>
                                                        <Image src={platform.image} alt={platform.displayName} width={14} height={14} />
                                                        {platform.displayName}
                                                    </TabsTrigger>
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Coming soon</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </TabsList>
                            <hr className="w-full my-6 h-[1px] bg-[#E2E8F0] border-0" />
                            <TabsContent value="aws">
                                <AWSForm onSubmitDeploy={(id) => {
                                    setId(id);
                                    setShowProgress(true);
                                }} />
                            </TabsContent>
                            {/* TODO: other tabs */}
                        </Tabs>
                    </>
                )}
                {showProgess && <ProgressView id={id} />}
            </div>
            <Footer />
        </div>
    )
}