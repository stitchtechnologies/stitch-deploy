"use client";
import LeftView from "@/components/onboarding/left-view";
import RightView from "@/components/onboarding/right-view";
import { EnvironmentVariable, Organization, Service } from "@prisma/client";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

type OrganizationContextType = {
    organization: Organization & {
        services: (Service & {
            environmentVariables: EnvironmentVariable[]
        })[]
    }
}
export const OrganizationContext = createContext<OrganizationContextType>({} as any);

export default function OrganizationOnboarding({ params }: { params: { organization: string } }) {
    const router = useRouter();
    const [loadingOrganization, setLoadingOrganization] = useState(true);
    const [organization, setOrganization] = useState<OrganizationContextType>({} as any);

    useEffect(() => {
        // TODO is there a better way to apply styles to the body?
        document.querySelector("body")!.classList.add("overflow-hidden");

        fetch(`/api/get-organization/${params.organization}`, {
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
                setOrganization({ organization: data.data });
                setLoadingOrganization(false);
            }).catch((error) => {
                console.log(error)
            });
    }, []);

    if (loadingOrganization) {
        return (
            <div className="flex h-screen justify-center items-center">
                <LoaderIcon className="animate-spin" />
            </div>
        )
    }

    return (
        <OrganizationContext.Provider value={organization}>
            <div className="flex flex-row items-center h-screen overscroll-none overflow-hidden">
                <LeftView />
                <RightView />
            </div>
        </OrganizationContext.Provider>
    )
}
