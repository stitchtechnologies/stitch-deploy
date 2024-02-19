import { EnvironmentVariable, Organization, Service } from "@prisma/client";
import { createContext } from "react";

export type OrganizationContextType = {
    organization: Organization & {
        services: (Service & {
            environmentVariables: EnvironmentVariable[]
        })[]
    }
}
export const OrganizationContext = createContext<OrganizationContextType>({} as any);
