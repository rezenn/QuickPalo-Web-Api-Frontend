import {
  handleCheckAvailability,
  handleGetUserAppointments,
  handleCancelAppointment,
  handleCompleteAppointment,
} from "@/lib/actions/appointment/appointment";
import * as apptApi from "@/lib/api/appointment/appointment";

jest.mock("@/lib/api/appointment/appointment");
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const mockApptApi = apptApi as jest.Mocked<typeof apptApi>;

describe("Appointment Server Actions", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("handleCheckAvailability", () => {
    it("returns available result", async () => {
      mockApptApi.checkAvailability.mockResolvedValue({
        success: true,
        data: { isAvailable: true },
      } as any);

      const result = await handleCheckAvailability({
        organizationId: "org1",
        date: "2025-06-15",
        startTime: "09:00",
        endTime: "09:30",
      });

      expect(result.success).toBe(true);
    });

    it("returns failure for missing fields", async () => {
      const result = await handleCheckAvailability({
        organizationId: "",
        date: "",
        startTime: "",
        endTime: "",
      });

      expect(result.success).toBe(false);
      expect(result.message).toMatch(/missing required fields/i);
    });
  });

  describe("handleGetUserAppointments", () => {
    it("returns appointments on success", async () => {
      mockApptApi.getUserAppointments.mockResolvedValue({
        success: true,
        data: [{ _id: "appt1" }],
      } as any);

      const result = await handleGetUserAppointments();
      expect(result.success).toBe(true);
    });

    it("returns failure on error", async () => {
      mockApptApi.getUserAppointments.mockRejectedValue(
        new Error("Unauthorized"),
      );

      const result = await handleGetUserAppointments();
      expect(result.success).toBe(false);
      expect(result.message).toBe("Unauthorized");
    });
  });

  describe("handleCancelAppointment", () => {
    it("cancels appointment and revalidates", async () => {
      const { revalidatePath } = require("next/cache");
      mockApptApi.cancelAppointment.mockResolvedValue({ success: true } as any);

      const result = await handleCancelAppointment("appt123");
      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/user/appointments");
    });

    it("returns failure on error", async () => {
      mockApptApi.cancelAppointment.mockRejectedValue(new Error("Not found"));

      const result = await handleCancelAppointment("bad-id");
      expect(result.success).toBe(false);
    });
  });

  describe("handleCompleteAppointment", () => {
    it("completes appointment successfully", async () => {
      mockApptApi.completeAppointment.mockResolvedValue({
        success: true,
      } as any);

      const result = await handleCompleteAppointment("appt123");
      expect(result.success).toBe(true);
    });
  });
});
