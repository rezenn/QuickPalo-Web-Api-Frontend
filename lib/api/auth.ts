import axiosInstance from "@/lib/api/axios";
import { API } from "./endpoints";

export const register = async (registerData: any) => {
  try {
    const response = await axiosInstance.post(API.AUTH.REGISTER, registerData);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Registration failed",
    );
  }
};

export const login = async (loginData: any) => {
  try {
    const response = await axiosInstance.post(API.AUTH.LOGIN, loginData);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Login failed",
    );
  }
};
