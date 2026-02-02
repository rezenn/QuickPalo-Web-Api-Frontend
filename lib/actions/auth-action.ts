"use server";
import { revalidatePath } from "next/cache";
import {
  register,
  login,
  updateProfile,
  getUser,
  getAllUsers,
  getOneUser,
  createUser,
} from "../api/auth";
import { setAuthToken, setUserData } from "../cookie";

export async function handleRegister(resgistrationData: any) {
  try {
    const result = await register(resgistrationData);
    if (result.success) {
      return {
        success: true,
        message: "Register successful",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result?.message || "Registration failed",
    };
  } catch (error: Error | any) {
    return { success: false, message: error.message };
  }
}

export async function handleLogin(loginData: any) {
  try {
    const result = await login(loginData);
    if (result.success) {
      await setAuthToken(result.token);
      setUserData(result.data);
      return {
        success: true,
        message: "login successful",
        data: result.data,
      };
    }
    return { success: false, message: result.message || "Login failed" };
  } catch (error: Error | any) {
    return { success: false, message: error.message };
  }
}
export async function handleGetUser() {
  try {
    const result = await getUser();
    if (result.success) {
      return {
        success: true,
        message: "user data fetch successful",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "user data fetch failed",
    };
  } catch (err: Error | any) {
    return { success: false, message: err.message };
  }
}

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

export async function handleUpdateProfile(profileData: any) {
  try {
    const result = await updateProfile(profileData);

    if (result.success) {
      const userData = {
        _id: result.data._id,
        fullName: result.data.fullName,
        email: result.data.email,
        phoneNumber: result.data.phoneNumber,
        role: result.data.role,
        profilePicture: result.data.profilePicture,
        imageUrl: result.data.imageUrl,
        createdAt: result.data.createdAt,
        updatedAt: result.data.updatedAt,
      };

      // Store in cookies
      await setUserData(userData);

      // Revalidate paths
      revalidatePath("/user/profile");
      revalidatePath("/user/dashboard");

      return {
        success: true,
        message: "Profile updated successfully",
        data: userData,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to update profile",
    };
  } catch (error: Error | any) {
    console.error("Update profile error:", error);
    return { success: false, message: error.message };
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
