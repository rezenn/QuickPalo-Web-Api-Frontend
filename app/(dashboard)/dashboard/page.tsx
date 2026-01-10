"use client";

import Link from "next/link";
import RecentViewCard from "../_component/RecentViewCard";
import OrganizationsDetailsCard from "../_component/OrganizationDetailCard";
import OrganizationFilter from "../_component/OrganizationFilter";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Dashboard() {
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);
  if (!hydrated) return null;

  return (
    <div>
      {" "}
      <h2 className=" px-2 text-lg font-semibold ">Recently Viewed</h2>
      <div className="h-full space-y-6">
        <div className="flex flex-row overflow-x-auto pb-2">
          <RecentViewCard />
        </div>
        <OrganizationFilter />
        <div className="flex flow-col overflow-y-auto pb-5">
          <OrganizationsDetailsCard />
        </div>
      </div>
    </div>
  );
}
