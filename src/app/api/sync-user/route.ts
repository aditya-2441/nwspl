// src/app/api/sync-user/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { Department, Permission, Role } from "@prisma/client";

// Helper function to assign default tools based on department
function getDefaultPermissions(department: Department): Permission[] {
  switch (department) {
    case Department.UI_UX:
      return [Permission.WIREFRAMES, Permission.DESIGN_SYSTEM];
    
    case Department.BACKEND:
      return [Permission.SERVER_LOGS, Permission.API_KEYS];
    
    case Department.HR:
      return [Permission.EDIT_PAYROLL, Permission.VIEW_LEAVE_REQUESTS];
    
    default:
      return []; // Standard users get no special tools by default
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firebaseUid, email, name } = body;

    if (!firebaseUid || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Check if the user already exists in MongoDB
    let user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    // 2. THE BOUNCER: If they exist but are locked, reject the login instantly!
    if (user && user.isActive === false) {
      return NextResponse.json(
        { error: "Account locked. Please contact administration." }, 
        { status: 403 }
      );
    }

    // 3. If they don't exist, create them using strict Enums!
    if (!user) {
      const defaultDept = Department.ENGINEERING;
      
      user = await prisma.user.create({
        data: {
          firebaseUid,
          email,
          name: name || "New Employee",
          role: Role.USER,
          department: defaultDept,
          permissions: getDefaultPermissions(defaultDept),
          isActive: true,
        },
      });
    }
    
    // Drop secure, HTTP-only cookies into the browser
    const cookieStore = await cookies();
    
    // 1. The Role Cookie
    cookieStore.set("nwspl_role", user.role, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7 
    });

    // 2. The Department Cookie
    cookieStore.set("nwspl_department", user.department, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7 
    });

    // 3. The Unique User ID Cookie
    cookieStore.set("nwspl_userId", user.id, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7 
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Database sync error:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}