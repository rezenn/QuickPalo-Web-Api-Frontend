import Image from "next/image";
import logo from "@/app/assets/images/quickpalo_logo.png";
import profile from "@/app/assets/images/profile.png";
import { Search, BellDot } from "lucide-react";

export default function Header() {
  return (
    <section>
      <div className="max-w-screen mx-auto pl-2 pr-5 py-4 ">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* logo */}
          <div className="flex items-center gap-2">
            <Image
              src={logo}
              alt="logo"
              className="w-[230px] h-auto rounded-bl-2xl rounded-tr-2xl"
              priority
            />
            <div className="px-5 flex flex-col leading-tight">
              <span className="text-fuchsia-700 text-lg">Hello,</span>
              <span className="font-extrabold text-2xl">Text User</span>
            </div>
          </div>
          {/* Search */}
          <div className="relative w-full max-w-3xl">
            <input
              type="search"
              placeholder="Search…"
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
            <button className="text-gray-600 hover:text-purple-700 ">
              <BellDot size={24} />
            </button>
            <Image
              src={profile}
              alt="profile"
              className="h-[50px] w-[50px] rounded-4xl border border-gray-700 "
            ></Image>
          </div>
        </header>
        {/* Divider */}
        <div className="mt-3 h-px w-full bg-gray-400" />
      </div>
    </section>
  );
}
