// src/app/(dashboards)/super-admin/page.tsx
import prisma from "@/lib/prisma";
import AdminUserRow from "@/components/AdminUserRow";
import UserFilters from "@/components/UserFilters";
import { Role, Department, Prisma } from "@prisma/client";

export default async function SuperAdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; department?: string; role?: string }>;
}) {
  // 1. Await the searchParams (Required in Next.js 15+)
  const params = await searchParams;
  
  const search = params?.search || "";
  const department = params?.department as Department | undefined;
  const role = params?.role as Role | undefined;

  // Dynamically build the database query
  const whereClause: Prisma.UserWhereInput = {};

  if (search) {
    // 2. Removed `mode: "insensitive"` as it breaks MongoDB
    // Note: Search will be case-sensitive (e.g., "Jane" will not match "jane")
    whereClause.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (department) {
    whereClause.department = department;
  }
  if (role) {
    whereClause.role = role;
  }

  // Fetch the filtered list
  const users = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">NWSPL Global Command</h1>
        <p className="mt-2 text-sm text-gray-600">Master directory of all registered personnel.</p>
      </div>

      <UserFilters />

      <div className="bg-gray-100 p-4 rounded-xl shadow-inner border border-gray-200">
         {users.map((user) => (
            <AdminUserRow key={user.id} user={user} />
         ))}
         
         {users.length === 0 && (
           <div className="text-center text-gray-500 py-10 bg-white rounded-lg border border-dashed border-gray-300">
             No employees match your search criteria.
           </div>
         )}
      </div>
    </div>
  );
}