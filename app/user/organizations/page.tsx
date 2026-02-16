import OrganizationsDetailsCard from "../_component/OrganizationDetailCard";
import OrganizationFilter from "../_component/OrganizationFilter";

export default function Organizations() {
  return (
    <div>
      <div className="flex flex-row overflow-x-auto pb-5">
        <OrganizationFilter />
      </div>
      <div className="flex flow-col overflow-y-auto pb-5">
        <OrganizationsDetailsCard />
      </div>
    </div>
  );
}
