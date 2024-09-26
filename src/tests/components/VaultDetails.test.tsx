import { MemoryRouter } from "react-router-dom";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import { vi } from "vitest";
import VaultDetails from "../../components/VaultDetails";
import { AuthContext } from "../../context/AuthContext";

afterAll(() => {
  vi.restoreAllMocks();
});

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
  const navigate = vi.fn();

  return {
    ...mod,
    useParams: () => ({
      id: "3",
    }),
    useNavigate: navigate,
  };
});

describe("VaultDetails Component", () => {
  it("should render initial modal with unlock code input and buttons", async () => {
    render(
      <AuthContext.Provider
        value={{
          login: vi.fn(),
          authError: null,
          user: userMock,
          userToken: userToken,
          loading: false,
          register: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <MemoryRouter>
          <VaultDetails />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Enter unlock code/i)
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("vault-details-cancel-btn")
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("vault-details-acess-vault-btn")
      ).toBeInTheDocument();
    });
  });

  it("should render vault details when successfully accessed", async () => {
    vi.mock("../../services/vaultService.ts", () => ({
      vaultLogin: vi.fn(() =>
        Promise.resolve({
          data: {
            id: "1",
            type: "vault",
            attributes: {
              id: 1,
              name: "Special Vault",
              created_at: new Date(),
              updated_at: new Date(),
              last_accessed_at: new Date(),
              description: "A special vault",
              vault_type: "personal",
              shared_with: [],
              status: "active",
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
                url: null,
                notes: null,
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
                url: null,
                notes: null,
                password: "XhBBdFifBGAOciip",
                created_at: new Date(),
                updated_at: new Date(),
              },
            },
          ],
        })
      ),
    }));
    render(
      <AuthContext.Provider
        value={{
          login: vi.fn(),
          authError: null,
          user: userMock,
          userToken: userToken,
          loading: false,
          register: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <MemoryRouter>
          <VaultDetails />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    act(() => {
      const unlockCodeInput = screen.getByPlaceholderText("Enter unlock code");

      fireEvent.change(unlockCodeInput, {
        target: { value: "Favouritepassword123!*" },
      });

      fireEvent.click(screen.getByTestId("vault-details-acess-vault-btn"));
    });

    await waitFor(() => {
      expect(screen.getByText("Special Vault")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Type:")).toBeInTheDocument();
      expect(screen.getByText("personal")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Status:")).toBeInTheDocument();
      expect(screen.getByText("active")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Vault Records")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId("password-record-item")).toHaveLength(2);
    });

    await waitFor(() => {
      const usernameElements = screen.queryAllByText("Username:");
      expect(usernameElements.length).toBeGreaterThan(0);
      expect(screen.getByText("Pearl")).toBeInTheDocument();
      expect(screen.getByText("Ashah")).toBeInTheDocument();
    });
  });
});
