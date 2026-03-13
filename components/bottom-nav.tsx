"use client";

import { Home, Map, Users, Settings, MapPinPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Trips",
    url: "/",
    icon: Map,
  },
  {
    title: "New",
    url: "/trips/new",
    icon: Home,
  },
  {
    title: "Add",
    url: "/trips/new",
    icon: MapPinPlus,
  },
  {
    title: "Profile",
    url: "#",
    icon: Users,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[420px] px-4 pb-safe transition-all duration-500">
      <nav className="flex justify-between items-center h-20 bg-[#14213d]/80 backdrop-blur-2xl border border-[#e5e5e5]/10 rounded-full shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)] px-6 relative overflow-hidden">
        {/* Subtle glow inside the bar using Alabaster Grey / White */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff]/5 via-[#e5e5e5]/5 to-[#ffffff]/5 opacity-50 pointer-events-none" />

        {navItems.map((item) => {
          const isActive = pathname === item.url;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "group relative flex flex-col items-center justify-center w-14 h-full space-y-1 transition-all duration-500 ease-out z-10",
                isActive ? "-translate-y-1" : "hover:-translate-y-0.5"
              )}
            >
              {/* Active floating indicator (Orange) */}
              {isActive && (
                <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#fca311] shadow-[0_0_12px_2px_rgba(252,163,17,0.8)]" />
              )}
              
              <div
                className={cn(
                  "relative p-2 rounded-2xl transition-all duration-500",
                  isActive 
                    ? "bg-[#fca311]/10 text-[#fca311] shadow-[inset_0_1px_4px_rgba(255,255,255,0.05)]" 
                    : "text-[#e5e5e5]/60 group-hover:text-[#e5e5e5] group-hover:bg-[#ffffff]/5"
                )}
              >
                <Icon 
                  className={cn(
                    "h-6 w-6 transition-all duration-500", 
                    isActive && "stroke-[2.5px] drop-shadow-[0_0_8px_rgba(252,163,17,0.6)]"
                  )} 
                />
              </div>
              
              <span 
                className={cn(
                  "text-[10px] font-semibold tracking-wide transition-all duration-500",
                  isActive 
                    ? "text-[#fca311]" 
                    : "text-[#e5e5e5]/50 group-hover:text-[#e5e5e5]/90"
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
