"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { OrganizationsData } from "@/app/constants/organizations";
import Image from "next/image";
import {
  MapPinIcon,
  PhoneIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import OrganizationSidebar from "../../_component/OrganizationSidebar";

interface Params {
  params: { title: string };
}

export default async function OrganizationDetail({ params }: Params) {
  // unwrap params if it is a Promise
  const resolvedParams = await params;

  const decodedTitle = decodeURIComponent(resolvedParams.title);
  const organization = OrganizationsData.find(
    (org) => org.title === decodedTitle
  );

  if (!organization) return <p>Organization not found</p>;

  return (
    <div className="flex flex-row gap-5">
      <div className=" max-w-[650px] mx-2">
        <div className="w-[650px] h-[340px] relative rounded-xl overflow-hidden mb-4">
          <Image
            src={organization.image}
            alt={organization.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className=" max-h-[280px] h-[280px] flex flex-col gap-4 mb-2 p-2 rounded-2xl bg-black/5 border-2 border-gray-400">
          <div className="w-full mt-2 text-sm space-y-1 ">
            <div className="flex flex-row justify-between">
              <div className="space-y-2">
                <h1 className="font-semibold text-xl my-1 mb-3 line-clamp-1">
                  {organization.title}
                </h1>
                <div className="flex flex-row">
                  <MapPinIcon className="w-5 text-red-600" />
                  <p>&nbsp;{organization.location}</p>
                </div>
                <div className="flex flex-row">
                  <ClockIcon className="w-5 text-gray-600" />
                  <p>&nbsp;{organization.time}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button className="m-2 p-2 h-13 flex flex-col items-center justify-center w-auto border border-gray-500 rounded-xl bg-gray-300 hover:bg-fuchsia-700 hover:text-white ">
                  <PhoneIcon className="w-8 h-auto" />
                  Call
                </button>
                <button className="m-2 p-2 h-13 flex flex-col items-center justify-center w-auto border border-gray-500 rounded-xl bg-gray-300 hover:bg-fuchsia-700 hover:text-white ">
                  <ChatBubbleLeftEllipsisIcon className="w-8 h-auto" />
                  Message
                </button>
              </div>
            </div>
            <div className="h-px w-full bg-gray-400"></div>
            <p className="line-clamp-3 overflow-hidden text-sm ">
              {organization.description}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start">
        <div className="w-xl">
          <OrganizationSidebar
            departments={organization.departments}
            timeSlots={organization.timeSlots}
          />
        </div>
        {/* Divider */}
        <div className="mt-3 h-px w-xl bg-gray-400" />

        <div className="my-5 flex items-center justify-center">
          <button className=" h-12 w-lg px-5 py-2 text-white inline-flex items-center justify-center rounded-md bg-purple-700 hover:bg-fuchsia-700 hover:rounded-4xl border border-gray-600 shadow-2xl transition-all duration-300 ease-out ">
            Book an Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
