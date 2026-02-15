"use client";
import Link from "next/link";

import Image from "next/image";
import { OrganizationsData } from "@/app/constants/organizations";

export default function SmallCard() {
  return (
    <div className="flex flex-row justify-start w-full  m-2 mb-0 space-x-6 ">
      {OrganizationsData.map((organization) => (
        <Link
          key={organization.id}
          href={`/organization/${encodeURIComponent(organization.title)}`}
          className="w-50 h-45 bg-black/10 rounded-xl p-2 my-2 shadow-lg flex flex-col items-start hover:shadow-2xl"
        >
          <div className="w-45 h-33.75 relative rounded-xl overflow-hidden border border-gray-500">
            <Image
              src={organization.image}
              alt={organization.title}
              fill
              style={{ objectFit: "cover" }}
              sizes="180px"
            />
          </div>
          <p className="font-semibold my-2 line-clamp-1">
            {organization.title}
          </p>
        </Link>
      ))}
    </div>
  );
}
