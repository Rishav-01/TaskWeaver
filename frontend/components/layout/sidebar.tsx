"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  FileText,
  BarChart3,
  Menu,
  X,
  Bot,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Meetings", href: "/meetings", icon: Users },
  // { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-background border-r transition-all duration-200 ease-in-out",
        collapsed ? "w-16" : "w-64",
        className
      )}
      aria-label="Main navigation"
    >
      <div
        className={cn(
          "flex items-center justify-between p-4 transition-all",
          collapsed ? "px-2" : "px-4"
        )}
      >
        <div
          className={cn(
            "flex items-center transition-all",
            collapsed ? "justify-center w-full" : "space-x-2"
          )}
        >
          <div
            onClick={() => setCollapsed(false)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              collapsed && "cursor-pointer"
            )}
          >
            <Bot className="h-8 w-8" />
          </div>

          {!collapsed && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold leading-none">
                TaskWeaver
              </span>
              <span className="text-xs text-muted-foreground leading-none">
                Smart Meetings
              </span>
            </div>
          )}
        </div>

        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(true)}
            className="h-8 w-8 p-0"
            aria-label="Collapse sidebar"
            title="Collapse"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className={cn("flex-1", collapsed ? "px-1" : "px-3")}>
        <nav className="space-y-1" role="navigation" aria-label="Sidebar">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                title={item.name}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  collapsed
                    ? "justify-center p-2"
                    : "px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "opacity-100" : "opacity-90"
                  )}
                  aria-hidden="true"
                />

                {!collapsed ? (
                  <span className="ml-3">{item.name}</span>
                ) : (
                  // keep label for screen-readers when collapsed
                  <span className="sr-only">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
