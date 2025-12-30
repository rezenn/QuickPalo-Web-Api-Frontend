import Link from "next/link";
import RecentViewCard from "../_component/RecentViewCard";
import OrganizationsDetailsCard from "../_component/OrganizationDetailCard";
import OrganizationFilter from "../_component/OrganizationFilter";

export default function Dashboard() {
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
