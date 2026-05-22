// src/app/(dashboards)/super-admin/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Role, Department, Permission } from "@prisma/client";

// --- SECURITY HELPER ---
// This ensures the person calling the action actually has the authority to do so.
async function verifySuperAdmin() {
  const cookieStore = await cookies();
  const role = cookieStore.get("nwspl_role")?.value;
  
  if (role !== Role.SUPER_ADMIN) {
    throw new Error("UNAUTHORIZED: Only Super Admins can perform this action.");
  }
}

// 1. Promote to Sub-Admin
export async function promoteToSubAdmin(formData: FormData) {
  await verifySuperAdmin(); // SECURITY LOCK: Only God Mode can promote

  const userId = formData.get("userId") as string;
  if (!userId) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role: Role.SUB_ADMIN },
  });

  // Clear the cache for the entire dashboard app so the UI updates instantly
  revalidatePath("/", "layout");
}

// 2. The Kill Switch (Lock an account)
export async function toggleUserStatus(userId: string, currentStatus: boolean) {
  // SECURITY LOCK: Both Super Admins and Managers can lock accounts
  const cookieStore = await cookies();
  const role = cookieStore.get("nwspl_role")?.value;
  
  if (role !== Role.SUPER_ADMIN && role !== Role.SUB_ADMIN) {
    throw new Error("UNAUTHORIZED: Insufficient clearance.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !currentStatus },
  });
  
  revalidatePath("/", "layout");
}

// 3. Change Role & Department
export async function updateUserScope(userId: string, formData: FormData) {
  await verifySuperAdmin(); // SECURITY LOCK: Only God Mode can reassign departments

  const role = formData.get("role") as Role;
  const department = formData.get("department") as Department;

  await prisma.user.update({
    where: { id: userId },
    data: { role, department },
  });
  
  revalidatePath("/", "layout");
}

// 4. Granular Tool Access
export async function togglePermission(userId: string, permission: Permission, hasPermission: boolean) {
  // SECURITY LOCK: Both Super Admins and Managers can assign tools
  const cookieStore = await cookies();
  const role = cookieStore.get("nwspl_role")?.value;
  
  if (role !== Role.SUPER_ADMIN && role !== Role.SUB_ADMIN) {
    throw new Error("UNAUTHORIZED: Insufficient clearance.");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  let newPermissions = [...user.permissions];

  if (hasPermission) {
    // Remove it from the array
    newPermissions = newPermissions.filter((p) => p !== permission);
  } else {
    // Add it to the array
    newPermissions.push(permission);
  }

  await prisma.user.update({
    where: { id: userId },
    data: { permissions: newPermissions },
  });
  
  revalidatePath("/", "layout");
}