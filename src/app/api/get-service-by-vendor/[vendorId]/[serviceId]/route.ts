import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { vendorId: string, serviceId: string } }) {
    const vendor = await prisma.vendor.findFirst({
        where: {
            slug: params.vendorId as string
        },
        include: {
            Service: {
                where: {
                    slug: params.serviceId as string
                },
                include: {
                    EnvironmentVariable: true
                }
            }
        }
    });

    if (!vendor || vendor.Service.length === 0) {
        return NextResponse.json({ success: false, error: { message: "Vendor and service not found" } })
    }

    return NextResponse.json({ success: true, data: vendor });
}
