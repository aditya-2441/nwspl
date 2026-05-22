// src/app/(dashboards)/hr/page.tsx
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { Role, Department } from "@prisma/client";

export default async function HREmployeeDirectory() {
  // 1. SECURITY CHECK: Ensure only HR staff or Super Admins can view this
  const cookieStore = await cookies();
  const department = cookieStore.get("nwspl_department")?.value;
  const role = cookieStore.get("nwspl_role")?.value;

  if (department !== Department.HR && role !== Role.SUPER_ADMIN) {
    return (
      <div className="p-10 text-center space-y-4">
        <div className="text-5xl">🛑</div>
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-600">This directory is restricted to Human Resources personnel.</p>
      </div>
    );
  }

  // 2. Fetch all active employees, sorted alphabetically
  const employees = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      department: true,
      role: true,
      isActive: true,
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="border-b border-gray-200 pb-5 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Global Directory</h1>
          <p className="mt-2 text-sm text-gray-500">
            Internal contact sheet and status roster for all NWSPL personnel.
          </p>
        </div>
        <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
          Total Headcount: {employees.length}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Clearance</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={`mailto:${emp.email}`} className="text-sm text-blue-600 hover:underline">
                      {emp.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {emp.role === "SUPER_ADMIN" ? "Executive" : emp.role === "SUB_ADMIN" ? "Manager" : "Standard"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {emp.isActive ? (
                      <span className="text-green-600 font-bold">● Active</span>
                    ) : (
                      <span className="text-red-500 font-bold">● Suspended</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}