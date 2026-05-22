// src/app/(dashboards)/layout.tsx
import { cookies } from "next/headers";
import SignOutButton from "@/components/SignOutButton";
import Sidebar from "@/components/Sidebar";
import Heartbeat from "@/components/Heartbeat";
import prisma from "@/lib/prisma"; 
import { Permission } from "@prisma/client"; 

// Dictionary mapping database permissions to real URLs
const TOOL_ROUTES: Record<string, { name: string; href: string; icon: string }> = {
  WIREFRAMES: { name: "Wireframes", href: "/employee/wireframes", icon: "🎨" },
  DESIGN_SYSTEM: { name: "Design System", href: "/employee/design", icon: "✨" },
  SERVER_LOGS: { name: "Server Logs", href: "/employee/logs", icon: "🖥️" },
  API_KEYS: { name: "API Keys", href: "/employee/api-keys", icon: "🔑" },
  EDIT_PAYROLL: { name: "Payroll", href: "/hr/payroll", icon: "💰" },
  VIEW_LEAVE_REQUESTS: { name: "Leave Approvals", href: "/hr/leaves", icon: "📅" },
  TEAM_PERFORMANCE: { name: "Team Analytics", href: "/department/performance", icon: "📈" },
  MANAGE_USERS: { name: "Team Directory", href: "/department", icon: "⚙️" },
  VIEW_ALL_USERS: { name: "Global Directory", href: "/super-admin", icon: "🌍" },
  MANAGE_SYSTEM: { name: "System Settings", href: "/super-admin/settings", icon: "🛠️" },
};

export default async function DashboardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get("nwspl_role")?.value || "USER";
  const department = cookieStore.get("nwspl_department")?.value || "ENGINEERING";
  const userId = cookieStore.get("nwspl_userId")?.value;

  // Define the base toolsets
  const superAdminLinks = [
    { name: "Global Directory", href: "/super-admin", icon: "👥" },
    { name: "System Logs", href: "/super-admin/logs", icon: "⚙️" },
    { name: "Security", href: "/super-admin/security", icon: "🔒" },
    { name: "My Profile", href: "/profile", icon: "⚙️" },
  ];

  const subAdminLinks = [
    { name: "My Department", href: "/department", icon: "🏢" },
    { name: "Team Performance", href: "/department/performance", icon: "📈" },
    { name: "My Profile", href: "/profile", icon: "⚙️" },
  ];

  const hrLinks = [
    { name: "Employee Directory", href: "/hr", icon: "📇" },
    { name: "Leave Requests", href: "/hr/leaves", icon: "📅" },
    { name: "Payroll", href: "/hr/payroll", icon: "💰" },
    { name: "My Profile", href: "/profile", icon: "⚙️" },
  ];

  const employeeLinks = [
    { name: "My Hub", href: "/employee", icon: "🏠" },
    { name: "Submit Request", href: "/employee/requests", icon: "📝" },
    { name: "My Profile", href: "/profile", icon: "⚙️" },
  ];

  // Assign the correct base tools and badge
  let activeLinks = [...employeeLinks];
  let badgeText = "👤 Employee Portal";
  let badgeColor = "bg-gray-100 text-gray-800 border-gray-200";

  if (role === "SUPER_ADMIN") {
    activeLinks = [...superAdminLinks];
    badgeText = "Executive Access 🏆";
    badgeColor = "bg-purple-100 text-purple-800 border-purple-200";
  } else if (role === "SUB_ADMIN") {
    activeLinks = [...subAdminLinks];
    badgeText = "📊 Manager Access";
    badgeColor = "bg-blue-100 text-blue-800 border-blue-200";
    if (department === "HR") {
      activeLinks = [...subAdminLinks, ...hrLinks];
      
      // Filter out duplicate "My Profile" links
      activeLinks = activeLinks.filter((link, index, self) =>
        index === self.findIndex((t) => t.name === link.name)
      );
      
      badgeText = "🤝 HR Director";
      badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  } else if (department === "HR") {
    activeLinks = [...hrLinks];
    badgeText = "🤝 HR Global Directory";
    badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
  }

  // Fetch their custom permissions AND active status from MongoDB
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { permissions: true, isActive: true } // NEW: Fetch isActive
    });
    
    // SECURITY ESCORT: If the database says they are locked, block the app immediately!
    if (user && user.isActive === false) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-2xl text-center space-y-6 border border-red-100">
            <div className="text-6xl">🔒</div>
            <h1 className="text-3xl font-extrabold text-gray-900">Account Suspended</h1>
            <p className="text-gray-600">
              Your access to the NWSPL Portal has been restricted by an administrator. You can no longer access company resources.
            </p>
            <div className="pt-4">
              <SignOutButton />
            </div>
          </div>
        </div>
      );
    }
    
    // If they are active, append their dynamic links
    if (user && user.permissions) {
      const dynamicLinks = user.permissions
        .map(perm => TOOL_ROUTES[perm])
        .filter(Boolean);
        
      // Ensure we don't render duplicate links in the sidebar
      const existingHrefs = new Set(activeLinks.map(link => link.href));
      
      dynamicLinks.forEach(link => {
        if (!existingHrefs.has(link.href)) {
          activeLinks.push(link);
        }
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Heartbeat />
      {/* GLOBAL TOP NAVIGATION */}
      <nav className="bg-slate-900 text-white p-4 shadow-md z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <h1 className="text-xl font-bold tracking-tight">NWSPL Portal</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeColor}`}>
              {badgeText}
            </span>
            <SignOutButton />
          </div>
        </div>
      </nav>

      {/* DYNAMIC SIDEBAR & MAIN CONTENT */}
      <div className="flex flex-grow max-w-7xl mx-auto w-full">
        <Sidebar links={activeLinks} />
        
        <main className="flex-grow p-6">
          {children}
        </main>
      </div>
    </div>
  );
}