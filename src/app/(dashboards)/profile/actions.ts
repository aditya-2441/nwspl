// src/app/(dashboards)/profile/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateProfileName(formData: FormData) {
  const newName = formData.get("name") as string;
  if (!newName || newName.trim() === "") return;

  const cookieStore = await cookies();
  const userId = cookieStore.get("nwspl_userId")?.value;

  if (!userId) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: userId },
    data: { name: newName.trim() },
  });

  // Revalidate the profile page to show the update instantly
  revalidatePath("/profile");
}