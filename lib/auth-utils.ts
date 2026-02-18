// lib/auth-utils.ts
import { getAuthToken as getCookieToken } from "./cookie";

export const getAuthToken = async () => {
  // Try to get from localStorage first (for backward compatibility)
  const localToken = localStorage.getItem("token");
  if (localToken) return localToken;

  // Fallback to cookies
  return await getCookieToken();
};
