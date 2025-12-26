import Image from "next/image";
import { OrganizationsData } from "@/app/constants/organizations";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
export default function OrganizationsDetailsCard() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 w-full  gap-6">
      {OrganizationsData.map((organization) => (
        <div
          className="w-full h-[375px] bg-black/10 rounded-xl p-2 my-2 shadow-lg flex flex-col items-center "
          key={organization.id}
        >
          <div className="w-full h-[202px] relative rounded-xl overflow-hidden border border-gray-500">
            <Image
              src={organization.image}
              alt={organization.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="w-full mt-2 text-sm space-y-1 ">
            <p className="font-semibold text-lg my-1">{organization.title}</p>
            <div className="flex flex-row">
              <MapPinIcon className="w-5 text-red-600" />
              <p>&nbsp;{organization.location}</p>
            </div>
            <div className="flex flex-row">
              <ClockIcon className="w-5 text-gray-600" />
              <p>&nbsp;{organization.time}</p>
            </div>
            <div className="h-px w-full bg-gray-400"></div>
            <p className="line-clamp-3 overflow-hidden text-sm">
              {organization.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
