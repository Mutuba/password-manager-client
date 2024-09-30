import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PasswordRecordModal from "../../components/PasswordRecordModal";
import * as passwordRecordService from "../../services/passwordRecordService";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    dismiss: vi.fn(),
  },
}));

const mockOnClose = vi.fn();
const mockSetUpdatedRecords = vi.fn();

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

const mockRecord = {
  id: "1",
  type: "password_record",
  attributes: {
    username: "testuser",
    password: "password123",
    url: "https://example.com",
    notes: "This is a test note.",
    name: "Test Vault",
    created_at: new Date(),
    updated_at: new Date(),
  },
};

describe("PasswordRecordModal", () => {
  const defaultProps = {
    onClose: mockOnClose,
    userToken: "dummy_token",
    vault: vaultMock,
    setUpdatedRecords: mockSetUpdatedRecords,
    showAddRecordModal: true,
  };

  it("renders the modal with form fields", () => {
    render(<PasswordRecordModal {...defaultProps} />);

    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Encryption Key")).toBeInTheDocument();
  });

  it("validates the form and shows error messages when required fields are missing", async () => {
    render(<PasswordRecordModal {...defaultProps} />);

    fireEvent.click(screen.getByTestId("record-save-button"));
    expect(await screen.findByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Username is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
    expect(screen.getByText("Encryption key is required.")).toBeInTheDocument();
  });

  it("calls createPasswordRecord and updates records on successful submission", async () => {
    const createPasswordRecordSpy = vi.spyOn(
      passwordRecordService,
      "createPasswordRecord"
    );
    createPasswordRecordSpy.mockResolvedValue({ data: mockRecord });

    render(<PasswordRecordModal {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test Name" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "Test Username" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Test Password" },
    });
    fireEvent.change(screen.getByPlaceholderText("Encryption Key"), {
      target: { value: "Test Encryption Key" },
    });

    fireEvent.click(screen.getByTestId("record-save-button"));

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    await waitFor(() => {
      expect(createPasswordRecordSpy).toHaveBeenCalled();

      expect(toast.success).toHaveBeenCalledWith(
        "New record successfully created.",
        { toastId: "create_record-success" }
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("handles API errors and displays error messages", async () => {
    const errorMessage = "Error creating record";
    const createPasswordRecordSpy = vi.spyOn(
      passwordRecordService,
      "createPasswordRecord"
    );
    createPasswordRecordSpy.mockRejectedValue(errorMessage);

    render(<PasswordRecordModal {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test Name" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "Test Username" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Test Password" },
    });
    fireEvent.change(screen.getByPlaceholderText("Encryption Key"), {
      target: { value: "Test Encryption Key" },
    });

    fireEvent.click(screen.getByTestId("record-save-button"));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("closes the modal when clicking outside of it", () => {
    render(<PasswordRecordModal {...defaultProps} />);

    fireEvent.mouseDown(document);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
