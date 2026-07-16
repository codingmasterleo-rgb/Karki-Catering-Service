'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { getNavForRole, type Role } from '@/lib/nav-config'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import LogoutButton from './signout'

interface UserData {
  username: string
  email: string
  role: Role
}

interface SidebarProps {
  role: Role
}

const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin Manager',
  accountant: 'Accountant',
  inventory_manager: 'Inventory Manager',
  employee: 'Employee',
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)


  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const sidebarItems = getNavForRole(role)

  const userData: UserData = {
    username: session?.user?.username ?? 'Unknown User',
    email: session?.user?.email ?? '',
    role: (session?.user?.role as Role) ?? role,
  }

  const initials = userData.username
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const isActive = (href: string) => {
    if (href === '/') return pathname === href
    return pathname?.startsWith(href)
  }

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  const expanded = !isCollapsed || isHovered

  const handleNavClick = () => {
    setIsMobileOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className={cn(
          'lg:hidden fixed top-4 left-4 z-50 w-11 h-11 flex items-center justify-center',
          'bg-red-500 text-white shadow-lg shadow-red-500/30',
          'transition-opacity duration-200',
          isMobileOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
        aria-label="Open menu"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-zinc-50 dark:bg-zinc-950',
          'border-r border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col z-50',
          'transition-transform duration-300 lg:transition-all',

          'w-full lg:w-auto',
          isMobileOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0',

          expanded ? 'lg:w-64' : 'lg:w-20'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn(
            'relative flex items-center h-20 px-4 border-b border-zinc-200 dark:border-zinc-800',
            'bg-gradient-to-r from-red-500/5 to-transparent',
            'justify-between lg:justify-start',
            expanded && 'lg:justify-between'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 animate-pulse" />
              <div className="relative w-10 h-10 bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className={cn(!expanded && 'lg:hidden')}>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                K<span className="text-red-500">c</span>S
              </h1>
              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">
                Karki Catering Service
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden w-9 h-9 flex items-center justify-center bg-red-500 text-white shadow-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          <Button
            size="icon"
            variant="default"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-red-500 hover:bg-red-600 shadow-md',
              'transition-transform duration-300 hover:scale-110'
            )}
          >
            <ChevronRight
              className={cn(
                'w-4 h-4 transition-transform duration-300 text-white',
                !expanded && 'rotate-180'
              )}
            />
          </Button>
        </div>

        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.url)

              return (
                <Link
                  key={item.title}
                  href={item.url}
                  onClick={handleNavClick}
                  className={cn(
                    'group relative flex items-center px-3 py-3 transition-all duration-300',
                    active
                      ? 'bg-red-500/10 dark:bg-red-400/15 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-400/20'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100',
                    'gap-3',
                    !expanded && 'lg:justify-center'
                  )}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-500" />
                  )}
                  <Icon className="w-5 h-5 shrink-0" />
                  <div className={cn('flex-1 min-w-0', !expanded && 'lg:hidden')}>
                    <span className="text-sm font-semibold tracking-wide">
                      {item.title}
                    </span>
                    {item.description && (
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        'min-w-[18px] h-[18px] text-[9px] font-bold bg-red-500 text-white flex items-center justify-center px-1',
                        !expanded && 'lg:hidden'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-red-500/30">
              <AvatarFallback className="bg-red-500 text-white font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className={cn('flex-1 min-w-0 text-left', !expanded && 'lg:hidden')}>
              <p className="font-semibold text-sm truncate text-zinc-900 dark:text-zinc-100">
                {userData.username}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {ROLE_LABELS[userData.role]}
              </p>
            </div>
          </div>
          <LogoutButton showLabel={expanded} />
        </div>
      </aside>
    </>
  )
}