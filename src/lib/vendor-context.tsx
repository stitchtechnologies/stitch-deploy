import { EnvironmentVariable, Vendor, Service } from "@prisma/client";
import { createContext } from "react";

export type VendorContextType = {
    vendor: Vendor & {
        Service: (Service & {
            EnvironmentVariable: EnvironmentVariable[]
        })[]
    }
}
export const VendorContext = createContext<VendorContextType>({} as any);
