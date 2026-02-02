"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getOneUser } from "@/lib/api/auth";
import { useAuth } from "@/context/authContext";
import { AlertCircle, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentAdmin, loading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = params.id as string;

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    if (!userId) {
      setError("User ID is required");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch user data by ID from your API
      const result = await getOneUser(userId);

      if (result.success) {
        setUserData(result.data);
      } else {
        setError(result.message || "Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("An error occurred while fetching user data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }
// 
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No user data found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="pb-5">
        <Link
          className=" w-20 h-10 px-2 flex flex-row justify-center items-center gap-2 rounded-2xl bg-fuchsia-100 border border-fuchsia-300 hover:bg-fuchsia-300"
          href="/admin/users"
        >
          <ArrowLeft />
          <p>Back</p>
        </Link>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Edit User
        </h1>
        <p className="text-gray-600 mt-2">
          Update the the information of{" "}
          <span style={{ textTransform: "capitalize" }}>
            {userData.fullName}
          </span>
        </p>
      </div>

      <div className="bg-linear-to-br from-white via-white to-purple-50 shadow-2xl rounded-3xl overflow-hidden border border-purple-100">
        <div className="bg-white rounded-lg shadow p-6">
          <form className="mt-6 space-y-4">
            <div className="relative group">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Full Name
              </label>{" "}
              <div className="relative">
                <input
                  type="text"
                  defaultValue={userData.fullName}
                  className="w-full bg-linear-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 group-hover:border-purple-300"
                  style={{ textTransform: "capitalize" }}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  defaultValue={userData.email}
                  disabled
                  className="w-full bg-linear-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-500 cursor-not-allowed"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
              <AlertCircle size={14} />
              Email address cannot be changed for security reasons
            </p>
            <div className="relative group">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="phoneNumber"
                  defaultValue={userData.phoneNumber}
                  className="w-full bg-linear-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 group-hover:border-purple-300"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                // disabled={isSubmittingState || !hasChanges}
                className="flex-1 bg-[#B61BE1] text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {/* {isSubmittingState ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Updating...
                    </>
                  ) : ( */}
                <>
                  <Save size={18} />
                  Update Profile
                </>
                {/* )} */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
