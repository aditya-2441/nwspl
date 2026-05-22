// src/components/TeamSearch.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TeamSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
        Search My Team
      </label>
      <input
        type="text"
        placeholder="Find by name or email..."
        defaultValue={searchParams.get("search")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full md:w-1/2 border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}