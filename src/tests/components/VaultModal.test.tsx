import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import VaultModal from "../../components/VaultModal";
import { AuthContext } from "../../context/AuthContext";
import * as useVaultSubmit from "../../hooks/useVaultSubmit";

describe("VaultModal", () => {
  const mockSetVaults = vi.fn();
  const mockOnClose = vi.fn();
  const userToken = "random-token";
  const userMock = {
    first_name: "John",
    last_name: "Doe",
    username: "john_doe",
    email: "johndoe@example.com",
    password: "password",
  };

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

  const renderComponent = (props = {}) => {
    const authContextValue = {
      login: vi.fn(),
      authError: null,
      user: userMock,
      userToken: userToken,
      loading: false,
      register: vi.fn(),
      logout: vi.fn(),
    };
    return render(
      <AuthContext.Provider value={authContextValue}>
        <VaultModal
          visible={true}
          setModalVisible={vi.fn()}
          onClose={mockOnClose}
          setVaults={mockSetVaults}
          {...props}
        />
      </AuthContext.Provider>
    );
  };

  const submitVaultDataMock = vi.fn();
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the modal with the form fields", () => {
    renderComponent();

    expect(screen.getByLabelText(/vault name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/unlock code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vault type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/is shared/i)).toBeInTheDocument();
  });

  it("should display the vault modal with data when vault is passed", async () => {
    renderComponent({ vault: vaultMock });

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

  it("calls submitVaultData on form submission", async () => {
    const useVaultSubmitSpy = vi.spyOn(useVaultSubmit, "useVaultSubmit");

    useVaultSubmitSpy.mockReturnValue({
      submitVaultData: submitVaultDataMock,
      errors: [],
      loading: false,
    });
    renderComponent();

    fireEvent.change(screen.getByLabelText(/vault name/i), {
      target: { value: "Test Vault" },
    });
    fireEvent.change(screen.getByLabelText(/unlock code/i), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText(/vault type/i), {
      target: { value: "personal" },
    });
    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: "active" },
    });
    fireEvent.click(screen.getByLabelText(/is shared/i));

    fireEvent.click(screen.getByTestId("vault-submit-button"));

    await waitFor(() => {
      expect(submitVaultDataMock).toHaveBeenCalledWith({
        name: "Test Vault",
        unlock_code: "1234",
        description: "Test Description",
        vault_type: "personal",
        shared_with: [],
        status: "active",
        is_shared: true,
      });
    });
  });

  it("displays validation errors if they exist", () => {
    const errors = ["Vault name is required", "Unlock code is required"];
    const useVaultSubmitSpy = vi.spyOn(useVaultSubmit, "useVaultSubmit");
    useVaultSubmitSpy.mockReturnValue({
      submitVaultData: submitVaultDataMock,
      errors: errors,
      loading: false,
    });

    renderComponent();

    expect(screen.getByText(/vault name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/unlock code is required/i)).toBeInTheDocument();
  });

  it("disables the form while loading", () => {
    const useVaultSubmitSpy = vi.spyOn(useVaultSubmit, "useVaultSubmit");
    useVaultSubmitSpy.mockReturnValue({
      submitVaultData: submitVaultDataMock,
      errors: [],
      loading: true,
    });
    renderComponent();

    expect(screen.getByTestId("vault-submit-button")).toBeDisabled();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("closes the modal when clicking outside", async () => {
    renderComponent();

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
