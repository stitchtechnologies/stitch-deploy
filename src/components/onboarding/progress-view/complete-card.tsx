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

export default function CompleteCard({ url }: { url: string }) {
    const { vendor } = useContext(VendorContext);

    const readMe = vendor.Service[0].readMe.replaceAll('{{HOSTNAME}}', url)

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
                    <EditerMarkdown className="p-2" wrapperElement={{ 'data-color-mode': "light" }} data-color-mode={"light"} source={readMe} />
                </CardContent>
            </Card>
        </div>
    )
}