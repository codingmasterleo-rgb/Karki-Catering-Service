'use client'

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LogoutButtonProps {
  showLabel?: boolean;
}

export default function LogoutButton({ showLabel = true }: LogoutButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={() => signOut({ callbackUrl: '/signin' })}
      className={cn(
        "relative group cursor-pointer border-2 border-zinc-300 dark:border-red-500/30 bg-zinc-100 dark:bg-zinc-900 transition-all duration-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:border-red-400 dark:hover:border-red-400 text-zinc-700 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300",
        showLabel ? "px-4 py-2" : "w-10 h-10 p-0 justify-center"
      )}
    >
      <span className="absolute inset-0 bg-red-500/0 transition-all duration-300 group-hover:bg-red-500/5 dark:group-hover:bg-red-500/10" />
      
      <span className={cn(
        "relative z-10 flex items-center",
        showLabel ? "gap-2.5" : "justify-center"
      )}>
        <LogOut className={cn(
          "stroke-[1.5] transition-all duration-300 group-hover:translate-x-1",
          showLabel ? "w-4 h-4" : "w-5 h-5"
        )} />
        {showLabel && (
          <span className="font-semibold tracking-wide">Logout</span>
        )}
      </span>
    </Button>
  );
}