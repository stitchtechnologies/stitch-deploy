"use client";
import Footer from "@/components/onboarding/footer";
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VendorContext, VendorContextType } from "@/lib/vendor-context";
import { InfoIcon, Loader2, LoaderIcon } from "lucide-react";
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
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import posthog from "posthog-js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Service } from "@prisma/client";
import { Label } from "@/components/ui/label";

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
                                {service.image && <Image src={service.image} alt={service.title} width={16} height={16} className="h-4 w-4" />}
                                {service.title}
                            </h3>
                            <p className="text-slate-500 text-sm font-normal">
                                {service.description || <i>No description</i>}
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

const StageOneCard = ({
    servicesEnvironmentVariables,
    setServicesEnvironmentVariables,
    accessKey,
    setAccessKey,
    secret,
    setSecret,
    setStageCompleted,
    accountNumber,
    setAccountNumber,
    awsRegion,
    setAwsRegion,
    service,
}:
    {
        servicesEnvironmentVariables: ServiceEnvironmentVariables,
        setServicesEnvironmentVariables: Dispatch<SetStateAction<ServiceEnvironmentVariables>>,
        accessKey: string,
        setAccessKey: (value: string) => void,
        secret: string,
        setSecret: (value: string) => void,
        setStageCompleted: (value: boolean) => void,
        accountNumber: string,
        setAccountNumber: (value: string) => void,
        awsRegion: string,
        setAwsRegion: (value: string) => void,
        service: Service
    }) => {
    const { vendor } = useContext(VendorContext);
    const [helpDialogOpen, setHelpDialogOpen] = useState(false)
    useEffect(() => {
        setStageCompleted(accessKey.length > 0 && secret.length > 0)
    }, [accessKey, secret, setStageCompleted])

    return (
        <>
            <CardHeader>
                <CardTitle className="mb-2">Let&apos;s start with your cloud credentials</CardTitle>
                <CardDescription className="text-slate-500">To deploy to AWS, we need an access key and secret with permissions.</CardDescription>
            </CardHeader>
            <div className="px-6 mb-5">
                <Alert onClick={() => setHelpDialogOpen(true)} className="shadow cursor-pointer">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Click to view AWS Credentials guide</AlertTitle>
                    <AlertDescription>
                        Follow this guide to create AWS credentials.
                    </AlertDescription>
                </Alert>
            </div>
            <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen} >
                <DialogContent className="min-w-[70vh]">
                    <DialogHeader>
                        <DialogTitle>Creating AWS Credentials</DialogTitle>
                        <DialogDescription>
                            After following the steps below you can then deploy to your own VPC.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[80vh]">
                        <ol className="grid grid-cols-1 gap-y-4 gap-x-8 list-decimal pl-4 sm:pl-8">
                            <li>
                                <div className="flex flex-col gap-2">
                                    <span>Navigate to the <a className="inline underline text-blue-600 hover:text-blue-800 visited:text-purple-600" target="_blank" href="https://us-east-1.console.aws.amazon.com/iam/home#/users">AWS IAM users page.</a></span>
                                </div>
                            </li>
                            <li>
                                <div className="flex flex-col gap-2">
                                    <span>Create a new user named <span className="font-mono">stitch-deploy</span>.</span>
                                    <Image className="shadow w-full" src={"/aws_guide/create_user.png"} alt={"create user"} width={550} height={300} />
                                </div>
                            </li>
                            <li>
                                <div className="flex flex-col gap-2">
                                    <span>Add the <span className="font-mono">AmazonEC2FullAccess</span> to the user&apos;s permission policies.</span>
                                    <Image className="shadow w-full" src={"/aws_guide/add_policy.png"} alt={"add policy"} width={550} height={300} />
                                </div>
                            </li>
                            <li>
                                <div className="flex flex-col gap-2">
                                    <span>In the &quot;Security credentials&quot; tab, scroll down to the &quot;Access keys&quot; section and click on the &quot;Create access
                                        key&quot; button.</span>
                                    <Image className="shadow w-full" src={"/aws_guide/create_access_key.png"} alt={"create access key"} width={550} height={300} />
                                </div>
                            </li>
                            <li>
                                <div className="flex flex-col gap-2">
                                    <span>Select &quot;Third-party service&quot; and check the checkbox at the bottom of the page.</span>
                                    <Image className="shadow w-full" src={"/aws_guide/create_access_key_2.png"} alt={"create access key 2"} width={550} height={300} />
                                </div>
                            </li>
                            <li>
                                <div className="flex flex-col gap-2">
                                    <span>A dialog box will appear with your new access key and secret access key. Make sure to save this information
                                        as it will not be shown again.</span>
                                    <Image className="shadow w-full" src={"/aws_guide/store_access_key.png"} alt={"store access key"} width={550} height={300} />
                                </div>
                            </li>
                        </ol>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
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
                    {(service.scriptV2 as any)?.type === "cdk-ts-github" && <>
                        <div>
                            <h2 className="text-sm font-semibold flex gap-1 items-center mb-3">
                                <span>AWS Account ID</span>
                            </h2>
                            <Input type="text" name="account-number" placeholder="123412341234" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold flex gap-1 items-center mb-3">
                                <span>AWS region</span>
                            </h2>
                            <Select value={awsRegion} onValueChange={setAwsRegion}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="AWS Region" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="us-east-1">us-east-1 | US East (N. Virginia)</SelectItem>
                                    <SelectItem value="us-east-2">us-east-2 | US East (Ohio)</SelectItem>
                                    <SelectItem value="us-west-1">us-west-1 | US West (N. California)</SelectItem>
                                    <SelectItem value="us-west-2">us-west-2 | US West (Oregon)</SelectItem>
                                    <SelectItem value="af-south-1">af-south-1 | Africa (Cape Town)</SelectItem>
                                    <SelectItem value="ap-east-1">ap-east-1 | Asia Pacific (Hong Kong)</SelectItem>
                                    <SelectItem value="ap-south-1">ap-south-1 | Asia Pacific (Mumbai)</SelectItem>
                                    <SelectItem value="ap-northeast-3">ap-northeast-3 | Asia Pacific (Osaka)</SelectItem>
                                    <SelectItem value="ap-northeast-2">ap-northeast-2 | Asia Pacific (Seoul)</SelectItem>
                                    <SelectItem value="ap-southeast-1">ap-southeast-1 | Asia Pacific (Singapore)</SelectItem>
                                    <SelectItem value="ap-southeast-2">ap-southeast-2 | Asia Pacific (Sydney)</SelectItem>
                                    <SelectItem value="ap-northeast-1">ap-northeast-1 | Asia Pacific (Tokyo)</SelectItem>
                                    <SelectItem value="ca-central-1">ca-central-1 | Canada (Central)</SelectItem>
                                    <SelectItem value="eu-central-1">eu-central-1 | Europe (Frankfurt)</SelectItem>
                                    <SelectItem value="eu-west-1">eu-west-1 | Europe (Ireland)</SelectItem>
                                    <SelectItem value="eu-west-2">eu-west-2 | Europe (London)</SelectItem>
                                    <SelectItem value="eu-south-1">eu-south-1 | Europe (Milan)</SelectItem>
                                    <SelectItem value="eu-west-3">eu-west-3 | Europe (Paris)</SelectItem>
                                    <SelectItem value="eu-north-1">eu-north-1 | Europe (Stockholm)</SelectItem>
                                    <SelectItem value="me-south-1">me-south-1 | Middle East (Bahrain)</SelectItem>
                                    <SelectItem value="sa-east-1">sa-east-1 | South America (São Paulo)</SelectItem>
                                </SelectContent>
                            </Select>

                        </div>
                    </>}

                </div>
                <hr className="my-6 mx-6 h-[1px] bg-[#E2E8F0] border-0" />
                <div className="px-6">
                    <VendorEnvironmentVariablesForm servicesEnvironmentVariables={servicesEnvironmentVariables} setServicesEnvironmentVariables={setServicesEnvironmentVariables} />
                </div>
            </CardContent>
        </>
    )
}

