// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// This sets the font for the entire application
const inter = Inter({ subsets: ["latin"] });

// This controls what shows up in the browser tab and Google search results
export const metadata: Metadata = {
  title: "NWSPL Portal",
  description: "Internal corporate management and employee hub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900 min-h-screen`}>
        {/* The 'children' prop here is incredibly important. 
          If you are on /login, it injects the Login page here.
          If you are on /employee, it injects your DashboardsLayout here!
        */}
        {children}
      </body>
    </html>
  );
}