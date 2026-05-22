// src/app/api/auth/check-status/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("nwspl_userId")?.value;

    // If they have no cookie, they shouldn't be here anyway
    if (!userId) {
      return NextResponse.json({ isActive: false }, { status: 200 });
    }

    // Ask the database for just this one boolean
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true }
    });

    // Return the status (default to false if user is somehow deleted)
    return NextResponse.json({ isActive: user?.isActive ?? false }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 });
  }
}