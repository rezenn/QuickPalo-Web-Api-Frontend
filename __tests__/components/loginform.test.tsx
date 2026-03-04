import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/app/(auth)/_components/LoginForm";
import { handleLogin } from "@/lib/actions/auth-action";
import { useAuth } from "@/context/authContext";

jest.mock("@/lib/actions/auth-action", () => ({
  handleLogin: jest.fn(),
}));

jest.mock("@/context/authContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockCheckAuth = jest.fn();

function setup() {
  (useAuth as jest.Mock).mockReturnValue({
    checkAuth: mockCheckAuth,
    setUser: jest.fn(),
  });

  return render(<LoginForm />);
}

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders email, password fields and submit button", () => {
    setup();

    expect(screen.getByPlaceholderText("example@mail.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("toggles password visibility when eye icon is clicked", async () => {
    setup();
    const user = userEvent.setup();

    const passwordInput = screen.getByPlaceholderText("••••••••");
    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("calls handleLogin with form values on valid submission", async () => {
    (handleLogin as jest.Mock).mockResolvedValue({
      success: true,
      data: { role: "user" },
    });
    setup();
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText("example@mail.com"),
      "test@example.com",
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("redirects to /user/dashboard on successful user login", async () => {
    (handleLogin as jest.Mock).mockResolvedValue({
      success: true,
      data: { role: "user" },
    });
    setup();
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText("example@mail.com"),
      "user@example.com",
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/user/dashboard");
    });
  });

  it("redirects to /admin/dashboard on admin login", async () => {
    (handleLogin as jest.Mock).mockResolvedValue({
      success: true,
      data: { role: "admin" },
    });
    setup();
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText("example@mail.com"),
      "admin@example.com",
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "Admin@123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("shows error toast when login fails", async () => {
    const { toast } = require("sonner");
    (handleLogin as jest.Mock).mockResolvedValue({
      success: false,
      message: "Invalid credentials",
    });
    setup();
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText("example@mail.com"),
      "wrong@example.com",
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "wrongpass");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  it("disables submit button while submitting", async () => {
    // Make login hang so we can check the loading state
    (handleLogin as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 5000)),
    );
    setup();
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText("example@mail.com"),
      "test@example.com",
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");

    const submitBtn = screen.getByRole("button", { name: /log in/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /logging in/i }),
      ).toBeDisabled();
    });
  });

  it("renders Forgot Password link", () => {
    setup();
    expect(
      screen.getByRole("link", { name: /forgot password/i }),
    ).toHaveAttribute("href", "/forgot-password");
  });

  it("renders Sign up link", () => {
    setup();
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/register",
    );
  });
});
