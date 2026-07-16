"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative group cursor-pointer border-[3px] border-zinc-400 dark:border-red-600 bg-zinc-200 dark:bg-zinc-800 p-2 text-zinc-800 dark:text-red-500 transition-all duration-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:border-red-500 dark:hover:border-red-400 hover:text-red-700 dark:hover:text-red-400 shadow-sm hover:shadow-md"
      aria-label="Toggle theme"
    >
      {/* Red accent line on hover */}
      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-500 scale-x-0 transition-transform duration-300 group-hover:scale-x-100 dark:bg-red-400" />
      
      <div className="relative z-10">
        {theme === "dark" ? (
          <Sun className="h-5 w-5 stroke-2 transition-all duration-300 group-hover:scale-110" />
        ) : (
          <Moon className="h-5 w-5 stroke-2 transition-all duration-300 group-hover:scale-110" />
        )}
      </div>
    </button>
  );
}