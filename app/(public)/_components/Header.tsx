"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/assets/images/quickpalo_logo.png";

export default function Header() {
  return (
    <header className="m-5">
      <div>
        <Image
          src={Logo}
          alt="Logo"
          className="w-full max-w-[200px] h-auto rounded-bl-2xl rounded-tr-2xl"
          priority
        />
      </div>
    </header>
  );
}
