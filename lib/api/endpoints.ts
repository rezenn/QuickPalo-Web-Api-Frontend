export const API = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    GETUSER: "/api/auth/get-user",
    UPDATEPROFILE: "/api/auth/update-user",
    REQUEST_PASSWORD_RESET: "/api/auth/request-password-reset",
    RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
  },
  ADMIN: {
    GETALLUSERS: "/api/admin/auth/users",
    CREATEUSER: "/api/admin/auth/create-user",
    GETUSERBYID: (id: string) => `/api/auth/${id}`,
    UPDATEUSERASADMIN: (id: string) => `/api/admin/auth/${id}`,
    DELETEUSERASADMIN: (id: string) => `/api/admin/auth/${id}`,
  },
};
