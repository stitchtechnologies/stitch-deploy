import { Button } from "@/components/ui/button"
import { CardContent, Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { VendorContext } from "@/lib/vendor-context";
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { useContext } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const EditerMarkdown = dynamic(
    () =>
        import("@uiw/react-md-editor").then((mod) => {
            return mod.default.Markdown;
        }),
    { ssr: false }
);

export default function CompleteCard({ url, publicDns }: { url: string, publicDns: string }) {
    const { vendor } = useContext(VendorContext);

    const readMe = vendor.Service[0].readMe.replaceAll('{{PUBLIC_DNS}}', publicDns).replaceAll('{{HOSTNAME}}', url)

    return (
        <Card className="mx-auto shadow">
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
                {readMe.length > 0 && (
                    <EditerMarkdown className="p-6 max-w-[600px]" wrapperElement={{ 'data-color-mode': "light" }} data-color-mode={"light"} source={readMe} />
                )}
            </CardContent>
        </Card>
    )
}