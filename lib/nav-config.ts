// lib/nav-config.ts
import {
  CalendarDays,
  Boxes,
  Wallet,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type Role = "admin" | "accountant" | "inventory_manager" | "employee";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  roles: Role[];
  badge?: string | null;
  description?: string;
}

export const navItems: NavItem[] = [
  {
    title: "Events",
    url: "/events",
    icon: CalendarDays,
    roles: ["admin", "accountant", "inventory_manager", "employee"],
    badge: "5",
    description: "Manage events",
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Boxes,
    roles: ["admin", "accountant", "inventory_manager"],
    badge: null,
    description: "Stock management",
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: Wallet,
    roles: ["admin", "accountant"],
    badge: null,
    description: "Financial accounts",
  },
  {
    title: "Employees",
    url: "/employees",
    icon: Users,
    roles: ["admin", "accountant", "employee", "inventory_manager"],
    badge: "8",
    description: "Staff management",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["admin"],
    badge: null,
    description: "Preferences",
  },
];

export function getNavForRole(role: Role): NavItem[] {
  return navItems.filter((item) => item.roles.includes(role));
}