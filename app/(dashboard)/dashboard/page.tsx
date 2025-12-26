import Link from "next/link";
import RecentViewCard from "../_component/RecentViewCard";
import OrganizationsDetailsCard from "../_component/OrganizationDetailCard";

export default function Dashboard() {
  return (
    <div className="h-full space-y-6">
      <h2 className=" px-2 text-lg font-semibold ">Recently Viewed</h2>
      <div className="flex flex-row overflow-x-auto">
        <RecentViewCard />
      </div>
      <div className="flex flow-col overflow-y-auto">
        <OrganizationsDetailsCard />
      </div>
    </div>
  );
}
