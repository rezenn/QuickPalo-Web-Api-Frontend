import Image from "next/image";
import { OrganizationsData } from "@/app/constants/organizations";

export default function SmallCard() {
  return (
    <div className="flex flex-row justify-start w-full  space-x-6">
      {OrganizationsData.map((organization) => (
        <div
          className="w-[200px] h-[180px] bg-black/10 rounded-xl p-2 my-2 shadow-lg flex flex-col items-start"
          key={organization.id}
        >
          <div className="w-[180px] h-[135px] relative rounded-xl overflow-hidden border border-gray-500">
            <Image
              src={organization.image}
              alt={organization.title}
              fill
              style={{ objectFit: "cover" }}
              sizes="180px"
            />
          </div>
          <p className="font-semibold my-2">{organization.title}</p>
        </div>
      ))}
    </div>
  );
}
