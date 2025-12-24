import Image from "next/image";

import authImg from "@/app/assets/images/authIllustration.png";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-screen">
      <div className="h-full w-full grid md:grid-cols-2 md:gap-0">
        <div className="relative hidden md:block h-full overflow-hidden">
          <Image src={authImg} alt="img" width={200} height={200}></Image>
        </div>

        <div className="flex h-full items-center justify-center px-4 md:px-10">
          <div className="w-full max-w-md rounded-xl border border-black/10 dark:border-white/10 bg-background/80 supports-[backdrop-filter]:backdrop-blur p-6 shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
