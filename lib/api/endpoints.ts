export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GETUSER: "/auth/get-user",
    UPDATEPROFILE: "/auth/update-user",
  },
  ADMIN: {
    AUTH: {
      GETALLUSERS: "/admin/auth/users",
      CREATEUSER: "/admin/auth/create-user",
      GETUSERBYID: "/auth/:id",
      UPDATEUSERASADMIN: "/auth/:id",
    },
  },
};
