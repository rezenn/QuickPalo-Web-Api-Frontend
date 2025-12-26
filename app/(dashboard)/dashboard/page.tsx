import Link from "next/link";
import SmallCard from "../_component/SmallCard";

export default function Dashboard() {
  return (
    <div className="h-full space-y-6">
      <h2 className=" px-2 text-lg font-semibold ">Recently Viewed</h2>
      <div className="flex flex-row overflow-x-auto">
        <SmallCard />
      </div>
    </div>
  );
}
