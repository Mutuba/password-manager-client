import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as router from "react-router";
import { vi } from "vitest";
import VaultCard from "../../components/VaultCard";
import { AuthContext } from "../../context/AuthContext";
import * as vaultService from "../../services/vaultService";

const navigate = vi.fn();

beforeEach(() => {
  vi.spyOn(router, "useNavigate").mockImplementation(() => navigate);
});

const userToken = "random-token";

const userMock = {
  first_name: "John",
  last_name: "Doe",
  username: "john_doe",
  email: "johndoe@example.com",
  password: "password",
};

const setVaults = vi.fn();
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
          <VaultCard vault={vaultMock} setVaults={setVaults} />
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
          <VaultCard vault={vaultMock} setVaults={setVaults} />
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
          <VaultCard vault={vaultMock} setVaults={setVaults} />
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
          <VaultCard vault={vaultMock} setVaults={setVaults} />
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

  it("should open delete confirmation modal when delete is clicked", async () => {
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
          <VaultCard vault={vaultMock} setVaults={setVaults} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByTestId("ellipsis-action-menu"));
    fireEvent.click(screen.getByText("Delete Vault"));

    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to delete the vault?/)
      ).toBeInTheDocument()
    );
  });

  it("should display a loading spinner while vault is being deleted", async () => {
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
          <VaultCard vault={vaultMock} setVaults={setVaults} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByTestId("ellipsis-action-menu"));
    fireEvent.click(screen.getByText("Delete Vault"));
    fireEvent.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });
  });

  it("should navigate to the vault details page on Access Vault click", async () => {
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
          <VaultCard vault={vaultMock} setVaults={setVaults} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByTestId("vault-card-access-vault-btn"));
    expect(navigate).toHaveBeenCalledWith(`/vault/3/details`);
  });

  it("should display error message when vault deletion fails", async () => {
    const deleteVaultSpy = vi.spyOn(vaultService, "deleteVault");
    deleteVaultSpy.mockRejectedValue(
      "An error occurred when deleting the vault."
    );

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
          <VaultCard vault={vaultMock} setVaults={setVaults} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByTestId("ellipsis-action-menu"));
    fireEvent.click(screen.getByText("Delete Vault"));
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() =>
      expect(
        screen.getByText("An error occurred when deleting the vault.")
      ).toBeInTheDocument()
    );
  });

  it("should open vault update modal when update is clicked", async () => {
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
          <VaultCard vault={vaultMock} setVaults={setVaults} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByTestId("ellipsis-action-menu"));
    fireEvent.click(screen.getByText("Update Vault"));

    await waitFor(() =>
      expect(screen.getByText("Update vault")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText("Daniel's Vault")).toBeInTheDocument()
    );
  });
});
