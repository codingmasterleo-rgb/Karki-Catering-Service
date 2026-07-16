// app/(dashboard)/layout.tsx
"use client"

import Sidebar from "@/components/app-sidebar"
import { useSession } from "next-auth/react"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data } = useSession()

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950 transition-colors">
      <Sidebar role={data?.user?.role || "employee"} />

      <main
        className={[
          "flex-1 overflow-y-auto p-4",
          // Mobile: top padding clears the fixed toggle button (top-4, h-11) so content
          // never starts underneath it. No left margin needed - sidebar is off-screen.
          "pt-20",
          // Desktop (lg+): sidebar is fixed and collapsed to w-20 by default, so push
          // content over by that much. Sidebar expands over content on hover, it does
          // not push layout, so this stays at the collapsed width.
          "lg:pt-4 lg:ml-20",
        ].join(" ")}
      >
        {children}
      </main>
    </div>
  )
}