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
import { getAllUsers } from "@/lib/api/admin/user";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import UserTable from "./_component/UserTable";

export default function AdminUsersPage() {
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
      const result = await getAllUsers(1, 100, "", "user");

      if (result.success) {
        const normalUsers = Array.isArray(result.data?.users)
          ? result.data.users.filter((user: any) => user.role === "user")
          : [];
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage all registered users</p>
        </div>
        <button
          className="px-4 py-2 rounded-lg flex items-center gap-2 bg-fuchsia-200/50 hover:bg-fuchsia-200 text-gray-900 font-medium transition-colors duration-200 shadow-sm hover:shadow border border-fuchsia-400/40"
          onClick={() => router.push("/admin/users/create-user")}
        >
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
        <div className="bg-linear-to-br from-fuchsia-50 to-fuchsia-100 border border-fuchsia-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-700">
                New Last Month
              </p>
              <p className="text-3xl font-bold text-fuchsia-900 mt-2">
                {newUsersLastMonth}
              </p>
            </div>
            <div className="bg-fuchsia-600 p-3 rounded-full">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div
          className={`${newUsersThisMonth > newUsersLastMonth ? "bg-linear-to-br from-green-50 to-green-100 border-green-200 text-green-700" : "bg-linear-to-br from-red-50 to-red-100 border-red-200 text-red-700"} border  rounded-xl p-6`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Growth Rate</p>
              <p
                className={`text-2xl font-bold ${newUsersThisMonth > newUsersLastMonth ? "text-green-600" : "text-red-600"}`}
              >
                {newUsersLastMonth > 0
                  ? `${Math.round(((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100)}%`
                  : newUsersThisMonth > 0
                    ? "100%"
                    : "0%"}
              </p>
            </div>
            <div className="bg-teal-600 p-3 rounded-full">
              <TrendingUpIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <UserTable />
    </div>
  );
}
