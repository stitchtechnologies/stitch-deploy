import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { vendorId: string } }) {
    const vendor = await prisma.vendor.findFirst({
        where: {
            slug: params.vendorId as string
        },
        include: {
            Service: {
                include: {
                    EnvironmentVariable: true
                }
            }
        }
    });

    if (!vendor) {
        return NextResponse.json({ success: false, error: { message: "Vendor not found" } })
    }

    return NextResponse.json({ success: true, data: vendor });
}
