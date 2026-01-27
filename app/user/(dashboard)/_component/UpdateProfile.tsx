"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, User, X } from "lucide-react";

import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { UpdateUserData, updateUserSchema } from "../update-user.schema";
import { useAuth } from "@/context/authContext";

export default function UpdateUserForm({ initialUser }: { initialUser: any }) {
  const { user, refreshUser, updateUserData } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: initialUser?.fullName ?? "",
      email: initialUser?.email ?? "",
      phoneNumber: initialUser?.phoneNumber ?? "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: UpdateUserData) => {
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      if (data.profileImage) {
        formData.append("profilePicture", data.profileImage);
      }

      const res = await handleUpdateProfile(formData);

      if (!res.success) throw new Error(res.message);

      if (res.data) {
        updateUserData(res.data);
      }

      await refreshUser();

      setPreviewImage(null);
      setSuccess("Profile updated successfully!");

      if (res.data) {
        setValue("fullName", res.data.fullName || "");
        setValue("email", res.data.email || "");
        setValue("phoneNumber", res.data.phoneNumber || "");
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      console.error("Update error:", err);
      setError(err.message || "Profile update failed");
    }
  };

  const getProfileImageUrl = () => {
    if (previewImage) return previewImage;

    const currentUser = user;

    if (currentUser?.imageUrl) {
      return currentUser.imageUrl;
    }

    if (currentUser?.profilePicture) {
      return `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profile/${currentUser.profilePicture}`;
    }

    return null;
  };

  const profileImageUrl = getProfileImageUrl();

  return (
    <div className="max-w-xl mx-auto mt-10 ">
      <div className="bg-white shadow-2xl rounded-2xl p-6 border border-gray-400 ">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>

        {success && (
          <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="w-32 h-32  rounded-full overflow-hidden border-2 border-fuchsia-400 relative bg-gray-100">
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                  onError={(e) => {
                    console.error("Image failed to load:", profileImageUrl);
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                  <User className="text-purple-500" size={40} />
                  <span className="text-gray-500 text-sm mb-1">No Image</span>
                  {/* <Camera className="text-gray-400" size={24} /> */}
                </div>
              )}
            </div>

            {/* Hover upload */}
            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300">
              <Camera className="text-white" size={24} />
              <Controller
                name="profileImage"
                control={control}
                render={({ field: { onChange } }) => (
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setPreviewImage(URL.createObjectURL(file));
                      onChange(file);
                    }}
                  />
                )}
              />
            </label>

            {previewImage && (
              <button
                type="button"
                onClick={() => {
                  setPreviewImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                title="Remove image"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              {...register("fullName")}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register("email")}
              disabled
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              {...register("phoneNumber")}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-600 mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
