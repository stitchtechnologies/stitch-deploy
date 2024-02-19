import { Button } from "@/components/ui/button"
import { CardContent, Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { OrganizationContext } from "@/lib/organization-context";
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { useContext } from "react";
import Markdown from 'react-markdown'

export default function CompleteCard({ url }: { url: string }) {
    const { organization } = useContext(OrganizationContext);

    const readMe = organization.services[0].readMe.replaceAll('{{HOSTNAME}}', url)

    return (
        <div className="grid gap-6 max-w-3xl w-full mx-auto shadow">
            <Card>
                <CardHeader>
                    <CardTitle>Successfully deployed!</CardTitle>
                    <CardDescription>View your application at the following URL:</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                    <Link target="_blank" href={url}>
                        <Button variant={"ghost"} className="flex items-center gap-2">
                            {url}
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </Link>
                    {/* <Markdown className={"markdown self-start"}>{readMe}</Markdown> */}
                </CardContent>
            </Card>
        </div>
    )
}