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
  const [open, setOpen] = useState(false);

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
                      "text-lg " +
                      (isActive(link.href)
                        ? "text-purple-700"
                        : "text-black/70 hover:text-black")
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
                    className="px-5 py-2 text-white inline-flex items-center justify-center rounded-md bg-purple-700 hover:bg-fuchsia-700 hover:rounded-4xl border border-gray-600 shadow-2xl transition-all duration-300 ease-out"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 text-white inline-flex items-center justify-center rounded-md bg-purple-700 hover:bg-fuchsia-700 hover:rounded-4xl border border-gray-600 shadow-2xl transition-all duration-300 ease-out "
                  >
                    Sign up
                  </Link>
                </div>
                {/* toogle menu */}
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  aria-label="Toggle menu"
                  aria-expanded={open}
                  className="md:hidden inline-flex h-9 w-9 p-2 items-center justify-center rounded-md border  border-black/80 bg-white/50 "
                >
                  {open ? (
                    <svg viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                      <title>close</title>
                      <path
                        d="M2.64,1.27L7.5,6.13l4.84-4.84C12.5114,1.1076,12.7497,1.0029,13,1c0.5523,0,1,0.4477,1,1&#xA;&#x9;c0.0047,0.2478-0.093,0.4866-0.27,0.66L8.84,7.5l4.89,4.89c0.1648,0.1612,0.2615,0.3796,0.27,0.61c0,0.5523-0.4477,1-1,1&#xA;&#x9;c-0.2577,0.0107-0.508-0.0873-0.69-0.27L7.5,8.87l-4.85,4.85C2.4793,13.8963,2.2453,13.9971,2,14c-0.5523,0-1-0.4477-1-1&#xA;&#x9;c-0.0047-0.2478,0.093-0.4866,0.27-0.66L6.16,7.5L1.27,2.61C1.1052,2.4488,1.0085,2.2304,1,2c0-0.5523,0.4477-1,1-1&#xA;&#x9;C2.2404,1.0029,2.4701,1.0998,2.64,1.27z"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <title>menu</title>
                      <path
                        d="M2 3h12a1 1 0 0 1 0 2H2a1 1 0 1 1 0-2zm0 4h12a1 1 0 0 1 0 2H2a1 1 0 1 1 0-2zm0 4h12a1 1 0 0 1 0 2H2a1 1 0 0 1 0-2z"
                        id="a"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-4 rounded-lg border border-black/10 bg-white shadow-md">
            <div className="flex flex-col gap-3 p-4">
              {NavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`text-lg ${
                    isActive(link.href)
                      ? "text-purple-700"
                      : "text-black/70 hover:text-black"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-3 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2 text-white inline-flex items-center justify-center rounded-md bg-purple-700 hover:bg-fuchsia-700 hover:rounded-4xl border border-gray-600 shadow-2xl transition-all duration-300 ease-out"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2 text-white inline-flex items-center justify-center rounded-md bg-purple-700 hover:bg-fuchsia-700  hover:rounded-4xl border border-gray-600 shadow-2xl transition-all duration-300 ease-out"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
