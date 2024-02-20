"use client";
import Footer from "@/components/onboarding/footer";
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VendorContext, VendorContextType } from "@/lib/vendor-context";
import { Loader2, LoaderIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import VendorEnvironmentVariablesForm from "@/components/onboarding/vendor-environment-variables";
import { Checkbox } from "@/components/ui/checkbox";
import ProgressView from "@/components/onboarding/progress-view/progress-view";
import InformationToolTip from "@/components/information-tooltip";

export type ServiceEnvironmentVariables = {
    [serviceName: string]: {
        [key: string]: string
    }
}

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

const StageZeroCard = ({ setStageCompleted }: { setStageCompleted: (value: boolean) => void }) => {
    const { vendor } = useContext(VendorContext);

    useEffect(() => {
        setStageCompleted(true)
    }, [setStageCompleted])

    return (
        <>
            <CardHeader>
                <CardTitle className="mb-2">Let&apos;s deploy {vendor.title} to your cloud!</CardTitle>
                <CardDescription className="text-slate-500">You are about to deploy the latest version of {vendor.title} to your private environment.</CardDescription>
            </CardHeader>
            <hr className="mb-6 mx-6 h-[1px] bg-[#E2E8F0] border-0" />
            <CardContent className="px-0">
                <div className="px-6">
                    <div className="mb-3 text-sm font-semibold">Select Platform</div>
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
                    </Tabs>
                </div>
                <hr className="my-6 mx-6 h-[1px] bg-[#E2E8F0] border-0" />
                <div className="px-6">
                    <h2 className="text-sm font-semibold flex gap-1 items-center mb-6">
                        <span>Services being deployed</span>
                        <InformationToolTip content={<>
                            <p>A list of services which will be deployed after completing this form.</p>
                            <br />
                            <p>Deploying additional services require additional confirmation from your side.</p>
                        </>} />
                    </h2>
                    <div>
                        {vendor.Service.map((service) => (<Link key={service.id} href={service.externalUrl} target="_blank" className="flex flex-col gap-2 border border-slate-300 p-3 rounded-md border-solid cursor-pointer hover:shadow">
                            <h3 className="text-slate-900 text-base font-semibold flex gap-1 items-center">
                                <Image src={service.image} alt={service.title} width={16} height={16} className="h-4 w-4" />
                                {service.title}
                            </h3>
                            <p className="text-slate-500 text-sm font-normal">
                                {service.description}
                            </p>
                        </Link>))}
                    </div>
                </div>
                <hr className="my-6 mx-6 h-[1px] bg-[#E2E8F0] border-0" />
                <div className="px-6">
                    <h2 className="text-sm font-semibold flex gap-1 items-center mb-6">
                        <span>Services to be provisioned</span>
                        <InformationToolTip content={<p>We will deploy the following services on your cloud.</p>} />
                    </h2>
                    {/* TODO these requirements should change based on your cloud provider */}
                    <div>
                        <div className="flex flex-col gap-2 border border-slate-300 p-3 rounded-md border-solid cursor-pointer hover:shadow">
                            <h3 className="text-slate-900 text-base font-semibold">EC2 t2.medium</h3>
                            <p className="text-slate-500 text-sm font-normal">This deployment is configured to utilise 2 vCPU, 4 GiB of memory and 1x8 GiB of storage.</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </>
    )
}

const StageOneCard = ({ servicesEnvironmentVariables, setServicesEnvironmentVariables, accessKey, setAccessKey, secret, setSecret, setStageCompleted }: { servicesEnvironmentVariables: ServiceEnvironmentVariables, setServicesEnvironmentVariables: Dispatch<SetStateAction<ServiceEnvironmentVariables>>, accessKey: string, setAccessKey: (value: string) => void, secret: string, setSecret: (value: string) => void, setStageCompleted: (value: boolean) => void }) => {
    const { vendor } = useContext(VendorContext);

    useEffect(() => {
        setStageCompleted(accessKey.length > 0 && secret.length > 0)
    }, [accessKey, secret, setStageCompleted])

    return (
        <>
            <CardHeader>
                <CardTitle className="mb-2">Let&apos;s start with your cloud credentials</CardTitle>
                <CardDescription className="text-slate-500">To deploy to AWS, we need an access key and secret with permissions. Link to guide.</CardDescription>
            </CardHeader>
            <hr className="mb-6 mx-6 h-[1px] bg-[#E2E8F0] border-0" />
            <CardContent className="px-0">
                <div className="flex flex-col gap-4 px-6">
                    <div>
                        <h2 className="text-sm font-semibold flex gap-1 items-center mb-3">
                            <span>AWS Key</span>
                            <InformationToolTip content={<p>The key will not be shared with {vendor.title} and is encrypted before its stored.</p>} />
                        </h2>
                        <Input type="text" name="access-key" placeholder="AKIAIOSFODNN7EXAMPLE" value={accessKey} onChange={(e) => setAccessKey(e.target.value)} />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold flex gap-1 items-center mb-3">
                            <span>AWS Secret</span>
                            <InformationToolTip content={<p>The secret will not be shared with {vendor.title} and is encrypted before its stored.</p>} />
                        </h2>
                        <Input type="password" name="secret" placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" value={secret} onChange={(e) => setSecret(e.target.value)} />
                    </div>
                </div>
                <hr className="my-6 mx-6 h-[1px] bg-[#E2E8F0] border-0" />
                <div className="px-6">
                    <VendorEnvironmentVariablesForm servicesEnvironmentVariables={servicesEnvironmentVariables} setServicesEnvironmentVariables={setServicesEnvironmentVariables} />
                </div>
            </CardContent>
        </>
    )
}

const StageTwoCard = ({ acceptedCheckbox, setAcceptedCheckbox, setStageCompleted }: { acceptedCheckbox: boolean, setAcceptedCheckbox: (value: boolean) => void, setStageCompleted: (value: boolean) => void }) => {
    const { vendor } = useContext(VendorContext);

    useEffect(() => {
        setStageCompleted(acceptedCheckbox)
    }, [acceptedCheckbox, setStageCompleted])

    return (
        <>
            <CardHeader>
                <CardTitle className="mb-2">Let&apos;s deploy {vendor.title} to your cloud!</CardTitle>
                <CardDescription className="text-slate-500">You are about to deploy the latest version of {vendor.title} to your private environment.</CardDescription>
            </CardHeader>
            <hr className="mb-6 mx-6 h-[1px] bg-[#E2E8F0] border-0" />
            <CardContent className="px-0">
                <div className="px-6">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" checked={acceptedCheckbox} onCheckedChange={(check) => setAcceptedCheckbox(check.valueOf() as boolean)} />
                        <label htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Deploying the services will start immediately after clicking the button below.
                        </label>
                    </div>
                </div>
            </CardContent>
        </>
    )
}

const StageThreeCard = ({ deploymentId }: { deploymentId: string }) => {
    return (
        <ProgressView id={deploymentId} />
    )
}

export default function VendorServiceOnboarding({ params }: { params: { vendorId: string, serviceId: string } }) {
    const router = useRouter();
    const searchParams = useSearchParams()
    const didParam = searchParams.get('did')

    const [loadingVendor, setLoadingVendor] = useState(true);
    const [stage, setStage] = useState(0);
    const [acceptedCheckbox, setAcceptedCheckbox] = useState(false);
    const [deploying, setDeploying] = useState(false);
    const [deploymentId, setDeploymentId] = useState("");
    const [accessKey, setAccessKey] = useState("");
    const [secret, setSecret] = useState("");
    const [stageCompleted, setStageCompleted] = useState(true);
    const [servicesEnvironmentVariables, setServicesEnvironmentVariables] = useState<ServiceEnvironmentVariables>({})
    const [vendorContext, setVendorContext] = useState<VendorContextType>({} as any);

    const { vendor } = vendorContext;

    useEffect(() => {
        if (didParam) {
            setDeploymentId(didParam)
            setStage(3)
        }
    }, [didParam])

    useEffect(() => {
        fetch(`/api/get-vendor/${params.vendorId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) {
                    router.push("/");
                    return;
                }
                const newOrgContext = { vendor: data.data } as VendorContextType
                setVendorContext(newOrgContext);
                newOrgContext.vendor.Service.reduce((acc, service) => {
                    const reducedServiceEnv = service.EnvironmentVariable.reduce((acc2, envVar) => {
                        acc2[envVar.key] = ""
                        return acc2
                    }, {} as { [key: string]: string })
                    acc[service.id] = reducedServiceEnv
                    return acc
                }, {} as ServiceEnvironmentVariables)
                setLoadingVendor(false);
            }).catch((error) => {
                console.log(error)
            });
    }, [params.vendorId, params.serviceId, router]);

    const handlePostDeploymentStart = (id: string) => {
        setDeploymentId(id);
        const service = vendor.Service[0]
        router.push(`/${vendor.slug}/${service.slug}?did=${id}`)
        setStage(3);
        setStageCompleted(false);
        setDeploying(false)
    }

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
                vendorId: vendor.id,
                serviceId: vendor.Service[0].id,
                accessKey,
                secret,
                servicesEnvironmentVariables,
            }),
        })
            .then((res) => res.json())
            .then((res) => handlePostDeploymentStart(res.id))
            .catch((err) => {
                console.error(err)
                window.alert("Failed to deploy services. Please try again or contact raj@stitch.tech for support.")
                setDeploying(false)
            })
    }

    if (loadingVendor) {
        return (
            <div className="flex h-screen justify-center items-center">
                <LoaderIcon className="animate-spin" />
            </div>
        )
    }

    return (
        <VendorContext.Provider value={vendorContext}>
            <div className="flex flex-col items-center gap-4 mt-12">
                <div className="flex gap-4 items-center text-4xl">
                    <Image src={vendor.image} alt={vendor.title} width={80} height={80} />
                    <h1>{vendor.title}</h1>
                </div>
                <div className="text-slate-500 my-2">Powered by <span className="text-black font-bold">Stitch</span></div>
                {
                    stage < 3 && (
                        <>
                            <Card className="shadow max-w-[600px] bg-white">
                                {stage === 0 && <StageZeroCard setStageCompleted={setStageCompleted} />}
                                {stage === 1 && <StageOneCard servicesEnvironmentVariables={servicesEnvironmentVariables} setServicesEnvironmentVariables={setServicesEnvironmentVariables} accessKey={accessKey} setAccessKey={setAccessKey} secret={secret} setSecret={setSecret} setStageCompleted={setStageCompleted} />}
                                {stage === 2 && <StageTwoCard acceptedCheckbox={acceptedCheckbox} setAcceptedCheckbox={setAcceptedCheckbox} setStageCompleted={setStageCompleted} />}
                                {
                                    stage < 3 && (
                                        <>
                                            <hr className="mb-6 mx-6 h-[1px] bg-[#E2E8F0] border-0" />
                                            <CardFooter className="flex gap-2">
                                                {
                                                    stage > 0 && (
                                                        <Button className="w-full" variant={"secondary"} onClick={() => setStage(prev => prev - 1)}>Previous</Button>
                                                    )
                                                }
                                                {
                                                    stage < 2 && (
                                                        <Button className="w-full" disabled={stage === 2 || !stageCompleted} onClick={() => setStage(prev => prev + 1)}>Continue</Button>
                                                    )
                                                }
                                                {
                                                    stage === 2 && (
                                                        <Button className="w-full" disabled={!acceptedCheckbox || deploying} onClick={handleSubmit}>{deploying ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Deploying services</> : "Deploy services"}</Button>
                                                    )
                                                }
                                            </CardFooter>
                                        </>
                                    )
                                }
                            </Card>
                            <div className="flex gap-4 mt-2 mb-12">
                                {
                                    [0, 1, 2].map((i) => (
                                        <div key={i} className={cn("w-1 h-1 rounded-full", { "bg-slate-600": stage > i, "bg-black": stage === i, "bg-slate-300": stage < i })}></div>
                                    ))
                                }
                            </div>
                        </>
                    )
                }
                <div className="max-w-[600px]">
                    {stage === 3 && <StageThreeCard deploymentId={deploymentId} />}
                </div>
                <Footer />
            </div>
        </VendorContext.Provider>
    )
}
