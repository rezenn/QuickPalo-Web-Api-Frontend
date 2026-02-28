import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordForm from "@/app/(auth)/_components/ResetPasswordForm";
import { handleResetPassword } from "@/lib/actions/auth-action";

jest.mock("@/lib/actions/auth-action", () => ({
  handleRegister: jest.fn(),
  handleResetPassword: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

jest.mock("react-international-phone", () => ({
  PhoneInput: ({ onChange }: { onChange: (v: string) => void }) => (
    <input
      data-testid="phone-input"
      placeholder="Phone Number"
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));
describe("ResetPasswordForm", () => {
  const MOCK_TOKEN = "valid-reset-token-123";

  beforeEach(() => jest.clearAllMocks());

  it("renders password fields and submit button", () => {
    render(<ResetPasswordForm token={MOCK_TOKEN} />);

    expect(screen.getAllByPlaceholderText("••••••••")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: /reset password/i }),
    ).toBeInTheDocument();
  });

  it("calls handleResetPassword with token and new password", async () => {
    (handleResetPassword as jest.Mock).mockResolvedValue({ success: true });
    render(<ResetPasswordForm token={MOCK_TOKEN} />);
    const user = userEvent.setup();

    const [newPassword, confirmPassword] =
      screen.getAllByPlaceholderText("••••••••");
    await user.type(newPassword, "NewPass@123");
    await user.type(confirmPassword, "NewPass@123");

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(handleResetPassword).toHaveBeenCalledWith(
        MOCK_TOKEN,
        "NewPass@123",
      );
    });
  });

  it("redirects to /login on success", async () => {
    (handleResetPassword as jest.Mock).mockResolvedValue({ success: true });
    render(<ResetPasswordForm token={MOCK_TOKEN} />);
    const user = userEvent.setup();

    const [newPassword, confirmPassword] =
      screen.getAllByPlaceholderText("••••••••");
    await user.type(newPassword, "NewPass@123");
    await user.type(confirmPassword, "NewPass@123");

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/login");
    });
  });

  it("shows error toast on failed reset", async () => {
    const { toast } = require("sonner");
    (handleResetPassword as jest.Mock).mockResolvedValue({
      success: false,
      message: "Invalid or expired token",
    });
    render(<ResetPasswordForm token={MOCK_TOKEN} />);
    const user = userEvent.setup();

    const [newPassword, confirmPassword] =
      screen.getAllByPlaceholderText("••••••••");
    await user.type(newPassword, "NewPass@123");
    await user.type(confirmPassword, "NewPass@123");

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid or expired token");
    });
  });

  it("renders Back to Login and request another reset links", () => {
    render(<ResetPasswordForm token={MOCK_TOKEN} />);

    expect(
      screen.getByRole("link", { name: /back to login/i }),
    ).toHaveAttribute("href", "/login");
    expect(
      screen.getByRole("link", { name: /request another reset email/i }),
    ).toHaveAttribute("href", "/request-password-reset");
  });
});
