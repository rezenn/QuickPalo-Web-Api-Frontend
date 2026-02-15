// import OrganizationsDetailsCard from "../_component/OrganizationDetailCard";
// import OrganizationFilter from "../_component/OrganizationFilter";

// export default function Organizations() {
//   return (
//     <div>
//       {/* <h1 className=" px-2 pb-3 text-2xl font-semibold ">Organizations</h1> */}
//       <div className="flex flex-row overflow-x-auto pb-5">
//         <OrganizationFilter />
//       </div>
//       <div className="flex flow-col overflow-y-auto pb-5">
//         <OrganizationsDetailsCard />
//       </div>
//     </div>
//   );
// }

// app/dashboard/organization/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  handleGetMyOrganizationDetails,
  handleUpdateOrganizationDetails,
} from "../../../lib/actions/organization/organization-action";
import { OrganizationData } from "@/types/organization.types";

export default function OrganizationDashboard() {
  const [organization, setOrganization] = useState<OrganizationData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrganizationDetails();
  }, []);

  const loadOrganizationDetails = async () => {
    try {
      const result = await handleGetMyOrganizationDetails();
      if (result.success) {
        setOrganization(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to load organization details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: Partial<OrganizationData>) => {
    const result = await handleUpdateOrganizationDetails(data);
    if (result.success) {
      setOrganization(result.data);
      alert("Organization details updated successfully");
    } else {
      alert(result.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!organization) return <div>No organization details found</div>;

  return (
    <div>
      <h1>Organization Dashboard</h1>
      <pre>{JSON.stringify(organization, null, 2)}</pre>
    </div>
  );
}
