import OrganizationsDetailsCard from "@/app/user/_component/OrganizationDetailCard";
import { handleGetAllOrganizations } from "@/lib/actions/organization/organization-action";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";

jest.mock("@/lib/actions/organization/organization-action", () => ({
  handleGetAllOrganizations: jest.fn(),
}));
jest.mock("@/lib/utils/recentlyViewed", () => ({
  addRecentlyViewed: jest.fn(),
}));
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, fill, sizes, ...props }: any) => (
    <img alt={alt} {...props} />
  ),
}));

const mockOrgs = [
  {
    _id: "org1",
    organizationName: "City Hospital",
    organizationType: "hospital",
    street: "Main Street",
    city: "Kathmandu",
    description: "Best hospital",
    workingHours: [
      {
        day: "monday",
        openingTime: "09:00",
        closingTime: "17:00",
        isWorking: true,
      },
    ],
    user: { profilePicture: null },
  },
  {
    _id: "org2",
    organizationName: "Sunrise Clinic",
    organizationType: "clinic",
    street: "Side Street",
    city: "Pokhara",
    description: "Good clinic",
    workingHours: [
      {
        day: "monday",
        openingTime: "10:00",
        closingTime: "16:00",
        isWorking: true,
      },
    ],
    user: { profilePicture: null },
  },
];

describe("OrganizationsDetailsCard", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows loading skeletons initially", () => {
    (handleGetAllOrganizations as jest.Mock).mockImplementation(
      () => new Promise(() => {}), // never resolves
    );
    render(<OrganizationsDetailsCard />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders organization cards after fetch", async () => {
    (handleGetAllOrganizations as jest.Mock).mockResolvedValue({
      success: true,
      data: mockOrgs,
    });

    render(<OrganizationsDetailsCard />);

    await waitFor(() => {
      expect(screen.getByText("City Hospital")).toBeInTheDocument();
      expect(screen.getByText("Sunrise Clinic")).toBeInTheDocument();
    });
  });

  it("shows error message on fetch failure", async () => {
    (handleGetAllOrganizations as jest.Mock).mockResolvedValue({
      success: false,
      message: "Network error",
    });

    render(<OrganizationsDetailsCard />);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /try again/i }),
      ).toBeInTheDocument();
    });
  });

  it("filters organizations by type", async () => {
    (handleGetAllOrganizations as jest.Mock).mockResolvedValue({
      success: true,
      data: mockOrgs,
    });

    render(<OrganizationsDetailsCard activeFilter="clinic" />);

    await waitFor(() => {
      expect(screen.getByText("Sunrise Clinic")).toBeInTheDocument();
      expect(screen.queryByText("City Hospital")).not.toBeInTheDocument();
    });
  });

  it("shows empty state when filter has no results", async () => {
    (handleGetAllOrganizations as jest.Mock).mockResolvedValue({
      success: true,
      data: mockOrgs,
    });

    render(<OrganizationsDetailsCard activeFilter="bank" />);

    await waitFor(() => {
      expect(
        screen.getByText(/no "bank" organizations found/i),
      ).toBeInTheDocument();
    });
  });
});
