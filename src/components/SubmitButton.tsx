// src/components/SubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  // This hook automatically knows if the parent form is actively submitting!
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}