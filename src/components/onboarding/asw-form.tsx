"use client";
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import EnvironmentVariableItem, { EnvironmentVariable } from "./environment-variable-item"

// TODO these should be coming from the backend
const ENVIRONMENT_VARIABLES = [
    {
        key: "DATABASE_URL",
        value: "postgres://"
    },
    {
        key: "SECRET_KEY",
        value: "supersecret"
    }
]

export default function AWSForm({ onSubmitDeploy: handleSubmitDeploy }: { onSubmitDeploy: (id: string) => void }) {
    const [deploying, setDeploying] = useState(false);

    // TODO refactor this
    const handleSubmit = (e: any) => {
        e.preventDefault()
        console.log("Deploying", JSON.stringify({
            accessKey: e.target["access-key"].value,
            secret: e.target["secret"].value,
        }))
        setDeploying(true)
        fetch("http://localhost:3001/start", {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                accessKey: e.target["access-key"].value,
                secret: e.target["secret"].value,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                handleSubmitDeploy(res.id);
            })
            .then(() => setDeploying(false))
            .catch((err) => {
                console.error(err)
                window.alert(err)
                setDeploying(false)
            })
    }

    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
                <h2 className="text-sm">Services being deployed</h2>
                <div className="text-sm text-slate-400 mb-3">A list of services which will be deployed after completing this form. Deploying additional services require additional confirmation from your side.</div>
                <div className="gap-x-3 gap-y-3 grid grid-cols-2 xs:grid-cols-2">
                    <div className="flex w-[330px] flex-col gap-2 border border-slate-300 p-3 rounded-md border-solid cursor-pointer hover:shadow">
                        <h3 className="text-slate-900 text-base font-semibold flex gap-1">
                            <Image src={"/product.png"} alt={"product"} width={16} height={16} />
                            Product
                        </h3>
                        <p className="text-slate-500 text-sm font-normal">
                            Open source tool for analytics, secrets management, deployment, testing, monitoring, logging, infra, GitOps.
                        </p>
                    </div>
                </div>
            </div>
            <hr className="w-full h-[1px] bg-[#E2E8F0] border-0" />
            <div>
                <h2 className="text-sm">System requirements</h2>
                <div className="text-sm text-slate-400 mb-3">A list of services which will be deployed after completing this form. Deploying additional services require additional confirmation from your side.</div>
                <div className="gap-x-3 gap-y-3 grid grid-cols-2 xs:grid-cols-2">
                    <div className="flex w-[330px] flex-col gap-2 border border-slate-300 p-3 rounded-md border-solid cursor-pointer hover:shadow">
                        <h3 className="text-slate-900 text-base font-semibold">CPU</h3>
                        <p className="text-slate-500 text-sm font-normal">This deployment is configured to utilise 1 vCPU.</p>
                    </div>
                    <div className="flex w-[330px] flex-col gap-2 border border-slate-300 p-3 rounded-md border-solid cursor-pointer hover:shadow">
                        <h3 className="text-slate-900 text-base font-semibold">GPU</h3>
                        <p className="text-slate-500 text-sm font-normal">This deployment is not configured to include a GPU.</p>
                    </div>
                    <div className="flex w-[330px] flex-col gap-2 border border-slate-300 p-3 rounded-md border-solid cursor-pointer hover:shadow">
                        <h3 className="text-slate-900 text-base font-semibold">Memory</h3>
                        <p className="text-slate-500 text-sm font-normal">This deployment is configured to utilise 2 GiB.</p>
                    </div>
                    <div className="flex w-[330px] flex-col gap-2 border border-slate-300 p-3 rounded-md border-solid cursor-pointer hover:shadow">
                        <h3 className="text-slate-900 text-base font-semibold">Storage</h3>
                        <p className="text-slate-500 text-sm font-normal">This deployment is configured to utilise 1x8 GiB.</p>
                    </div>
                </div>
            </div>
            <hr className="w-full h-[1px] bg-[#E2E8F0] border-0" />
            <div>
                <h2 className="text-sm">AWS key</h2>
                <div className="text-sm text-slate-400 mb-3">The key will not be shared with Product and is encrypted before its stored.</div>
                <Input type="text" name="access-key" placeholder="AKIAIOSFODNN7EXAMPLE" />
            </div>
            <div>
                <h2 className="text-sm">AWS Secret</h2>
                <div className="text-sm text-slate-400 mb-3">The secret will not be shared with Product and is encrypted before its stored.</div>
                <Input type="password" name="secret" placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" />
            </div>
            <hr className="w-full h-[1px] bg-[#E2E8F0] border-0" />
            <div>
                <h2 className="text-sm">Environment variables</h2>
                <div className="text-sm text-slate-400 mb-3">Variables below were defined by Product. All variables stay on your environment and are not reported back to Product.</div>
                <div className="flex flex-col gap-2">
                    {
                        ENVIRONMENT_VARIABLES.map((envVar: EnvironmentVariable) => <EnvironmentVariableItem key={envVar.key} envVar={envVar} />)
                    }
                </div>
            </div>
            <hr className="w-full h-[1px] bg-[#E2E8F0] border-0" />
            <div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Deploying the services will start immediately after clicking the button below.
                    </label>
                </div>
            </div>
            <Button type={"submit"} disabled={deploying}>{deploying ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Deploying services</> : "Deploy services"}</Button>
        </form >
    )
}