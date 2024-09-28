import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as router from "react-router";
import { vi } from "vitest";
import VaultModal from "../../components/VaultModal";
import { AuthContext } from "../../context/AuthContext";

const navigate = vi.fn();
beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(router, "useNavigate").mockImplementation(() => navigate);
});

afterAll(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
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

const updatedVaultMock = {
  id: "3",
  type: "vault",
  attributes: {
    id: "3",
    name: "Updated vault name",
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
  it("should display the vault modal when no vault is passed", async () => {
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
          <VaultModal
            setModalVisible={vi.fn()}
            onClose={vi.fn()}
            setVaults={vi.fn()}
            visible={true}
          />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText("Create vault")).toBeInTheDocument();
    expect(screen.getByLabelText(/Vault Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Unlock Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Vault Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByTestId("vault-submit-button")).toBeInTheDocument();
  });

  it("should display the spinner when submit button is clicked after filling fields", async () => {
    vi.mock("../../services/vaultService.ts", () => ({
      createVault: vi.fn(() => Promise.resolve(vaultMock)),
      updateVault: vi.fn(() => Promise.resolve(updatedVaultMock)),
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
          <VaultModal
            setModalVisible={vi.fn()}
            onClose={vi.fn()}
            setVaults={vi.fn()}
            visible={true}
          />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const vaultNameInput = screen.getByLabelText("Vault Name");
    fireEvent.change(vaultNameInput, {
      target: { value: "New vault name" },
    });

    const codeInput = screen.getByLabelText("Unlock Code");
    fireEvent.change(codeInput, {
      target: { value: "Favouritepassword123!*" },
    });

    const descriptionInput = screen.getByLabelText("Description");
    fireEvent.change(descriptionInput, {
      target: { value: "A special vault." },
    });

    fireEvent.click(screen.getByTestId("vault-submit-button"));

    await waitFor(() => {
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });
  });

  it("should display error message when vault creation fails", async () => {
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
          <VaultModal
            setModalVisible={vi.fn()}
            onClose={vi.fn()}
            setVaults={vi.fn()}
            visible={true}
          />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const vaultNameInput = screen.getByLabelText("Vault Name");
    fireEvent.change(vaultNameInput, {
      target: { value: "New vault name" },
    });

    const codeInput = screen.getByLabelText("Unlock Code");
    fireEvent.change(codeInput, {
      target: { value: "Favouritepassword123!*" },
    });

    const descriptionInput = screen.getByLabelText("Description");
    fireEvent.change(descriptionInput, {
      target: { value: "A special vault." },
    });

    fireEvent.click(screen.getByTestId("vault-submit-button"));

    await waitFor(() =>
      expect(screen.getByText("User token is missing.")).toBeInTheDocument()
    );
  });

  it("should display the vault modal with data when vault is passed", async () => {
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
          <VaultModal
            vault={vaultMock}
            setModalVisible={vi.fn()}
            onClose={vi.fn()}
            setVaults={vi.fn()}
            visible={true}
          />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() =>
      expect(screen.getByText("Update vault")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByDisplayValue("Daniel's Vault")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        screen.getByDisplayValue("A vault to store my password records.")
      ).toBeInTheDocument()
    );
  });

  it("should display the spinner when submit button is clicked after updating fields", async () => {
    vi.mock("../../services/vaultService.ts", () => ({
      createVault: vi.fn(() => Promise.resolve(vaultMock)),
      updateVault: vi.fn(() => Promise.resolve(updatedVaultMock)),
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
          <VaultModal
            vault={vaultMock}
            setModalVisible={vi.fn()}
            onClose={vi.fn()}
            setVaults={vi.fn()}
            visible={true}
          />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() =>
      expect(screen.getByDisplayValue("Daniel's Vault")).toBeInTheDocument()
    );

    const vaultNameInput = screen.getByLabelText("Vault Name");
    fireEvent.change(vaultNameInput, {
      target: { value: "Updated vault name" },
    });

    fireEvent.click(screen.getByTestId("vault-submit-button"));

    await waitFor(() =>
      expect(screen.getByTestId("spinner")).toBeInTheDocument()
    );
  });
});
