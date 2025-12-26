"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon as HomeOutline } from "@heroicons/react/24/outline";
import { HomeIcon as HomeSolid } from "@heroicons/react/24/solid";
import { CalendarDaysIcon as CalendarDaysOutline } from "@heroicons/react/24/outline";
import { CalendarDaysIcon as CalendarDaysSolid } from "@heroicons/react/24/solid";
import { ClockIcon as ClockOutline } from "@heroicons/react/24/outline";
import { ClockIcon as ClockSolid } from "@heroicons/react/24/solid";
import { UserIcon as UserOutline } from "@heroicons/react/24/outline";
import { UserIcon as UserSolid } from "@heroicons/react/24/solid";
import ThemeSwitch from "./ThemeSwitch";
import { LogOutIcon } from "lucide-react";

const NavLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    filledIcon: HomeSolid,
    icon: HomeOutline,
  },
  {
    href: "/calendar",
    label: "Calendar",
    filledIcon: CalendarDaysSolid,
    icon: CalendarDaysOutline,
  },
  {
    href: "/history",
    label: "History",
    filledIcon: ClockSolid,
    icon: ClockOutline,
  },
  {
    href: "/profile",
    label: "Profile",
    filledIcon: UserSolid,
    icon: UserOutline,
  },
];

export default function SideNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);
  return (
    <aside className="w-64  text-black/80 flex flex-col">
      <nav className="flex-1 flex flex-col gap-2 p-4">
        {NavLinks.map((link) => {
          const Icon = isActive(link.href) ? link.filledIcon : link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-3 py-4  rounded-lg text-md font-regular transition-colors text-black/70  ${
                isActive(link.href)
                  ? "bg-purple-300 "
                  : " hover:text-white hover:bg-fuchsia-600 "
              }`}
            >
              <Icon className="w-6 h-6" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      {/* Divider */}
      <div className="mt-3 h-px w-full bg-gray-400" />
      <div className="flex flex-col">
        <div className="h-12 flex flex-row justify-between items-center p-3 ">
          <span className="font-regular text-md ">Themes</span>
          <ThemeSwitch />
        </div>
        <Link
          href="/login"
          className=" h-12 flex  justify-center items-center p-2 m-2 rounded-xl text-red-600 bg-gray-300 border border-gray-400 hover:text-white hover:bg-fuchsia-600 "
        >
          <button className=" flex flex-row gap-4">
            <LogOutIcon />
            Logout
          </button>
        </Link>
      </div>
    </aside>
  );
}
