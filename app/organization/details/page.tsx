"use client";

import { useEffect, useState } from "react";
import {
  handleGetMyOrganizationDetails,
} from "../../../lib/actions/organization/organization-action";
import OrganizationProfile from "./_components/OrganizationProfile";
import Link from "next/link";
import { OrganizationData } from "@/types/organization.types"; 

export default function OrganizationDashboard() {
  const [data, setData] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrganizationDetails();
  }, []);

  const fetchOrganizationDetails = async () => {
    try {
      const result = await handleGetMyOrganizationDetails();
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.message || "Failed to fetch organization details");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organization details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-8 rounded-xl">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchOrganizationDetails}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No organization details found</p>
          <Link
            href="/organization/details/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Organization Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <OrganizationProfile data={data} />
    </div>
  );
}