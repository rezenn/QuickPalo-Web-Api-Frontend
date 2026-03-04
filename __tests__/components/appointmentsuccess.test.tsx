import AppointmentSuccess from "@/app/user/appointment/success/page";
import { render, waitFor, screen } from "@testing-library/react";
import { toDataURL } from "qrcode";

jest.mock("qrcode", () => ({
  toDataURL: jest.fn(() => Promise.resolve("data:image/png;base64,mockqr")),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

const mockSuccessBookingData = {
  organizationId: "org123",
  organizationName: "City Hospital",
  organizationType: "hospital",
  fees: 500,
  department: { name: "Cardiology", id: "dept123" },
  date: {
    fullDate: "2025-06-15",
    dayName: "Monday",
    dayNumber: 15,
    month: "Jun",
    year: 2025,
  },
  timeSlot: { display: "09:00 - 09:30", startTime: "09:00", endTime: "09:30" },
  user: {
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "+977123456789",
  },
  bookingTime: new Date().toISOString(),
};

describe("AppointmentSuccess", () => {
  beforeEach(() => {
    sessionStorage.setItem(
      "bookingData",
      JSON.stringify(mockSuccessBookingData),
    );
    jest.clearAllMocks();
  });
  afterEach(() => sessionStorage.clear());

  it("shows confirmed heading", async () => {
    render(<AppointmentSuccess />);
    await waitFor(() => {
      expect(screen.getByText(/appointment confirmed/i)).toBeInTheDocument();
    });
  });

  it("renders booking summary from session storage", async () => {
    render(<AppointmentSuccess />);
    await waitFor(() => {
      expect(screen.getByText("City Hospital")).toBeInTheDocument();
      expect(screen.getByText("Cardiology")).toBeInTheDocument();
      expect(screen.getByText(/Rs\. 500/i)).toBeInTheDocument();
    });
  });
});
