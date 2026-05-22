// src/app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export default async function RootPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("nwspl_userId")?.value;
  const role = cookieStore.get("nwspl_role")?.value as Role;

  // 1. If they have no active session, send them to the login gate
  if (!userId) {
    redirect("/login");
  }

  // 2. If they are God Mode, send them to the Command Center
  if (role === Role.SUPER_ADMIN) {
    redirect("/super-admin");
  }

  // 3. If they are a Manager, send them to their Department Hub
  if (role === Role.SUB_ADMIN) {
    redirect("/department");
  }

  // 4. Default fallback: Send standard employees to their personal workspace
  redirect("/employee");
}