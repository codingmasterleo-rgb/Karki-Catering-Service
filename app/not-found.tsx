import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#e6f9e6] p-8 font-sans">
      {/* Icon – sharp square */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center border-4 border-[#2d6a4f] bg-[#2d6a4f] shadow-lg">
        <FileQuestion className="h-8 w-8 text-[#e6f9e6]" strokeWidth={2} />
      </div>

      <h1 className="mb-2 text-3xl font-bold tracking-tight text-[#1b4332]">
        404 – Page not found
      </h1>

      <p className="mb-8 max-w-md text-center text-[#2d6a4f]">
        The resource you’re looking for doesn’t exist or has been removed.
      </p>

      <Link
        href="/"
        className="border-2 border-[#2d6a4f] bg-[#2d6a4f] px-6 py-2.5 font-semibold text-[#e6f9e6] transition-colors hover:bg-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] focus:ring-offset-2"
      >
        Back to dashboard
      </Link>
    </div>
  );
}