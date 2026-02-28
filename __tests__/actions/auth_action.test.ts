// ─────────────────────────────────────────────────────────────
// auth-action.test.ts  — unit tests for server actions
// ─────────────────────────────────────────────────────────────
import {
  handleLogin,
  handleRegister,
  handleResetPassword,
} from "@/lib/actions/auth-action";
import * as authApi from "@/lib/api/auth";
import * as cookieLib from "@/lib/cookie";

jest.mock("@/lib/api/auth");
jest.mock("@/lib/cookie", () => ({
  setAuthToken: jest.fn(),
  setUserData: jest.fn(),
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const mockApi = authApi as jest.Mocked<typeof authApi>;

describe("Auth Server Actions", () => {
  beforeEach(() => jest.clearAllMocks());

  // ─── handleLogin ──────────────────────────────────────────
  describe("handleLogin", () => {
    it("returns success and sets cookies on valid login", async () => {
      mockApi.login.mockResolvedValue({
        success: true,
        token: "jwt-token-123",
        data: { role: "user", _id: "user1" },
      });

      const result = await handleLogin({
        email: "user@test.com",
        password: "pass",
      });

      expect(result.success).toBe(true);
      expect(result.data?.role).toBe("user");
      expect(cookieLib.setAuthToken).toHaveBeenCalledWith("jwt-token-123");
      expect(cookieLib.setUserData).toHaveBeenCalledWith({
        role: "user",
        _id: "user1",
      });
    });

    it("returns failure when api returns success: false", async () => {
      mockApi.login.mockResolvedValue({
        success: false,
        message: "Invalid credentials",
      });

      const result = await handleLogin({
        email: "bad@test.com",
        password: "wrong",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid credentials");
      expect(cookieLib.setAuthToken).not.toHaveBeenCalled();
    });

    it("returns failure when api throws", async () => {
      mockApi.login.mockRejectedValue(new Error("Network error"));

      const result = await handleLogin({
        email: "user@test.com",
        password: "pass",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Network error");
    });
  });

  // ─── handleRegister ───────────────────────────────────────
  describe("handleRegister", () => {
    it("returns success on valid registration", async () => {
      mockApi.register.mockResolvedValue({
        success: true,
        data: { email: "new@test.com" },
      });

      const result = await handleRegister({
        fullName: "John",
        email: "new@test.com",
        password: "pass",
        confirmPassword: "pass",
        phoneNumber: "+977123",
      });

      expect(result.success).toBe(true);
    });

    it("returns failure when email already in use", async () => {
      mockApi.register.mockRejectedValue(new Error("Email already in use"));

      const result = await handleRegister({
        fullName: "John",
        email: "taken@test.com",
        password: "pass",
        confirmPassword: "pass",
        phoneNumber: "+977123",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Email already in use");
    });
  });

  // ─── handleResetPassword ──────────────────────────────────
  describe("handleResetPassword", () => {
    it("returns success on valid token and password", async () => {
      mockApi.resetPassword.mockResolvedValue({ success: true });

      const result = await handleResetPassword("valid-token", "NewPass@123");

      expect(result.success).toBe(true);
      expect(mockApi.resetPassword).toHaveBeenCalledWith(
        "valid-token",
        "NewPass@123",
      );
    });

    it("returns failure on invalid or expired token", async () => {
      mockApi.resetPassword.mockRejectedValue(
        new Error("Invalid or expired token"),
      );

      const result = await handleResetPassword("bad-token", "NewPass@123");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid or expired token");
    });
  });
});
