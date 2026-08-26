"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base Layout & Sharp Edges
        "peer relative flex size-4.5 shrink-0 items-center justify-center rounded-none border outline-none transition-all duration-150",
        // Unchecked State (Dark Zinc Theme)
        "border-zinc-700 bg-zinc-900/80 text-white hover:border-zinc-500 hover:bg-zinc-900",
        // Checked & Indeterminate State (Catering ERP Solid Red)
        "data-checked:border-red-600 data-checked:bg-red-600 data-checked:text-white dark:data-checked:border-red-600 dark:data-checked:bg-red-600 dark:data-checked:text-white",
        "data-indeterminate:border-red-600 data-indeterminate:bg-red-600 data-indeterminate:text-white",
        // Focus & Active States
        "focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20",
        // Disabled States
        "disabled:cursor-not-allowed disabled:opacity-50 data-checked:disabled:border-red-800 data-checked:disabled:bg-red-800/60",
        // Error / Invalid States
        "aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-white transition-none [&>svg]:size-3.5 [&>svg]:stroke-[3]"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };