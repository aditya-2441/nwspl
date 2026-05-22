// src/app/(dashboards)/profile/page.tsx
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { updateProfileName } from "./actions";
import SubmitButton from "@/components/SubmitButton"; // NEW IMPORT

export default async function UniversalProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("nwspl_userId")?.value;

  if (!userId) {
    return <div className="p-10">Error: Could not authenticate session.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return <div className="p-10">User not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500">Manage your NWSPL corporate identity.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            {/* ACTUALLY SHOW THE USER'S NAME HERE! */}
            <h2 className="text-xl font-bold text-gray-900">
              {user.name === "New Employee" ? "Unnamed User" : user.name}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800 border border-slate-300">
            {user.role} | {user.department}
          </span>
        </div>

        <div className="p-6 bg-gray-50">
          <form action={updateProfileName} className="max-w-md space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={user.name === "New Employee" ? "" : user.name}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {/* Swap out the old button for our new smart button */}
            <SubmitButton />
            
          </form>
        </div>
      </div>
    </div>
  );
}