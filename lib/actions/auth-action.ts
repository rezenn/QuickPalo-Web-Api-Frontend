"use server";
import { revalidatePath } from "next/cache";
import { register, login, updateProfile, getUser } from "../api/auth";
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

export async function handleUpdateProfile(profileData: any) {
  try {
    const result = await updateProfile(profileData);
    if (result.success) {
      await setUserData(result.data); // update cookie
      revalidatePath("/user/profile"); // revalidate profile page/ refresh new data
      return {
        success: true,
        message: "Profile updated successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to update profile",
    };
  } catch (error: Error | any) {
    return { success: false, message: error.message };
  }
}
