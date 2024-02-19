import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { ReactNode } from "react"

export default function InformationToolTip({ content }: { content: ReactNode }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Info className="h-4 w-4 text-slate-500" />
                </TooltipTrigger>
                <TooltipContent className="max-w-64 font-normal">
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}