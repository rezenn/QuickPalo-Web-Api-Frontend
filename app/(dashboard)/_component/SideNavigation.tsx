"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon as HomeOutline } from "@heroicons/react/24/outline";
import { BuildingOffice2Icon as BuildingOfficeOutline } from "@heroicons/react/24/outline";
import { BuildingOffice2Icon as BuildingOfficeSoild } from "@heroicons/react/24/solid";
import { HomeIcon as HomeSolid } from "@heroicons/react/24/solid";
import { CalendarDaysIcon as CalendarDaysOutline } from "@heroicons/react/24/outline";
import { CalendarDaysIcon as CalendarDaysSolid } from "@heroicons/react/24/solid";
import { ClockIcon as ClockOutline } from "@heroicons/react/24/outline";
import { ClockIcon as ClockSolid } from "@heroicons/react/24/solid";
import { UserIcon as UserOutline } from "@heroicons/react/24/outline";
import { UserIcon as UserSolid } from "@heroicons/react/24/solid";
import ThemeSwitch from "./ThemeSwitch";
import { LogOutIcon, Menu } from "lucide-react"; // Menu icon
import { useAuth } from "@/context/authContext";

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
    href: "/organizations",
    label: "Organizations",
    filledIcon: BuildingOfficeSoild,
    icon: BuildingOfficeOutline,
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
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      {/* Toggle button for small screens */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-white hover:bg-fuchsia-700 hover:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 shadow-md z-40 transform transition-transform duration-300 bg-white md:bg-transparent
        ${
          isOpen ? "translate-x-0 " : "-translate-x-full "
        }  md:translate-x-0 md:static md:flex md:flex-col text-black/80`}
      >
        <nav className="flex-1 mt-12 md:mt-0 flex flex-col gap-1 p-4">
          {NavLinks.map((link) => {
            const Icon = isActive(link.href) ? link.filledIcon : link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-4 rounded-lg text-md font-regular  transition-colors text-black/70 ${
                  isActive(link.href)
                    ? "bg-purple-300"
                    : "hover:text-white hover:bg-fuchsia-600"
                }`}
                onClick={() => setIsOpen(false)} // close on link click
              >
                <Icon className="w-6 h-6" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-3 h-px w-full bg-gray-400" />
        <div className="flex flex-col">
          <div className="h-12 flex flex-row justify-between items-center p-3">
            <span className="font-regular text-md">Themes</span>
            <ThemeSwitch />
          </div>

          <button
            onClick={logout}
            //  className="flex flex-row gap-4"
            className="h-12 flex justify-center items-center p-2 m-2 rounded-xl text-red-600 bg-gray-300 border border-gray-400 hover:text-white hover:bg-fuchsia-600"
          >
            <LogOutIcon />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