const StageTwoCard = ({ acceptedCheckbox, setAcceptedCheckbox, setStageCompleted, email, setEmail }: { acceptedCheckbox: boolean, setAcceptedCheckbox: (value: boolean) => void, setStageCompleted: (value: boolean) => void, email: string, setEmail: (value: string) => void }) => {
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
                <hr className="my-6 mx-6 h-[1px] bg-[#E2E8F0] border-0" />
                <div className="px-6">
                    <Label htmlFor="email" className="flex gap-2 items-center mb-2">
                        <span>Email<span className="text-slate-400 italic">- optional</span></span>
                        <InformationToolTip content={<>
                            <p>Once your deployment is completed, a email notifying you will be sent to this email.</p>
                        </>} /></Label>
                    <Input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
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

    const [accountNumber, setAccountNumber] = useState<string>("");
    const [awsRegion, setAwsRegion] = useState<string>("us-east-1");
    const [service, setService] = useState<Service>();

    const [email, setEmail] = useState("");

    const { vendor } = vendorContext;

    useEffect(() => {
        if (didParam) {
            setDeploymentId(didParam)
            setStage(3)
        }
    }, [didParam])

    useEffect(() => {
        fetch(`/api/get-service-by-vendor/${params.vendorId}/${params.serviceId}`, {
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
                setService(data.data.Service[0])
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
        posthog.capture("deploy_started", {
            vendor: vendor.title,
            service: vendor.Service[0].title,
        })
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
                accountNumber,
                awsRegion,
                email,
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
                    {vendor.image !== "" && <Image className="rounded-xl" src={vendor.image} alt={vendor.title} width={80} height={80} />}
                    <h1>{vendor.title}</h1>
                </div>
                <div className="text-slate-500 my-2">Powered by <span className="text-black font-bold">Stitch</span></div>
                {
                    stage < 3 && (
                        <>
                            <Card className="shadow max-w-[600px] bg-white">
                                {stage === 0 && <StageZeroCard setStageCompleted={setStageCompleted} />}
                                {stage === 1 && <StageOneCard
                                    servicesEnvironmentVariables={servicesEnvironmentVariables}
                                    setServicesEnvironmentVariables={setServicesEnvironmentVariables}
                                    accessKey={accessKey}
                                    setAccessKey={setAccessKey}
                                    secret={secret}
                                    setSecret={setSecret}
                                    setStageCompleted={setStageCompleted}
                                    accountNumber={accountNumber}
                                    setAccountNumber={setAccountNumber}
                                    awsRegion={awsRegion}
                                    setAwsRegion={setAwsRegion}
                                    service={service!}
                                />
                                }
                                {stage === 2 && <StageTwoCard acceptedCheckbox={acceptedCheckbox} setAcceptedCheckbox={setAcceptedCheckbox} setStageCompleted={setStageCompleted} email={email} setEmail={setEmail} />}
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
                                                        <Button className="w-full" disabled={stage === 2 || !stageCompleted} onClick={() => setStage(prev => {
                                                            posthog.capture("next_stage_click", {
                                                                prevStage: prev,
                                                                newStage: prev + 1,
                                                            })
                                                            return prev + 1
                                                        })}>
                                                            Continue
                                                        </Button>
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
