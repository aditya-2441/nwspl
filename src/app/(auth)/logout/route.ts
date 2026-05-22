// src/app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Destroy all session cookies
    cookieStore.delete("nwspl_role");
    cookieStore.delete("nwspl_department");
    cookieStore.delete("nwspl_userId");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to clear cookies" }, { status: 500 });
  }
}