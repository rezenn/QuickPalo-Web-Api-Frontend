"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Logo from "@/app/assets/images/quickpalo_logo.png";

const NavLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Feature" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="m-5 top-0 z-50 ">
      <nav className="mx-auto w-full px-5 lg:px-8 ">
        <div className="flex items-center justify-between ">
          {/* Logo */}
          <div className="flex items-center w-full gap-2">
            <Link href="/">
              <Image
                src={Logo}
                alt="Logo"
                className="w-full max-w-[200px] h-auto rounded-bl-2xl rounded-tr-2xl"
                priority
              />
            </Link>
            {/* Nav screens */}
            <div className="ml-auto flex items-center gap-1">
              <div
                className={`hidden md:flex items-center gap-8 px-5 justify-center text-black font-bold `}
              >
                {NavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={
                      "text-lg hover:text-gray-800 " +
                      (isActive(link.href) ? "text-black" : "text-black/60")
                    }
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              {/* Login and toggle */}
              <div className="flex items-center gap-2 md:justify-self-end">
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-5 py-2 text-white inline-flex items-center justify-center rounded-md bg-purple-700 border border-gray-600 shadow-2xl "
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 text-white inline-flex items-center justify-center rounded-md bg-purple-700 border border-gray-600 shadow-2xl "
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
