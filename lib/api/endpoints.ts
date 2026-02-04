export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GETUSER: "/auth/get-user",
    UPDATEPROFILE: "/auth/update-user",
    REQUEST_PASSWORD_RESET: "/auth/request-password-reset",
    RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
  },
  ADMIN: {
    GETALLUSERS: "/admin/auth/users",
    CREATEUSER: "/admin/auth/create-user",
    GETUSERBYID: (id: string) => `/auth/${id}`,
    UPDATEUSERASADMIN: (id: string) => `/auth/${id}`,
  },
};
