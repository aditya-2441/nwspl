import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function EmployeePortal() {
  // 1. Grab the user's ID from the secure cookie
  const cookieStore = await cookies();
  const userId = cookieStore.get("nwspl_userId")?.value;

  if (!userId) {
    return <div>Error: Could not load user profile.</div>;
  }

  // 2. Fetch their specific data from MongoDB
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return <div>User not found in database.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Welcome, {user.name.split(' ')[0]}!</h1>
        <p className="mt-2 text-sm text-gray-600">Here is your NWSPL Employee Overview.</p>
      </div>

      {/* Digital ID Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-blue-600 p-4">
          <h2 className="text-white font-semibold">Corporate Profile</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 font-medium">Full Name</p>
            <p className="text-lg text-gray-900 font-semibold">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Email Address</p>
            <p className="text-lg text-gray-900 font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Department</p>
            <p className="text-lg text-gray-900 font-semibold">{user.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Clearance Level</p>
            <span className="inline-flex mt-1 px-3 py-1 text-xs leading-5 font-bold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Placeholder for future features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center h-48">
          <span className="text-3xl mb-2">📝</span>
          <h3 className="font-semibold text-gray-900">Submit a Request</h3>
          <p className="text-sm text-gray-500 mt-1">Need IT support or time off? Submit a ticket here.</p>
          <button className="mt-4 text-blue-600 text-sm font-medium hover:underline">Coming soon &rarr;</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center h-48">
          <span className="text-3xl mb-2">📅</span>
          <h3 className="font-semibold text-gray-900">Leave Balance</h3>
          <p className="text-sm text-gray-500 mt-1">View your remaining PTO and sick days.</p>
          <button className="mt-4 text-blue-600 text-sm font-medium hover:underline">Coming soon &rarr;</button>
        </div>
      </div>
    </div>
  );
}