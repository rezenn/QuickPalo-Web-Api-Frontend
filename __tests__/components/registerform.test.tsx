import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/app/(auth)/_components/RegisterForm";
import { handleRegister } from "@/lib/actions/auth-action";

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

describe("RegisterForm", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders all form fields", () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("user@mail.com")).toBeInTheDocument();
    expect(screen.getByTestId("phone-input")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("••••••••")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it("calls handleRegister with correct data on valid submission", async () => {
    (handleRegister as jest.Mock).mockResolvedValue({ success: true });
    render(<RegisterForm />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
    await user.type(
      screen.getByPlaceholderText("user@mail.com"),
      "john@example.com",
    );
    await user.type(screen.getByTestId("phone-input"), "+977123456789");

    const [passwordInput, confirmPasswordInput] =
      screen.getAllByPlaceholderText("••••••••");
    await user.type(passwordInput, "Password@123");
    await user.type(confirmPasswordInput, "Password@123");

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(handleRegister).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: "John Doe",
          email: "john@example.com",
          password: "Password@123",
          confirmPassword: "Password@123",
        }),
      );
    });
  });

  it("redirects to /login on successful registration", async () => {
    (handleRegister as jest.Mock).mockResolvedValue({ success: true });
    render(<RegisterForm />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
    await user.type(
      screen.getByPlaceholderText("user@mail.com"),
      "john@example.com",
    );
    await user.type(screen.getByTestId("phone-input"), "+977123456789");

    const [passwordInput, confirmPasswordInput] =
      screen.getAllByPlaceholderText("••••••••");
    await user.type(passwordInput, "Password@123");
    await user.type(confirmPasswordInput, "Password@123");

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("shows error toast on failed registration", async () => {
    const { toast } = require("sonner");
    (handleRegister as jest.Mock).mockResolvedValue({
      success: false,
      message: "Email already in use",
    });
    render(<RegisterForm />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
    await user.type(
      screen.getByPlaceholderText("user@mail.com"),
      "taken@example.com",
    );
    await user.type(screen.getByTestId("phone-input"), "+977123456789");

    const [passwordInput, confirmPasswordInput] =
      screen.getAllByPlaceholderText("••••••••");
    await user.type(passwordInput, "Password@123");
    await user.type(confirmPasswordInput, "Password@123");

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Email already in use");
    });
  });

  it("toggles password visibility", async () => {
    render(<RegisterForm />);
    const user = userEvent.setup();

    const [passwordInput] = screen.getAllByPlaceholderText("••••••••");
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtns = screen.getAllByRole("button", {
      name: /show password/i,
    });
    await user.click(toggleBtns[0]);

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("renders Sign in link", () => {
    render(<RegisterForm />);
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});


