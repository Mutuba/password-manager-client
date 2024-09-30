import { render, fireEvent, screen } from "@testing-library/react";
import DecryptPasswordModal from "../../components/DecryptPasswordModal";

describe("DecryptPasswordModal", () => {
  const mockSetDecryptionKey = vi.fn();
  const mockHandleDecrypt = vi.fn();
  const mockOnClose = vi.fn();
  const setShowDecryptModalMock = vi.fn();

  const renderComponent = (errors: string[] = [], decryptionKey = "") => {
    return render(
      <DecryptPasswordModal
        setShowDecryptModal={setShowDecryptModalMock}
        decryptionKey={decryptionKey}
        setDecryptionKey={mockSetDecryptionKey}
        handleDecrypt={mockHandleDecrypt}
        errors={errors}
        onClose={mockOnClose}
        showDecryptModal
      />
    );
  };

  test("renders the modal with the input field and buttons", () => {
    renderComponent();

    expect(
      screen.getByPlaceholderText("Enter decryption key")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("decrypt-password-modal-cancel-btn")
    ).toBeInTheDocument();
    expect(screen.getByTestId("decrypt-password-button")).toBeInTheDocument();
  });

  test("calls setDecryptionKey when the input value changes", () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Enter decryption key");

    fireEvent.change(input, { target: { value: "my-decryption-key" } });

    expect(mockSetDecryptionKey).toHaveBeenCalledWith("my-decryption-key");
  });

  test("displays errors when provided", () => {
    const errors = ["Invalid decryption key", "Server error"];
    renderComponent(errors);

    expect(screen.getByText("Invalid decryption key")).toBeInTheDocument();
    expect(screen.getByText("Server error")).toBeInTheDocument();
  });

  test("calls handleDecrypt when the decrypt button is clicked", () => {
    renderComponent();

    const decryptButton = screen.getByTestId("decrypt-password-button");
    fireEvent.click(decryptButton);

    expect(mockHandleDecrypt).toHaveBeenCalled();
  });

  test("calls onClose when the cancel button is clicked", () => {
    renderComponent();

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test("displays the decryption key value in the input", () => {
    renderComponent([], "test-key");

    const input = screen.getByPlaceholderText("Enter decryption key");

    expect(input).toHaveValue("test-key");
  });
});
