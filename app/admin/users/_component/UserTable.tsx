"use client";

import profile from "@/app/assets/images/profile.png";
import {
  Search,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
  Plus,
  TrendingUpIcon,
  User as UserIcon,
  Users as UsersIcon,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { getAllUsers } from "@/lib/api/admin/user";

export default function UserTable() {
  const { user, loading } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsersThisMonth, setNewUsersThisMonth] = useState(0);
  const [newUsersLastMonth, setNewUsersLastMonth] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const result = await getAllUsers();

      if (result.success) {
        const normalUsers = result.data.filter(
          (user: any) => user.role === "user",
        );
        setUsers(normalUsers);
        setFilteredUsers(normalUsers);
        setTotalUsers(normalUsers.length);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = new Date().getMonth();

        const newThisMonth = normalUsers.filter((user: any) => {
          const userDate = new Date(user.createdAt);
          const userYear = userDate.getFullYear();
          const userMonth = userDate.getMonth();

          return userYear === currentYear && userMonth === currentMonth;
        }).length;
        setNewUsersThisMonth(newThisMonth);

        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        const lastMonthYear = lastMonthDate.getFullYear();
        const lastMonth = lastMonthDate.getMonth();

        const newLastMonth = normalUsers.filter((user: any) => {
          const userDate = new Date(user.createdAt);
          const userYear = userDate.getFullYear();
          const userMonth = userDate.getMonth();

          return userYear === lastMonthYear && userMonth === lastMonth;
        }).length;

        setNewUsersLastMonth(newLastMonth);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      // Add delete API
      const updatedUsers = users.filter((user) => user._id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setTotalUsers(updatedUsers.length);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.phoneNumber?.includes(searchQuery),
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (error) {
      return "Invaild Date";
    }
  };
  const getProfileImageUrl = (user: any) => {
    if (!user) return profile.src;

    // Check imageUrl first
    if (user.imageUrl) {
      return user.imageUrl;
    }

    if (user.profilePicture) {
      return `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "")}/uploads/profile/${user.profilePicture}`;
    }

    return null;
  };
  return (
    <div className="space-y-6 p-6">
      {/* Control Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <div className="relative">
              <input
                type="search"
                placeholder="Search user"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 sm:h-12 rounded-xl border border-black/20 bg-white px-3 sm:px-4 pr-10 text-sm sm:text-base text-black placeholder:text-black/40 focus:outline-none focus:border-black-600 focus:ring-2 transition"
              />
              <button
                type="button"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-purple-700 transition"
              >
                <Search size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200 border-b border-gray-200">
                <tr>
                  {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                    S.N
                  </th> */}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                    Registered Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                    Last Updated Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-9 py-8 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="h-12 w-12 shrink-0 relative rounded-full overflow-hidden  ">
                            {getProfileImageUrl(user) ? (
                              <Image
                                src={getProfileImageUrl(user)}
                                alt={user.fullName}
                                fill
                                className="object-cover"
                                unoptimized
                                priority
                                onError={(e) => {
                                  e.currentTarget.src = "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-purple-100 to-pink-100  rounded-full border-2 border-fuchsia-400">
                                <UserIcon
                                  className="text-purple-400"
                                  size={32}
                                />
                              </div>
                            )}
                          </div>
                          <div className="gap-1">
                            <div
                              className="text-sm font-semibold text-gray-900"
                              style={{ textTransform: "capitalize" }}
                            >
                              {user.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {user._id.substring(0, 12)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 align-middle whitespace-nowrap">
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-gray-400 shrink-0" />
                          <span className="text-gray-900 truncate w-30">
                            {user.email}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 align-middle whitespace-nowrap">
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-gray-400 shrink-0" />
                          <span className="text-gray-600">
                            {user.phoneNumber || "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 align-middle whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400 shrink-0" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400 shrink-0" />
                          {formatDate(user.updatedAt)}
                        </div>
                      </td>

                      <td className="px-6 py-4 align-middle whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit user"
                            onClick={() =>
                              router.push(`/admin/users/edit-user/${user._id}`)
                            }
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete user"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
