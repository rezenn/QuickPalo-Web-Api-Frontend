import axiosInstance from "@/lib/api/axios";
import { API } from "./endpoints";

export const register = async (registerData: any) => {
  try {
    const response = await axiosInstance.post(API.AUTH.REGISTER, registerData);
    console.log(axiosInstance.defaults.baseURL + "/api/auth/register");

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

export const getUser = async () => {
  try {
    const response = await axiosInstance.get(API.AUTH.GETUSER);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch user",
    );
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(API.ADMIN.AUTH.GETALLUSERS);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch users",
    );
  }
};

export const updateProfile = async (profileData: any) => {
  try {
    const response = await axiosInstance.put(
      API.AUTH.UPDATEPROFILE,
      profileData,
      {
        headers: {
          "Content-Type": "multipart/form-data", //for file upload
        },
      },
    );
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "update profile not found ",
    );
  }
};

export const updateUserAsAdmin = async (userId: string, userData: FormData) => {
  try {
    const response = await axiosInstance.put(
      API.ADMIN.AUTH.UPDATEUSERASADMIN,
      userData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to update user",
    );
  }
};
