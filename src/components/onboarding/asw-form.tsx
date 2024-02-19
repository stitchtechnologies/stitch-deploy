"use client";
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useContext, useState } from "react"
import { Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import EnvironmentVariableItem from "./environment-variable-item"
import Link from "next/link";
import { EnvironmentVariable } from "@prisma/client";
import { OrganizationContext } from "@/app/[organization]/page";

export default function AWSForm({ onSubmitDeploy: handleSubmitDeploy }: { onSubmitDeploy: (id: string) => void }) {
    const { organization } = useContext(OrganizationContext);
    const [deploying, setDeploying] = useState(false);
    const [acceptedCheckbox, setAcceptedCheckbox] = useState(false);

    // TODO refactor this
    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (deploying) return;
        setDeploying(true)
        fetch(`//${process.env.NEXT_PUBLIC_SERVER_HOST}/api/deploy/start`, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                organizationId: organization.id,
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
                    {organization.services.map((service) => (<Link key={service.id} href={service.externalUrl} target="_blank" className="flex w-[330px] flex-col gap-2 border border-slate-300 p-3 rounded-md border-solid cursor-pointer hover:shadow">
                        <h3 className="text-slate-900 text-base font-semibold flex gap-1">
                            <Image src={service.image} alt={service.title} width={16} height={16} />
                            {service.title}
                        </h3>
                        <p className="text-slate-500 text-sm font-normal">
                            {service.description}
                        </p>
                    </Link>))}
                </div>
            </div>
            <hr className="w-full h-[1px] bg-[#E2E8F0] border-0" />
            {/* TODO get system requirements from BE */}
            {/* <div>
                <h2 className="text-sm">System requirements</h2>
                <div className="text-sm text-slate-400 mb-3">A list of services which will be deployed after completing this form. Deploying additional services require additional confirmation from your side.</div>
                <div className="gap-x-3 gap-y-3 grid grid-cols-2 xs:grid-cols-2">
                    <div className="flex w-[330px] flex-col gap-2 border border-slate-300 p-3 rounded-md border-solid cursor-pointer hover:shadow">
                        <h3 className="text-slate-900 text-base font-semibold">CPU</h3>
                        <p className="text-slate-500 text-sm font-normal">This deployment is configured to utilise 2 vCPU.</p>
                    </div>
                    <div className="flex w-[330px] flex-col gap-2 border border-slate-300 p-3 rounded-md border-solid cursor-pointer hover:shadow">
                        <h3 className="text-slate-900 text-base font-semibold">GPU</h3>
                        <p className="text-slate-500 text-sm font-normal">This deployment is not configured to include a GPU.</p>
                    </div>
                    <div className="flex w-[330px] flex-col gap-2 border border-slate-300 p-3 rounded-md border-solid cursor-pointer hover:shadow">
                        <h3 className="text-slate-900 text-base font-semibold">Memory</h3>
                        <p className="text-slate-500 text-sm font-normal">This deployment is configured to utilise 4 GiB.</p>
                    </div>
                    <div className="flex w-[330px] flex-col gap-2 border border-slate-300 p-3 rounded-md border-solid cursor-pointer hover:shadow">
                        <h3 className="text-slate-900 text-base font-semibold">Storage</h3>
                        <p className="text-slate-500 text-sm font-normal">This deployment is configured to utilise 1x8 GiB.</p>
                    </div>
                </div>
            </div>
            <hr className="w-full h-[1px] bg-[#E2E8F0] border-0" /> */}
            <div>
                <h2 className="text-sm">AWS key</h2>
                <div className="text-sm text-slate-400 mb-3">The key will not be shared with Langfuse and is encrypted before its stored.</div>
                <Input type="text" name="access-key" placeholder="AKIAIOSFODNN7EXAMPLE" disabled={deploying} />
            </div>
            <div>
                <h2 className="text-sm">AWS Secret</h2>
                <div className="text-sm text-slate-400 mb-3">The secret will not be shared with Langfuse and is encrypted before its stored.</div>
                <Input type="password" name="secret" placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" disabled={deploying} />
            </div>
            <hr className="w-full h-[1px] bg-[#E2E8F0] border-0" />
            <div>
                <h2 className="text-sm">Environment variables</h2>
                <div className="text-sm text-slate-400 mb-3">Variables below were defined by {organization.title}. All variables stay on your environment and are not reported back to {organization.title}.</div>
                {organization.services.map((service) => {
                    const envVars = service.environmentVariables;
                    if (envVars.length === 0) return (
                        <p key={service.id} className="text-slate-500 text-sm font-normal">No environment variables are required for the {service.title} service.</p>
                    )
                    return (
                        <div key={service.id} className="flex flex-col gap-2">
                            {
                                envVars.map((envVar: EnvironmentVariable) => <EnvironmentVariableItem key={envVar.key} envVar={envVar} disabled={deploying} />)
                            }
                        </div>
                    )
                })}
            </div>
            <hr className="w-full h-[1px] bg-[#E2E8F0] border-0" />
            <div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="terms" disabled={deploying} checked={acceptedCheckbox} onCheckedChange={(check) => setAcceptedCheckbox(check.valueOf() as boolean)} />
                    <label htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Deploying the services will start immediately after clicking the button below.
                    </label>
                </div>
            </div>
            <Button type={"submit"} disabled={!acceptedCheckbox || deploying}>{deploying ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Deploying services</> : "Deploy services"}</Button>
        </form >
    )
}