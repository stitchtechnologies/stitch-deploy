import { Dispatch, SetStateAction, useContext } from "react";
import { OrganizationContext } from "@/lib/organization-context";
import { Service, EnvironmentVariable as PrismaEnvironmentVariable } from "@prisma/client";
import EnvironmentVariableItem from "./environment-variable-item";
import { ServiceEnvironmentVariables } from "@/app/[organization]/page";
import InformationToolTip from "../information-tooltip";

type ServiceWithEnvironmentVariables = Service & { environmentVariables: PrismaEnvironmentVariable[] }

function ServiceEnvironmentVariables({ disabled, service, setEnvironmentVariables, environmentVariables }: { disabled: boolean, service: ServiceWithEnvironmentVariables, environmentVariables: { [key: string]: string }, setEnvironmentVariables: (key: string, value: string) => void }) {
    const serviceEnvVars = service.environmentVariables;

    if (serviceEnvVars.length === 0) {
        return (
            <p key={service.id} className="text-slate-500 text-sm font-normal">No environment variables are required for the {service.title} service.</p>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            {
                serviceEnvVars.map((envVar) => <EnvironmentVariableItem key={envVar.key} environmentVariableKey={envVar.key} value={environmentVariables[envVar.key]} defaultValue={envVar.value} setEnvVarValue={(value: string) => setEnvironmentVariables(envVar.key, value)} disabled={disabled} />)
            }
        </div>
    )
}

export default function OrganizationEnvironmentVariables({ servicesEnvironmentVariables, setServicesEnvironmentVariables }: { servicesEnvironmentVariables: ServiceEnvironmentVariables, setServicesEnvironmentVariables: Dispatch<SetStateAction<ServiceEnvironmentVariables>> }) {
    const { organization } = useContext(OrganizationContext);

    return (
        <div>
            <h2 className="text-sm font-semibold flex gap-1 items-center mb-3">
                <span>Environment variables</span>
                <InformationToolTip content={<p>Variables below were defined by {organization.title}. All variables stay on your environment and are not reported back to {organization.title}.</p>} />
            </h2>
            {organization.services.map((service) => {
                const serviceEnvVars = servicesEnvironmentVariables[service.id] || {};
                const handleSetEnvironmentVariables = (key: string, value: string) => {
                    setServicesEnvironmentVariables((prev) => {
                        const newServicesEnvironmentVariables = { ...prev }
                        // Don't add new keys to the environment variables. Backend should check for this anyways.
                        if (!(key in newServicesEnvironmentVariables[service.id])) {
                            return prev;
                        }
                        newServicesEnvironmentVariables[service.id] = { ...newServicesEnvironmentVariables[service.id], [key]: value }
                        return newServicesEnvironmentVariables
                    })
                }
                return <ServiceEnvironmentVariables key={service.id} disabled={false} service={service} environmentVariables={serviceEnvVars} setEnvironmentVariables={handleSetEnvironmentVariables} />
            })}
        </div>
    )
}