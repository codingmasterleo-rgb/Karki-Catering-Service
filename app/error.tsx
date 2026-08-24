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
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-8 font-sans relative overflow-hidden">
      {/* subtle red glow backdrop, tuned per mode so it doesn't look like a crime scene in light mode */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(239,68,68,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_35%,rgba(239,68,68,0.15),transparent_60%)]" />

      {/* Icon */}
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center border-2 border-red-600 dark:border-red-500 bg-white dark:bg-zinc-900 shadow-[0_0_20px_rgba(239,68,68,0.2)] dark:shadow-[0_0_25px_rgba(239,68,68,0.35)]">
        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500" strokeWidth={2} />
      </div>

      <h1 className="relative mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Something went wrong
      </h1>

      <p className="relative mb-8 max-w-md text-center text-zinc-600 dark:text-zinc-400">
        An unexpected error occurred. Our team has been notified. Please try
        again or return to the dashboard.
      </p>

      {error?.digest && (
        <p className="relative mb-8 -mt-6 text-center font-mono text-xs text-zinc-500 dark:text-zinc-600">
          Error digest: {error.digest}
        </p>
      )}

      <div className="relative flex gap-4">
        {/* Retry button */}
        <button
          onClick={reset}
          className="border-2 border-red-600 bg-red-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-red-700 hover:border-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-50 dark:focus:ring-offset-zinc-950 active:bg-red-800"
        >
          Try again
        </button>

        {/* Home link */}
        <Link
          href="/"
          className="border-2 border-zinc-300 dark:border-zinc-700 bg-transparent px-6 py-2.5 font-semibold text-zinc-700 dark:text-zinc-300 transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-50 dark:focus:ring-offset-zinc-950"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}