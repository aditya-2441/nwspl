// src/components/AdminUserRow.tsx
"use client";

import { useState, useTransition } from "react";
import { Role, Department, Permission } from "@prisma/client";
import { toggleUserStatus, updateUserScope, togglePermission } from "@/app/(dashboards)/super-admin/actions";

// Tell TypeScript what data to expect
type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: Department;
  permissions: Permission[];
  isActive: boolean;
};

// Generate an array of all possible permissions from Prisma
const allPermissions = Object.values(Permission);

export default function AdminUserRow({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();
  const [showTools, setShowTools] = useState(false);

  const handleStatusToggle = () => {
    startTransition(() => {
      toggleUserStatus(user.id, user.isActive);
    });
  };

  const handleScopeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const formData = new FormData();
    // Keep the unchanged value the same while updating the changed one
    if (e.target.name === "role") {
      formData.append("role", e.target.value);
      formData.append("department", user.department);
    } else {
      formData.append("role", user.role);
      formData.append("department", e.target.value);
    }

    startTransition(() => {
      updateUserScope(user.id, formData);
    });
  };

  const handlePermissionToggle = (permission: Permission) => {
    const hasPerm = user.permissions.includes(permission);
    startTransition(() => {
      togglePermission(user.id, permission, hasPerm);
    });
  };

  return (
    <div className={`border rounded-lg mb-4 bg-white p-4 shadow-sm transition-all ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
       
       {/* 1. Main Row Info */}
       <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex-1 w-full">
            <h3 className="font-bold text-gray-900">{user.name === "New Employee" ? "Unnamed User" : user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          {/* 2. Role & Department Dropdowns */}
          <div className="flex gap-2 w-full md:w-auto">
            <select
              name="role"
              value={user.role}
              onChange={handleScopeChange}
              className="border border-gray-300 rounded p-1.5 text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {Object.values(Role).map((r) => <option key={r} value={r}>{r}</option>)}
            </select>

            <select
              name="department"
              value={user.department}
              onChange={handleScopeChange}
              className="border border-gray-300 rounded p-1.5 text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {Object.values(Department).map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* 3. Master Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
             <button
                onClick={handleStatusToggle}
                className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-colors ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                    : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                }`}
             >
               {user.isActive ? "🟢 ACTIVE" : "🔴 LOCKED"}
             </button>

             <button
               onClick={() => setShowTools(!showTools)}
               className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors"
             >
               {showTools ? "Hide Tools" : "Manage Tools"}
             </button>
          </div>
       </div>

       {/* 4. Expandable Permissions Grid */}
       {showTools && (
         <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Granular Tool Access</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {allPermissions.map((perm) => {
                 const hasAccess = user.permissions.includes(perm);
                 return (
                   <label 
                     key={perm} 
                     className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md border transition-colors ${
                       hasAccess ? 'bg-purple-50 border-purple-200 text-purple-900' : 'hover:bg-gray-50 border-gray-200 text-gray-600'
                     }`}
                   >
                     <input
                       type="checkbox"
                       checked={hasAccess}
                       onChange={() => handlePermissionToggle(perm)}
                       disabled={!user.isActive}
                       className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                     />
                     {/* Clean up the Enum name (e.g. VIEW_ALL_USERS -> VIEW ALL USERS) */}
                     {perm.replace(/_/g, ' ')}
                   </label>
                 )
               })}
            </div>
         </div>
       )}
    </div>
  );
}