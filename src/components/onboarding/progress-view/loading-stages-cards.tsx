import { CheckCircleIcon, ClockIcon, ListChecks, Loader, Power, UploadCloud } from "lucide-react"
import { CardContent, Card } from "@/components/ui/card"
import IndeterminateProgressBar from "@/components/indeterminate-loading-bar";
import { STAGES, Stage } from "./progress-view";
import { ReactNode } from "react";
import Link from "next/link";

type LoadingStage = {
    title: string,
    status: Stage,
    description: ReactNode,
    icon: JSX.Element
}

export default function LoadingStagesCards({ status, showValidation, url }: { status: Stage, showValidation: boolean, url: string }) {
    const LOADING_STAGES: LoadingStage[] = [
        {
            title: "Deployed",
            status: "deployed",
            description: "Your cloud infra has been created.",
            icon: <UploadCloud className="w-6 h-6" />
        },
        {
            title: "Booting",
            status: "booting",
            description: "Waiting for your cloud instance to come online.",
            icon: <Power className="w-6 h-6" />
        },
        {
            title: "Installing",
            status: "booted",
            description: "Currently running the installation for your services. This may take a few minutes.",
            icon: <Loader className="w-6 h-6 animate-spin" />
        },
    ]

    if (showValidation) {
        LOADING_STAGES.push({
            title: "Validating",
            status: "validating",
            description: <div>
                <p>Your services have been installed and we are validating the installation.</p>
                <p>Once validated, the service will be available <Link href={url} className="hover:underline">here</Link>.</p>
            </div>,
            icon: <ListChecks className="w-6 h-6" />
        })
    }

    return (
        <div className="grid gap-6 max-w-3xl w-full mx-auto">
            {LOADING_STAGES.map((stage) => {
                return (
                    <Card key={stage.title} className="shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                {stage.icon}
                                <div className="grid gap-1">
                                    <div className="font-semibold">{stage.title}</div>
                                    <div className="text-sm text-gray-500">{stage.description}</div>
                                </div>
                            </div>
                            <div className="mt-6 ml-1 grid gap-2">
                                <div className="text-sm flex items-center gap-2">
                                    {
                                        STAGES.indexOf(status) < STAGES.indexOf(stage.status) && (
                                            <div className="text-gray-500 flex items-center gap-1">
                                                <ClockIcon className="w-4 h-4" />
                                                <span>Waiting</span>
                                            </div>
                                        )
                                    }
                                    {
                                        stage.status === status && (
                                            <div className="w-full">
                                                <div className="text-gray-500 flex items-center gap-1 mb-4">
                                                    <ClockIcon className="w-4 h-4" />
                                                    <span>In progress</span>
                                                </div>
                                                <IndeterminateProgressBar />
                                            </div>
                                        )
                                    }
                                    {
                                        STAGES.indexOf(status) > STAGES.indexOf(stage.status) && (
                                            <div className="text-emerald-500 flex items-center gap-1">
                                                <CheckCircleIcon className="w-4 h-4" />
                                                <span>Complete</span>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}