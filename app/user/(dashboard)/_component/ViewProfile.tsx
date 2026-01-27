"use client";

import { useAuth } from "@/context/authContext";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "lucide-react";

export default function ViewProfile() {
  const { user, loading } = useAuth();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [user]);

  if (loading) return null;
  const getProfileImageUrl = () => {
    if (!user) return null;

    // Check imageUrl first
    if (user.imageUrl) {
      return user.imageUrl;
    }

    //  check profilePicture
    if (user.profilePicture) {
      return `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profile/${user.profilePicture}`;
    }

    return null;
  };

  const profileImageUrl = getProfileImageUrl();
  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-white shadow-2xl rounded-2xl p-6 border border-gray-200 flex flex-col items-center justify-center ">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
        <div className="relative h-12 w-12">
          <div className="relative h-30 w-30 rounded-full overflow-hidden border-2 border-fuchsia-400">
            {" "}
            {profileImageUrl && !imageError ? (
              <Image
                src={profileImageUrl}
                alt="Profile"
                fill
                className="object-cover"
                unoptimized
                onError={() => {
                  console.error(
                    "Header image failed to load:",
                    profileImageUrl,
                  );
                  setImageError(true);
                }}
                onLoad={() => console.log("Header image loaded")}
                sizes="48px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-purple-100 to-pink-100">
                <User className="text-purple-500" size={24} />
              </div>
            )}
          </div>
        </div>
        <div>
          <strong>{user?.fullName}.capitalize</strong>
        </div>
        <Link href="/user/profile/update-profile">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Update Profile
          </button>
        </Link>
      </div>
    </div>
  );
}
