"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        // Base Layout & Sharp Edges
        "peer group/switch relative inline-flex shrink-0 items-center rounded-none border outline-none transition-all duration-150",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        // Dimensions
        "data-[size=default]:h-5 data-[size=default]:w-9",
        "data-[size=sm]:h-4 data-[size=sm]:w-7",
        // Unchecked State (Dark Zinc)
        "border-zinc-700 bg-zinc-800 hover:border-zinc-600 hover:bg-zinc-700/80 dark:border-zinc-700 dark:bg-zinc-800",
        // Checked State (Solid ERP Red)
        "data-checked:border-red-600 data-checked:bg-red-600 dark:data-checked:border-red-600 dark:data-checked:bg-red-600",
        // Focus & Active States
        "focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20",
        // Disabled States
        "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:data-disabled:border-red-900 data-checked:data-disabled:bg-red-900/60",
        // Error / Invalid States
        "aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Sharp Thumb & Smooth Slide
          "pointer-events-none block rounded-none bg-white shadow-sm ring-0 transition-transform duration-150",
          // Default Thumb Sizing & Precise Travel
          "group-data-[size=default]/switch:size-3.5",
          "group-data-[size=default]/switch:data-unchecked:translate-x-0.5",
          "group-data-[size=default]/switch:data-checked:translate-x-4.5",
          // Small Thumb Sizing & Precise Travel
          "group-data-[size=sm]/switch:size-2.5",
          "group-data-[size=sm]/switch:data-unchecked:translate-x-0.5",
          "group-data-[size=sm]/switch:data-checked:translate-x-3.5",
          // Thumb Color
          "data-unchecked:bg-zinc-300 dark:data-unchecked:bg-zinc-300 data-checked:bg-white dark:data-checked:bg-white",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };