import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingConfirmation from "@/app/user/appointment/page";
import * as appointmentApi from "@/lib/api/appointment/appointment";
import { useAuth } from "@/context/authContext";

jest.mock("@/context/authContext", () => ({ useAuth: jest.fn() }));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));
jest.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: any) => <div>{children}</div>,
}));
jest.mock("@stripe/stripe-js", () => ({
  loadStripe: jest.fn(() => Promise.resolve(null)),
}));
jest.mock("@/lib/api/appointment/appointment", () => ({
  createAppointment: jest.fn(),
  createPaymentIntent: jest.fn(),
  markAppointmentPaid: jest.fn(),
}));
jest.mock("@/app/user/appointment/_components/StripecardForm", () => ({
  __esModule: true,
  default: ({ onSuccess, onCancel }: any) => (
    <div>
      <button onClick={onSuccess}>Pay Now</button>
      <button onClick={onCancel}>Skip Payment</button>
    </div>
  ),
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));

jest.mock("@/app/user/appointment/hooks/useSessionStorage", () => ({
  useSessionStorage: jest.fn(),
}));

const mockBookingData = {
  organizationId: "org123",
  organizationName: "City Hospital",
  organizationType: "hospital",
  fees: 500,
  department: { name: "Cardiology", id: "dept123" },
  date: {
    display: "Mon\n15",
    fullDate: "2025-06-15",
    dayName: "Monday",
    dayNumber: 15,
    month: "Jun",
    year: 2025,
  },
  timeSlot: { display: "09:00 - 09:30", startTime: "09:00", endTime: "09:30" },
  user: {
    id: "user1",
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "+977123456789",
  },
  bookingTime: new Date().toISOString(),
};

function setupWithBookingData() {
  const {
    useSessionStorage,
  } = require("@/app/user/appointment/hooks/useSessionStorage");
  useSessionStorage.mockReturnValue([mockBookingData, jest.fn()]);
  (useAuth as jest.Mock).mockReturnValue({ user: { _id: "user1" } });

  // Seed sessionStorage
  sessionStorage.setItem("bookingData", JSON.stringify(mockBookingData));

  return render(<BookingConfirmation />);
}

describe("BookingConfirmation", () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => sessionStorage.clear());

  it("renders organization name and appointment details", async () => {
    setupWithBookingData();
    await waitFor(() => {
      expect(screen.getByText("City Hospital")).toBeInTheDocument();
      expect(screen.getByText("Cardiology")).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });
  });

  it("shows 'No Booking Data' when sessionStorage is empty", async () => {
    const {
      useSessionStorage,
    } = require("@/app/user/appointment/hooks/useSessionStorage");
    useSessionStorage.mockReturnValue([null, jest.fn()]);
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    sessionStorage.clear();

    render(<BookingConfirmation />);

    await waitFor(() => {
      expect(screen.getByText(/no booking data found/i)).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /browse organizations/i }),
      ).toBeInTheDocument();
    });
  });

  it("submits appointment with cash payment and redirects to success", async () => {
    (appointmentApi.createAppointment as jest.Mock).mockResolvedValue({
      success: true,
      data: { _id: "appt123" },
    });
    setupWithBookingData();
    const user = userEvent.setup();

    await waitFor(() => screen.getByText(/confirm your appointment/i));

    // Cash is selected by default
    const cashRadio = screen.getByRole("radio", { name: /cash/i });
    expect(cashRadio).toBeChecked();

    await user.click(
      screen.getByRole("button", { name: /confirm appointment/i }),
    );

    await waitFor(() => {
      expect(appointmentApi.createAppointment).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId: "org123",
          departmentId: "dept123",
          clientName: "John Doe",
          paymentMethod: "cash",
        }),
      );
      expect(mockPush).toHaveBeenCalledWith("/user/appointment/success");
    });
  });

  it("switches to online payment and shows Stripe form", async () => {
    (appointmentApi.createAppointment as jest.Mock).mockResolvedValue({
      success: true,
      data: { _id: "appt123" },
    });
    (appointmentApi.createPaymentIntent as jest.Mock).mockResolvedValue(
      "pi_secret_123",
    );
    setupWithBookingData();
    const user = userEvent.setup();

    await waitFor(() => screen.getByText(/confirm your appointment/i));

    await user.click(screen.getByRole("radio", { name: /online/i }));
    await user.click(
      screen.getByRole("button", { name: /continue to payment/i }),
    );

    await waitFor(() => {
      expect(appointmentApi.createPaymentIntent).toHaveBeenCalledWith(
        500,
        "appt123",
      );
      expect(screen.getByText(/complete payment/i)).toBeInTheDocument();
    });
  });

  it("shows error when createAppointment fails", async () => {
    const { toast } = require("sonner");
    (appointmentApi.createAppointment as jest.Mock).mockResolvedValue({
      success: false,
      message: "This time slot is already booked",
    });
    setupWithBookingData();
    const user = userEvent.setup();

    await waitFor(() => screen.getByText(/confirm your appointment/i));
    await user.click(
      screen.getByRole("button", { name: /confirm appointment/i }),
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "This time slot is already booked",
      );
      expect(
        screen.getByText("This time slot is already booked"),
      ).toBeInTheDocument();
    });
  });

  it("calls markAppointmentPaid and redirects on payment success", async () => {
    (appointmentApi.createAppointment as jest.Mock).mockResolvedValue({
      success: true,
      data: { _id: "appt123" },
    });
    (appointmentApi.createPaymentIntent as jest.Mock).mockResolvedValue(
      "pi_secret",
    );
    (appointmentApi.markAppointmentPaid as jest.Mock).mockResolvedValue({
      success: true,
    });
    setupWithBookingData();
    const user = userEvent.setup();

    await waitFor(() => screen.getByText(/confirm your appointment/i));
    await user.click(screen.getByRole("radio", { name: /online/i }));
    await user.click(
      screen.getByRole("button", { name: /continue to payment/i }),
    );

    await waitFor(() => screen.getByRole("button", { name: /pay now/i }));
    await user.click(screen.getByRole("button", { name: /pay now/i }));

    await waitFor(() => {
      expect(appointmentApi.markAppointmentPaid).toHaveBeenCalledWith(
        "appt123",
      );
      expect(mockPush).toHaveBeenCalledWith("/user/appointment/success");
    });
  });

  it("allows adding notes", async () => {
    setupWithBookingData();

    await waitFor(() => screen.getByPlaceholderText(/special requests/i));
    fireEvent.change(screen.getByPlaceholderText(/special requests/i), {
      target: { value: "Please bring extra forms" },
    });

    expect(screen.getByPlaceholderText(/special requests/i)).toHaveValue(
      "Please bring extra forms",
    );
  });
});
