"use client";
import Link from "next/link";

import Image from "next/image";
import { useState, useEffect } from "react";
import { handleGetAllOrganizations } from "@/lib/actions/organization/organization-action";
import { OrganizationData } from "@/types/organization.types";
import building from "@/app/assets/images/buildingPlaceholder.jpg";
import { usePathname } from "next/navigation";

export default function SmallCard() {
  const [organizations, setOrganizations] = useState<OrganizationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pathname = usePathname();

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

    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profile/${profilePicture}`;
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
        <div className="flex justify-center items-center animate-spin rounded-full  h-8 w-8 border-b-2 border-purple-600"></div>
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
    <div className="flex flex-row justify-start w-full  m-2 mb-0 space-x-6 ">
      {organizations.map((organization) => {
        const profileImageUrl = getProfileImageUrl(organization);

        return (
          <Link
            key={organization._id}
            href={`/user/organization/${organization._id}?returnTo=${encodeURIComponent(pathname)}`}
            className="w-50 h-45 border-black/5 rounded-md p-2 my-2 shadow-lg flex flex-col items-start hover:shadow-xl"
          >
            <div className="w-45 h-33.75 relative rounded-xl overflow-hidden ">
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt={organization.organizationName}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  onError={() => handleImageError(organization._id)}
                  unoptimized
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
            <p className="font-semibold my-2 line-clamp-1">
              {organization.organizationName}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
