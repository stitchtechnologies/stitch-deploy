import { Dispatch, SetStateAction, useContext } from "react";
import { VendorContext } from "@/lib/vendor-context";
import { Service, EnvironmentVariable as PrismaEnvironmentVariable } from "@prisma/client";
import EnvironmentVariableItem from "./environment-variable-item";
import { ServiceEnvironmentVariables } from "@/app/[vendorId]/[serviceId]/page";
import InformationToolTip from "../information-tooltip";

type ServiceWithEnvironmentVariables = Service & { EnvironmentVariable: PrismaEnvironmentVariable[] }

function ServiceEnvironmentVariables({ disabled, service, setEnvironmentVariables, environmentVariables }: { disabled: boolean, service: ServiceWithEnvironmentVariables, environmentVariables: { [key: string]: string }, setEnvironmentVariables: (key: string, value: string) => void }) {
    const serviceEnvVars = service.EnvironmentVariable || [];

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

export default function VendorEnvironmentVariablesForm({ servicesEnvironmentVariables, setServicesEnvironmentVariables }: { servicesEnvironmentVariables: ServiceEnvironmentVariables, setServicesEnvironmentVariables: Dispatch<SetStateAction<ServiceEnvironmentVariables>> }) {
    const { vendor } = useContext(VendorContext);

    return (
        <div>
            <h2 className="text-sm font-semibold flex gap-1 items-center mb-3">
                <span>Environment variables</span>
                <InformationToolTip content={<p>Variables below were defined by {vendor.title}. All variables stay on your environment and are not reported back to {vendor.title}.</p>} />
            </h2>
            {vendor.Service.map((service) => {
                const serviceEnvVars = servicesEnvironmentVariables[service.id] || {};
                const handleSetEnvironmentVariables = (key: string, value: string) => {
                    setServicesEnvironmentVariables((prev) => {
                        const newServicesEnvironmentVariables = { ...prev }
                        // Don't add new keys to the environment variables. Backend should check for this anyways.
                        if (service.EnvironmentVariable.filter(ev => ev.key === key).length !== 1) {
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