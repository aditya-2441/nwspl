// src/components/SignOutButton.tsx
"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Make sure this path matches your firebase config!

export default function SignOutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // 1. Sign out of Firebase
      await signOut(auth);
      
      // 2. Wipe the Next.js Server Cookies
      await fetch("/api/auth/logout", { method: "POST" });
      
      // 3. HARD Redirect to login page (This prevents React routing errors)
      window.location.href = "/login";
      
    } catch (error) {
      console.error("Logout Error:", error);
      // Even if it fails, force the user out to be safe
      window.location.href = "/login";
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
        isLoggingOut 
          ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
          : 'bg-slate-800 hover:bg-red-600 text-white'
      }`}
    >
      {isLoggingOut ? "Signing Out..." : "Sign Out"}
    </button>
  );
}