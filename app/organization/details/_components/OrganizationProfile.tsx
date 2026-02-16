"use client";

import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Clock,
  Calendar,
  Edit,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import building from "@/app/assets/images/buildingPlaceholder.jpg";
import { OrganizationData } from "@/types/organization.types";
import { useState, useEffect } from "react";
import { handleGetMyOrganizationDetails } from "@/lib/actions/organization/organization-action";
import { useAuth } from "@/context/authContext";

export default function OrganizationProfile() {
  const [organization, setOrganization] = useState<OrganizationData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    try {
      const result = await handleGetMyOrganizationDetails();
      if (result.success && result.data) {
        setOrganization(result.data);
      } else {
        setError(result.message || "Failed to fetch organizations");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const getProfileImageUrl = () => {
    if (!user) return null;

    if (user.imageUrl) {
      return user.imageUrl;
    }

    if (user.profilePicture) {
      return `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "")}/uploads/profile/${user.profilePicture}`;
    }

    return null;
  };

  const formatDay = (day: string) => day.charAt(0).toUpperCase() + day.slice(1);

  const daysOrder = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

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
          onClick={fetchOrganization}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-gray-600">No organization found</p>
      </div>
    );
  }

  const profileImageUrl = getProfileImageUrl();
  const sortedWorkingHours = [...organization.workingHours].sort(
    (a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day),
  );

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-gray-100">
        <div className="flex items-start justify-between ">
          <div className="flex items-center gap-4">
            <div className="relative w-25 h-25 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full rounded-full border-3 border-fuchsia-400 shadow-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                {profileImageUrl && !imageError ? (
                  <Image
                    src={profileImageUrl}
                    alt={organization.organizationName}
                    fill
                    sizes="80px"
                    className="object-cover rounded-full"
                    unoptimized
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <Image
                    src={building}
                    alt={organization.organizationName}
                    fill
                    sizes="80px"
                    className="object-cover rounded-full"
                    loading="eager"
                  />
                )}
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {organization.organizationName}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {organization.organizationType
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>

                {organization.isActive ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link
            href="/organization/details/edit"
            className="bg-[#B61BE1] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Edit size={18} />
            <span>Edit Details</span>
          </Link>
        </div>

        {organization.description && (
          <p className="mt-6 text-gray-600 border-t pt-4">
            {organization.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 ">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Contact Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{organization.contactEmail}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>
                {organization.contactPhone || organization.user.phoneNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 ">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Location
          </h2>
          <div className="space-y-2 text-gray-600">
            <p>{organization.street}</p>
            <p>
              {organization.city}, {organization.state}
            </p>
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Working Hours
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedWorkingHours.map((hour) => (
            <div
              key={hour._id}
              className={`p-3 rounded-lg ${
                hour.isWorking ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="font-medium text-gray-900">
                {formatDay(hour.day)}
              </div>
              {hour.isWorking ? (
                <div className="text-sm text-gray-600">
                  {hour.openingTime} - {hour.closingTime}
                </div>
              ) : (
                <div className="text-sm text-red-600">Closed</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Departments */}
      {organization.departments.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Departments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organization.departments.map((dept) => (
              <div
                key={dept._id}
                className="border border-gray-300 bg-blue-50 rounded-lg px-4 py-2"
              >
                <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                {dept.description && (
                  <div>
                    <p className="text-sm text-gray-600 mt-1">
                      {dept.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointment Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 ">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Appointment Settings
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">
                {organization.appointmentDuration} minutes
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Advance Booking:</span>
              <span className="font-medium">
                {organization.advanceBookingDays} days
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 ">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Total Time Slots:</span>
              <span className="font-medium">
                {organization.timeSlots.length}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Available Slots:</span>
              <span className="font-medium text-green-600">
                {
                  organization.timeSlots.filter((slot) => slot.isAvailable)
                    .length
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Departments:</span>
              <span className="font-medium">
                {organization.departments.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Time Slots */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {organization.timeSlots.map((slot) => (
            <div
              key={slot._id}
              className={`p-2 text-center rounded-lg text-sm ${
                slot.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {slot.startTime} - {slot.endTime}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
