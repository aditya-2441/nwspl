// src/actions/auth.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function clearSession() {
  // 1. Destroy the security cookie
  const cookieStore = await cookies();
  cookieStore.delete("nwspl_role");
  
  // 2. Kick the user back to the login screen
  redirect("/login");
}