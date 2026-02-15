"use client";

import Image from "next/image";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { handleGetAllOrganizations } from "@/lib/actions/organization/organization-action";
import Link from "next/link";
import { OrganizationData } from "@/types/organization.types";
import building from "@/app/assets/images/clinicsFeatures.jpg"; // Default fallback image

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export default function OrganizationsDetailsCard() {
  const [organizations, setOrganizations] = useState<OrganizationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const result = await handleGetAllOrganizations();
      if (result.success && result.data) {
        setOrganizations(result.data);
      } else {
        setError(result.message || "Failed to fetch organizations");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const getProfileImageUrl = (
    organization: OrganizationData,
  ): string | null => {
    if (imageErrors[organization._id]) {
      return null;
    }

    let profilePicture = organization.user?.profilePicture;
    if (!profilePicture) {
      return null;
    }

    if (profilePicture.startsWith("http")) {
      return profilePicture;
    }

    // Construct the URL
    return `${API_BASE_URL}/uploads/profile/${profilePicture}`;
  };

  const handleImageError = (organizationId: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [organizationId]: true,
    }));
  };

  const getWorkingHoursDisplay = (workingHours: any[]) => {
    if (!workingHours || workingHours.length === 0) {
      return "Hours not available";
    }

    const today = new Date().getDay();
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const todayDay = days[today];
    const todayHours = workingHours.find((h) => h.day === todayDay);

    if (todayHours?.isWorking) {
      return `${todayHours.openingTime} - ${todayHours.closingTime}`;
    }
    return "Closed Today";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchOrganizations}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-gray-600">No organizations found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-6 px-2">
      {organizations.map((organization) => {
        const profileImageUrl = getProfileImageUrl(organization);

        return (
          <Link
            key={organization._id}
            href={`/user/organization/${organization._id}`}
            className="w-full h-[375px] bg-black/10 rounded-xl p-2 shadow-lg flex flex-col items-center hover:shadow-2xl"
          >
            <div className="w-full h-[202px] relative rounded-xl overflow-hidden border border-gray-500">
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt={organization.organizationName}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  onError={() => handleImageError(organization._id)}
                  unoptimized // Add this if images are from external domain
                />
              ) : (
                <Image
                  src={building}
                  alt={organization.organizationName}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
            <div className="w-full mt-2 text-sm space-y-1">
              <h1 className="font-semibold text-lg my-1 line-clamp-1">
                {organization.organizationName}
              </h1>
              <div className="flex flex-row gap-1">
                <MapPinIcon className="w-5 text-red-600 flex-shrink-0" />
                <p className="line-clamp-1">
                  {organization.street}, {organization.city}
                </p>
              </div>
              <div className="flex flex-row gap-1">
                <ClockIcon className="w-5 text-gray-600 flex-shrink-0" />
                <p className="line-clamp-1">
                  {getWorkingHoursDisplay(organization.workingHours)}
                </p>
              </div>
              <div className="h-px w-full bg-gray-400"></div>
              <p className="line-clamp-3 overflow-hidden text-sm">
                {organization.description || "No description available"}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
