// src/components/ManagerUserRow.tsx
"use client";

import { useState, useTransition } from "react";
import { Permission, Role, Department } from "@prisma/client";
// We safely reuse the toggle actions we already built for the Super Admin!
import { toggleUserStatus, togglePermission } from "@/app/(dashboards)/super-admin/actions";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: Department;
  permissions: Permission[];
  isActive: boolean;
};

const allPermissions = Object.values(Permission);

export default function ManagerUserRow({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();
  const [showTools, setShowTools] = useState(false);

  const handleStatusToggle = () => {
    startTransition(() => toggleUserStatus(user.id, user.isActive));
  };

  const handlePermissionToggle = (permission: Permission) => {
    const hasPerm = user.permissions.includes(permission);
    startTransition(() => togglePermission(user.id, permission, hasPerm));
  };

  return (
    <div className={`border rounded-lg mb-4 bg-white p-4 shadow-sm transition-all ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
       <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex-1 w-full">
            <h3 className="font-bold text-gray-900">{user.name === "New Employee" ? "Unnamed User" : user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          {/* SECURITY: Static Badges instead of Dropdowns */}
          <div className="flex gap-2 w-full md:w-auto">
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-bold border border-gray-200">
              {user.role}
            </span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-bold border border-blue-200">
              {user.department}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
             <button
                onClick={handleStatusToggle}
                className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-colors ${
                  user.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
                }`}
             >
               {user.isActive ? "🟢 ACTIVE" : "🔴 LOCKED"}
             </button>

             <button
               onClick={() => setShowTools(!showTools)}
               className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors"
             >
               {showTools ? "Hide Tools" : "Manage Tools"}
             </button>
          </div>
       </div>

       {showTools && (
         <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Team Member Access</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {allPermissions.map((perm) => {
                 const hasAccess = user.permissions.includes(perm);
                 return (
                   <label key={perm} className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md border ${
                       hasAccess ? 'bg-blue-50 border-blue-200 text-blue-900' : 'hover:bg-gray-50 border-gray-200 text-gray-600'
                     }`}
                   >
                     <input
                       type="checkbox"
                       checked={hasAccess}
                       onChange={() => handlePermissionToggle(perm)}
                       disabled={!user.isActive}
                       className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                     />
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