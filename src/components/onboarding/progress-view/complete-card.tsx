import { Button } from "@/components/ui/button"
import { CardContent, Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export default function CompleteCard({ url }: { url: string }) {
    return (
        <div className="grid gap-6 max-w-3xl w-full mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Successfully deployed</CardTitle>
                    <CardDescription>View your application at the following URL:</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Link target="_blank" href={url}>
                        <Button variant={"ghost"} className="flex items-center gap-2">
                            {url}
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}