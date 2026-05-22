// src/app/(dashboards)/department/page.tsx
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { Department, Role, Prisma } from "@prisma/client";
import ManagerUserRow from "@/components/ManagerUserRow";
import TeamSearch from "@/components/TeamSearch";

export default async function DepartmentDashboard({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  // 1. Await the search parameters
  const params = await searchParams;
  const search = params?.search || "";

  // 2. Security: Find out exactly which department this manager runs
  const cookieStore = await cookies();
  const managerDeptStr = cookieStore.get("nwspl_department")?.value;

  if (!managerDeptStr) {
    return <div className="p-10 text-red-600 font-bold">Security Error: Could not identify your department.</div>;
  }

  const managerDept = managerDeptStr as Department;

  // 3. Build the strict, fenced-in query
  const whereClause: Prisma.UserWhereInput = {
    department: managerDept, // Locked to their department
    role: Role.USER,         // Locked to regular employees
  };

  // 4. Add the search filter if they typed something
  if (search) {
    whereClause.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }

  // 5. Fetch the team
  const teamMembers = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Team Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage access and tools for the <span className="font-bold text-blue-600">{managerDept}</span> division.
        </p>
      </div>

      <TeamSearch />

      <div className="bg-gray-100 p-4 rounded-xl shadow-inner border border-gray-200">
         {teamMembers.map((user) => (
            <ManagerUserRow key={user.id} user={user} />
         ))}
         
         {teamMembers.length === 0 && (
           <div className="text-center text-gray-500 py-10 bg-white rounded-lg border border-dashed border-gray-300">
             {search ? "No team members match your search." : "There are currently no standard employees assigned to your department."}
           </div>
         )}
      </div>
    </div>
  );
}