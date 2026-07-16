// app/(auth)/layout.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in to your KCS account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 font-sans transition-colors">
      {children}
    </div>
  );
}