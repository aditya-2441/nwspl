// src/components/UserFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Role, Department } from "@prisma/client";

export default function UserFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (key: string, value: string) => {
    // Grab the current URL parameters
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or remove the parameter based on the user's input
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Update the URL smoothly
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
      
      {/* Search by Name or Email */}
      <div className="flex-1 w-full">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Search</label>
        <input
          type="text"
          placeholder="Find by name or email..."
          defaultValue={searchParams.get("search")?.toString()}
          onChange={(e) => handleFilter("search", e.target.value)}
          className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* Filter by Department */}
      <div className="w-full md:w-48">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Department</label>
        <select
          defaultValue={searchParams.get("department")?.toString() || ""}
          onChange={(e) => handleFilter("department", e.target.value)}
          className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="">All Departments</option>
          {Object.values(Department).map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Filter by Clearance Level */}
      <div className="w-full md:w-48">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Clearance</label>
        <select
          defaultValue={searchParams.get("role")?.toString() || ""}
          onChange={(e) => handleFilter("role", e.target.value)}
          className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="">All Roles</option>
          {Object.values(Role).map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

    </div>
  );
}