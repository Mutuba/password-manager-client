import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi, beforeEach } from "vitest";
import VaultDetails from "../../components/VaultDetails";
import { AuthContext } from "../../context/AuthContext";

const renderWithProviders = (
  ui: any,
  { user, token, error }: { user: any; token: string; error: string | null }
) =>
  render(
    <AuthContext.Provider
      value={{
        login: vi.fn(),
        authError: error,
        user: user,
        userToken: token,
        loading: false,
        register: vi.fn(),
        logout: vi.fn(),
      }}
    >
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );

const userToken = "random-token";
const userMock = {
  first_name: "John",
  last_name: "Doe",
  username: "john_doe",
  email: "johndoe@example.com",
  password: "password",
};

vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual("react-router-dom");
  return {
    ...mod,
    useParams: () => ({
      id: "3",
    }),
    useNavigate: vi.fn(),
  };
});

describe("VaultDetails Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });
  it("should render initial modal with unlock code input and buttons", async () => {
    renderWithProviders(<VaultDetails />, {
      user: userMock,
      token: userToken,
      error: null,
    });

    expect(
      screen.getByPlaceholderText(/Enter unlock code/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId("vault-details-cancel-btn")).toBeInTheDocument();
    expect(
      screen.getByTestId("vault-details-acess-vault-btn")
    ).toBeInTheDocument();
  });

  it("should render vault details when successfully accessed", async () => {
    vi.mock("../../services/vaultService.ts", () => ({
      vaultLogin: vi.fn(() =>
        Promise.resolve({
          data: {
            id: "3",
            type: "vault",
            attributes: {
              id: 1,
              name: "Special Vault",
              created_at: new Date(),
              updated_at: new Date(),
              last_accessed_at: new Date(),
              description: "A special vault",
              vault_type: "personal",
              status: "active",
              shared_with: [],
              access_count: 0,
              is_shared: false,
              failed_attempts: 0,
            },
          },
          included: [
            {
              id: "2",
              type: "password_record",
              attributes: {
                name: "Second Record",
                username: "Ashah",
                password: "XhBBdFifBGAOffciip",
                created_at: new Date(),
                updated_at: new Date(),
              },
            },
            {
              id: "1",
              type: "password_record",
              attributes: {
                name: "First Record",
                username: "Pearl",
                password: "XhBBdFifBGAOciip",
                created_at: new Date(),
                updated_at: new Date(),
              },
            },
          ],
        })
      ),
    }));
    renderWithProviders(<VaultDetails />, {
      user: userMock,
      token: userToken,
      error: null,
    });

    fireEvent.change(screen.getByPlaceholderText("Enter unlock code"), {
      target: { value: "Favouritepassword123!*" },
    });
    fireEvent.click(screen.getByTestId("vault-details-acess-vault-btn"));

    await waitFor(() => {
      expect(screen.getByText("Special Vault")).toBeInTheDocument();
      expect(screen.getByText("Type:")).toBeInTheDocument();
      expect(screen.getByText("personal")).toBeInTheDocument();
      expect(screen.getByText("Status:")).toBeInTheDocument();
      expect(screen.getByText("active")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Vault Records")).toBeInTheDocument();
      const passwordRecords = screen.getAllByTestId("password-record-item");
      expect(passwordRecords).toHaveLength(2);
      expect(screen.getByText("Pearl")).toBeInTheDocument();
      expect(screen.getByText("Ashah")).toBeInTheDocument();
    });
  });
});
