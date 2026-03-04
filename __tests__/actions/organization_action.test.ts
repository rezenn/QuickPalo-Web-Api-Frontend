import {
  handleGetAllOrganizations as getAll,
  handleGetOrganizationById,
  handlePostOrganizationDetails,
  handleUpdateOrganizationDetails,
  handleDeleteOrganizationDetails,
} from "@/lib/actions/organization/organization-action";
import * as orgApi from "@/lib/api/organization/organization";

jest.mock("@/lib/api/organization/organization");
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const mockOrgApi = orgApi as jest.Mocked<typeof orgApi>;
const mockOrgs = [
  {
    _id: "org1",
    organizationName: "City Hospital",
    organizationType: "hospital",
    street: "Main Street",
    city: "Kathmandu",
  },
  {
    _id: "org2",
    organizationName: "Sunrise Clinic",
    organizationType: "clinic",
    street: "Side Street",
    city: "Pokhara",
  },
];

describe("Organization Server Actions", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("handleGetAllOrganizations", () => {
    it("returns organizations on success", async () => {
      mockOrgApi.getAllOrganizations.mockResolvedValue({
        success: true,
        message: "OK",
        data: mockOrgs as any,
      });

      const result = await getAll();
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it("returns empty array on failure", async () => {
      mockOrgApi.getAllOrganizations.mockRejectedValue(
        new Error("Network error"),
      );

      const result = await getAll();
      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
    });
  });

  describe("handleGetOrganizationById", () => {
    it("returns organization data", async () => {
      mockOrgApi.getOrganizationById.mockResolvedValue({
        success: true,
        message: "OK",
        data: mockOrgs[0] as any,
      });

      const result = await handleGetOrganizationById("org1");
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockOrgs[0]);
    });

    it("returns failure on error", async () => {
      mockOrgApi.getOrganizationById.mockRejectedValue(new Error("Not found"));

      const result = await handleGetOrganizationById("bad-id");
      expect(result.success).toBe(false);
      expect(result.message).toBe("Not found");
    });
  });

  describe("handlePostOrganizationDetails", () => {
    it("returns success and revalidates paths", async () => {
      const { revalidatePath } = require("next/cache");
      mockOrgApi.postOrganizationDetails.mockResolvedValue({
        success: true,
        message: "Created",
        data: mockOrgs[0] as any,
      });

      const result = await handlePostOrganizationDetails({
        organizationName: "New Org",
      } as any);
      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/organizations");
    });
  });

  describe("handleUpdateOrganizationDetails", () => {
    it("returns updated data on success", async () => {
      mockOrgApi.updateOrganizationDetails.mockResolvedValue({
        success: true,
        message: "Updated",
        data: { ...mockOrgs[0], organizationName: "Updated Hospital" } as any,
      });

      const result = await handleUpdateOrganizationDetails({
        organizationName: "Updated Hospital",
      } as any);
      expect(result.success).toBe(true);
    });

    it("returns failure on api error", async () => {
      mockOrgApi.updateOrganizationDetails.mockRejectedValue(
        new Error("Update failed"),
      );

      const result = await handleUpdateOrganizationDetails({} as any);
      expect(result.success).toBe(false);
      expect(result.message).toBe("Update failed");
    });
  });
});
