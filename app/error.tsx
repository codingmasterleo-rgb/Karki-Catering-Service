"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#e6f9e6] p-8 font-sans">
      {/* Icon – no rounded corners on wrapper */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center border-4 border-[#2d6a4f] bg-[#2d6a4f] shadow-lg">
        <AlertTriangle className="h-8 w-8 text-[#e6f9e6]" strokeWidth={2} />
      </div>

      <h1 className="mb-2 text-3xl font-bold tracking-tight text-[#1b4332]">
        Something went wrong
      </h1>

      <p className="mb-8 max-w-md text-center text-[#2d6a4f]">
        An unexpected error occurred. Our team has been notified. Please try
        again or return to the dashboard.
      </p>

      <div className="flex gap-4">
        {/* Retry button – sharp edges, no rounded */}
        <button
          onClick={reset}
          className="border-2 border-[#2d6a4f] bg-[#2d6a4f] px-6 py-2.5 font-semibold text-[#e6f9e6] transition-colors hover:bg-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] focus:ring-offset-2 active:bg-[#143d29]"
        >
          Try again
        </button>

        {/* Home link – sharp outline */}
        <Link
          href="/"
          className="border-2 border-[#2d6a4f] bg-transparent px-6 py-2.5 font-semibold text-[#2d6a4f] transition-colors hover:bg-[#d8f3dc] focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] focus:ring-offset-2"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}