// src/components/Heartbeat.tsx
"use client";

import { useEffect } from "react";

export default function Heartbeat() {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        console.log("Heartbeat pinging server..."); 

        // THE FIX: Add a Date.now() timestamp and force 'no-store'
        // This makes it mathematically impossible for the browser to cache the response.
        const res = await fetch(`/api/auth/check-status?t=${Date.now()}`, {
          cache: "no-store" 
        });
        
        if (!res.ok) {
           console.error("API returned an error status:", res.status);
           return;
        }

        const data = await res.json();
        console.log("Database status:", data.isActive); 
        
        if (data.isActive === false) {
          console.log("KILL SWITCH ACTIVATED - Reloading window");
          window.location.reload();
        }
      } catch (error) {
        console.error("Heartbeat monitor failed:", error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return null; 
}