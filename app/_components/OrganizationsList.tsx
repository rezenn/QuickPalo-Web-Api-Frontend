"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { getAuthToken } from "@/lib/auth-utils"; // Import this
import { toast } from "sonner";

interface Organization {
  _id: string;
  organizationName: string;
  user: {
    _id: string;
    fullName: string;
    profilePicture?: string;
  };
}

export default function OrganizationsList() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const token = await getAuthToken();

        const res = await fetch(
          "http://localhost:5050/api/auth/organizations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        if (data.success) {
          setOrganizations(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const sendDirectMessage = async (orgUserId: string, orgName: string) => {
    if (!user) return;

    setSending(orgUserId);

    try {
      const token = await getAuthToken();

      const response = await fetch(
        "http://localhost:5050/api/auth/send-to-org",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orgUserId,
            message: `Hello ${orgName}! I'd like to get in touch.`,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        toast.success(
          `Message sent to ${orgName}!\nCheck Direct Messages tab.`,
        );
      } else {
        toast.error(`Failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Network error. Please check your connection.");
    } finally {
      setSending(null);
    }
  };

  if (loading) {
    return <div className="p-12 text-center">Loading organizations...</div>;
  }

  return (
    <div className="min-h-screen bg-white-50 py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-20">
          <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
            Organizations
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Send direct messages to start 1:1 conversations instantly
          </p>
        </div>

        {organizations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No organizations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {organizations.map((org) => (
              <div
                key={org._id}
                className="group bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 p-12 cursor-pointer"
              >
                <div className="w-32 h-32 mx-auto mb-10 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-indigo-500/20 group-hover:scale-110 transition-all duration-500 border-4 border-white/60 shadow-2xl">
                  <img
                    src={
                      org.user.profilePicture
                        ? `http://localhost:5050/uploads/profile/${org.user.profilePicture}`
                        : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iOCIgZmlsbD0iIzZCMzI4MCIvPgo8L3N2Zz4K"
                    }
                    alt={org.organizationName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <h3 className="text-4xl font-black text-gray-900 mb-6 text-center group-hover:text-blue-600 transition-all duration-300">
                  {org.organizationName}
                </h3>
                <p className="text-2xl text-gray-600 mb-12 text-center">
                  {org.user.fullName}
                </p>

                <button
                  onClick={() =>
                    sendDirectMessage(org.user._id, org.organizationName)
                  }
                  disabled={sending === org.user._id}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-8 px-12 rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 flex items-center justify-center gap-4 group-hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
                >
                  {sending === org.user._id ? (
                    <>
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      📤 Send First Message
                      <span className="text-lg opacity-90">
                        (Creates 1:1 chat)
                      </span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-24 text-center bg-white/60 backdrop-blur-xl rounded-3xl p-12 border border-white/50 shadow-2xl">
          <h3 className="text-3xl font-black text-gray-800 mb-6">
            🎉 How it works:
          </h3>
          <div className="grid md:grid-cols-3 gap-8 text-lg text-gray-700">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mb-4">
                <span className="text-3xl">1️⃣</span>
              </div>
              <p>Click "Send First Message"</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mb-4">
                <span className="text-3xl">2️⃣</span>
              </div>
              <p>Check Direct Messages tab</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mb-4">
                <span className="text-3xl">3️⃣</span>
              </div>
              <p>Organization receives instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
