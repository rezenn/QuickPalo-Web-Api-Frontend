"use server";
import { revalidatePath } from "next/cache";
import {
  getAllUsers,
  getOneUser,
  createUser,
  deleteUser,
} from "../../api/admin/user";
import { setAuthToken, setUserData } from "../../cookie";

export async function handleGetAllUsers() {
  try {
    const result = await getAllUsers();
    if (result.success) {
      return {
        success: true,
        message: "all user data fetched successful",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "all user data fetch failed",
      data: result.data,
    };
  } catch (err: Error | any) {
    return { success: false, message: err.message };
  }
}
export async function handleGetOneUser(userId: string) {
  try {
    const result = await getOneUser(userId);
    if (result.success) {
      return {
        success: true,
        message: "user data fetched successful",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "user data fetch failed",
      data: result.data,
    };
  } catch (err: Error | any) {
    return { success: false, message: err.message };
  }
}

export async function handleDeleteUser(userId: string) {
  try {
    const result = await deleteUser(userId);
    if (result.success) {
      revalidatePath("/admin/users");
      return {
        success: true,
        message: "user deleted successful",
      };
    }
    return {
      success: false,
      message: result.message || "failed to delete user",
    };
  } catch (err: Error | any) {
    return {
      success: false,
      message: err.message || "An error occurred while deleting user",
    };
  }
}

export async function handleCreateUser(userData: FormData) {
  try {
    const fullName = userData.get("fullName") as string;
    const email = userData.get("email") as string;
    const phoneNumber = userData.get("phoneNumber") as string;
    const password = userData.get("password") as string;
    const confirmPassword = userData.get("confirmPassword") as string;

    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      return {
        success: false,
        message: "All fields are required",
      };
    }
    const result = await createUser(userData);

    if (result.success) {
      revalidatePath("admin/users");
      return {
        success: true,
        message: "User created successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to create user",
    };
  } catch (error: Error | any) {
    console.error("Create user error:", error);
    return {
      success: false,
      message: error.message || "An error occurred while creating user",
    };
  }
}
