import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import VaultCard from "../../components/VaultCard";
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

const setVaultsUpdatedMock = vi.fn();
const vaultMock = {
  id: "3",
  type: "vault",
  attributes: {
    id: "3",
    name: "Daniel's Vault",
    created_at: new Date(),
    updated_at: new Date(),
    last_accessed_at: new Date(),
    description: "A vault to store my password records.",
    vault_type: "business",
    shared_with: [],
    unlock_code: "random-unlock-code",
    status: "active",
    access_count: 0,
    is_shared: false,
    failed_attempts: 0,
  },
};
vi.mock("../../services/vaultService.ts", () => ({
  fetchVaults: vi.fn(() => Promise.resolve(vaultMock)),
}));

describe("Home Component", () => {
  it("should display the user's first name if logged in", async () => {
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
          <VaultCard
            vault={vaultMock}
            setVaultsUpdated={setVaultsUpdatedMock}
          />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() =>
      expect(screen.getByText("Daniel's Vault")).toBeInTheDocument()
    );
  });

  it("should display the vault description if available", async () => {
    render(
      <AuthContext.Provider
        value={{
          login: vi.fn(),
          authError: null,
          user: userMock,
          userToken: null,
          loading: false,
          register: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <MemoryRouter>
          <VaultCard
            vault={vaultMock}
            setVaultsUpdated={setVaultsUpdatedMock}
          />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() =>
      expect(
        screen.getByText("A vault to store my password records.")
      ).toBeInTheDocument()
    );
  });

  it("should display the vault type and status", async () => {
    render(
      <AuthContext.Provider
        value={{
          login: vi.fn(),
          authError: null,
          user: userMock,
          userToken: null,
          loading: false,
          register: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <MemoryRouter>
          <VaultCard
            vault={vaultMock}
            setVaultsUpdated={setVaultsUpdatedMock}
          />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Type:")).toBeInTheDocument();
      expect(screen.getByText("business")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Status:")).toBeInTheDocument();
      expect(screen.getByText("active")).toBeInTheDocument();
    });
  });

  it("should show action menu when ellipsis is clicked", async () => {
    render(
      <AuthContext.Provider
        value={{
          login: vi.fn(),
          authError: null,
          user: userMock,
          userToken: null,
          loading: false,
          register: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <MemoryRouter>
          <VaultCard
            vault={vaultMock}
            setVaultsUpdated={setVaultsUpdatedMock}
          />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByTestId("ellipsis-action-menu"));

    await waitFor(() => {
      expect(screen.getByText("Update Vault")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Delete Vault")).toBeInTheDocument();
    });
  });
});
