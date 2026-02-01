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
  Users as UsersIcon,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/api/auth";
import { format } from "date-fns";

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsersThisMonth, setNewUsersThisMonth] = useState(0);

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
        const thisMonth = new Date().getMonth();
        const newThisMonth = normalUsers.filter((user: any) => {
          const userDate = new Date(user.createdAt);
          return userDate.getMonth() === thisMonth;
        }).length;
        setNewUsersThisMonth(newThisMonth);
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
      // Add your delete API call here
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

    return profile.src;
  };
  if (loading)
    return (
      <div>
        <div className="w-full gap-x-2 flex justify-center items-center">
          <div className="w-5 bg-[#d991c2] h-5 rounded-full animate-bounce"></div>
          <div className="w-5 h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
          <div className="w-5 h-5 bg-[#6756cc] rounded-full animate-bounce"></div>
        </div>
      </div>
    );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage all registered users</p>
        </div>
        <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2">
          <Plus size={18} />
          Add new user
        </button>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Users</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {totalUsers}
              </p>
            </div>
            <div className="bg-blue-600 p-3 rounded-full">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">
                New This Month
              </p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {newUsersThisMonth}
              </p>
            </div>
            <div className="bg-purple-600 p-3 rounded-full">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                    S.N
                  </th>
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
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
                      <td className="px-6 py-4 align-middle whitespace-nowrap">
                        <div className="flex items-center text-sm">
                          <span className="text-gray-900 truncate max-w-50">
                            {index + 1}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-4">
                          <div className="h-20 w-20 shrink-0 relative rounded-full overflow-hidden  ">
                            <Image
                              src={getProfileImageUrl(user)}
                              alt={user.fullName}
                              fill
                              className="object-cover"
                              unoptimized
                              priority
                              onError={(e) => {
                                e.currentTarget.src = profile.src;
                              }}
                            />
                          </div>
                          <div className="ml-3">
                            <div
                              className="text-sm font-semibold text-gray-900"
                              style={{ textTransform: "capitalize" }}
                            >
                              {user.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {user._id.substring(0, 15)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 align-middle whitespace-nowrap">
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-gray-400 shrink-0" />
                          <span className="text-gray-900 truncate max-w-50">
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
                        <div className="flex items-center space-x-2">
                          <Link href={`/admin/users/edit/${user._id}`}>
                            <button
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit user"
                            >
                              <Edit size={18} />
                            </button>
                          </Link>
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
