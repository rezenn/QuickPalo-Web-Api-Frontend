"use server";
import { register, login } from "../api/auth";
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
