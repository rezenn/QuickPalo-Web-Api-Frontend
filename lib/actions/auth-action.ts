"use server";
import { revalidatePath } from "next/cache";
import {
  register,
  login,
  updateProfile,
  getUser,
  getAllUsers,
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

export async function handleUpdateProfile(profileData: any) {
  try {
    const result = await updateProfile(profileData);

    console.log("DEBUG - Raw update result:", {
      success: result.success,
      dataStructure: result.data ? "Exists" : "Missing",
      profilePictureField: result.data?.profilePicture,
      imageUrlField: result.data?.imageUrl,
    });

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

      console.log("DEBUG - User data to save to cookie:", {
        profilePicture: userData.profilePicture,
        imageUrl: userData.imageUrl,
        keys: Object.keys(userData),
      });

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
