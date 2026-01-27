import OrganizationsDetailsCard from "../_component/OrganizationDetailCard";

export default function Organizations() {
  return (
    <div>
      <h1 className=" px-2 pb-3 text-2xl font-semibold ">Organizations</h1>
      <div className="flex flow-col overflow-y-auto pb-5">
        <OrganizationsDetailsCard />
      </div>
    </div>
  );
}
