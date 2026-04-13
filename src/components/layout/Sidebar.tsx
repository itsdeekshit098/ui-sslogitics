"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Truck,
  FileText,
  Fuel,
  Users,
  BarChart3,
  LayoutDashboard,
  Building2,
  Wrench,
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Trip Sheets", href: "/trip-sheets", icon: FileText },
  { name: "Diesel Records", href: "/diesel-records", icon: Fuel },
  { name: "Repair Records", href: "/repair-records", icon: Wrench },
  { name: "Vehicles", href: "/vehicles", icon: Truck },
  { name: "Drivers", href: "/drivers", icon: Users },
  { name: "Clients", href: "/clients", icon: Building2 },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("border-r bg-muted/40 w-64 shrink-0", className)}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold"
            onClick={onClose}
          >
            <Truck className="h-6 w-6" />
            <span className="text-lg font-bold tracking-tight">
              SRI SRINIVASA
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 md:py-2 transition-all hover:text-primary active:bg-muted/80",
                  pathname === item.href
                    ? "bg-muted text-primary"
                    : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5 md:h-4 md:w-4" />
                <span className="text-base md:text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
