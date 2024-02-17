import { BadgeCheckIcon, CheckCircleIcon, ClockIcon, CodeIcon, DownloadCloud } from "lucide-react"
import { CardContent, Card } from "@/components/ui/card"
import { STAGES, Stages } from "./progress-view";
import IndeterminateProgressBar from "@/components/indeterminate-loading-bar";

export default function LoadingStagesCards({ status }: { status: keyof typeof Stages }) {
    const LOADING_STAGES = [
        {
            title: "Pulling repository",
            status: Stages.STARTING,
            description: "Loading the container image",
            icon: <DownloadCloud className="w-6 h-6" />
        },
        {
            title: "Deploying application code",
            status: Stages.STARTED,
            description: "Publishing your application",
            icon: <CodeIcon className="w-6 h-6" />
        },
        {
            title: "Verifying install",
            status: Stages.DEPLOYED,
            description: "Waiting for the server to come online",
            icon: <BadgeCheckIcon className="w-6 h-6" />
        }
    ]

    return (
        <div className="grid gap-6 max-w-3xl w-full mx-auto">
            {LOADING_STAGES.map((stage) => {
                return (
                    <Card key={stage.title}>
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