"use server";
import { register, login } from "../api/auth";
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
  } catch (error: Error | any) {
    return { success: false, message: error.message };
  }
}
