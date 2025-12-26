import Link from "next/link";
import RecentViewCard from "../_component/RecentViewCard";
import OrganizationsDetailsCard from "../_component/OrganizationDetailCard";
import FiltersBar from "../_component/FiltersBar";

export default function Dashboard() {
  return (
    <div>
      {" "}
      <h2 className=" px-2 text-lg font-semibold ">Recently Viewed</h2>
      <div className="h-full space-y-6">
        <div className="flex flex-row overflow-x-auto pb-2">
          <RecentViewCard />
        </div>
        <FiltersBar />
        <div className="flex flow-col overflow-y-auto">
          <OrganizationsDetailsCard />
        </div>
      </div>
    </div>
  );
}
