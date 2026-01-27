"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, X } from "lucide-react";

import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { UpdateUserData, updateUserSchema } from "../update-user.schema";

export default function UpdateUserForm({ user }: { user: any }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      phoneNumber: user?.phoneNumber ?? "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: UpdateUserData) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      if (data.image) formData.append("image", data.image);

      const res = await handleUpdateProfile(formData);
      if (!res.success) throw new Error(res.message);

      setPreviewImage(null);
    } catch (err: any) {
      setError(err.message || "Profile update failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-white shadow-xl rounded-2xl p-6 border">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden border">
              {previewImage ? (
                <img
                  src={previewImage}
                  className="w-full h-full object-cover"
                />
              ) : user?.imageUrl ? (
                <Image
                  src={process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
              )}
            </div>

            {/* Hover upload */}
            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full cursor-pointer transition">
              <Camera className="text-white" />
              <Controller
                name="image"
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
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <Input
            label="Phone Number"
            error={errors.phoneNumber?.message}
            {...register("phoneNumber")}
          />

          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Small reusable input ---------- */
function Input({ label, error, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...props}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
