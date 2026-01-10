"use client";

import Image from "next/image";
import Cookies from "js-cookie";
import logo from "@/app/assets/images/quickpalo_logo.png";
import profile from "@/app/assets/images/profile.png";
import { Search, BellDot } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState<{ fullname: string } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const storedUser = Cookies.get("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!hydrated) return null;
  return (
    <section>
      <div className=" ml-13 md:mx-auto max-w-screen-2xl px-4 py-4">
        {/* Header */}
        <header className="flex items-center gap-4 md:flex-row md:items-center md:justify-between">
          {/* logo */}
          <div className="flex items-center gap-2">
            <Image
              src={logo}
              alt="logo"
              className="w-[230px] h-auto rounded-bl-2xl rounded-tr-2xl"
              priority
            />
            <div className="hidden sm:flex flex-col px-4 leading-tight">
              <span className="text-fuchsia-700 text-sm md:text-lg">
                Hello,
              </span>
              <span className="font-extrabold text-lg md:text-2xl">
                {user?.fullname}
              </span>
            </div>
          </div>
          {/* Search */}
          <div className="relative flex-1 max-w-[250px] sm:max-w-xs md:max-w-md lg:max-w-3xl">
            <input
              type="search"
              placeholder="Search organization..."
              className=" w-full h-12 rounded-xl border border-black/20 bg-white px-4 pr-11 text-black placeholder:text-black/40 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition "
            />
            <button
              type="button"
              className=" absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-purple-700 transition "
              aria-label="Search"
            >
              <Search />
            </button>
          </div>
          <div className="flex flex-row gap-4">
            <button className="text-gray-600 hover:text-purple-700 transition ">
              <BellDot size={24} />
            </button>
            <Image
              src={profile}
              alt="profile"
              className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-gray-700"
            ></Image>
          </div>
        </header>
        {/* Divider */}
        <div className="mt-3 h-px w-full bg-gray-400" />
      </div>
    </section>
  );
}
