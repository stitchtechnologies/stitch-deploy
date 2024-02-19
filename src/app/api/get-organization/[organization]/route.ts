import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { organization: string } }) {
    const organization = await prisma.organization.findFirst({
        where: {
            slug: params.organization as string
        },
        include: {
            services: {
                include: {
                    environmentVariables: true
                }
            }
        }
    });

    if (!organization) {
        return NextResponse.json({ success: false, error: { message: "Organization not found" } })
    }

    return NextResponse.json({ success: true, data: organization });
}
