import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AxiosRequestHeaders } from "axios";
import PasswordRecordItem from "../../components/PasswordRecordItem";
import { AuthContext } from "../../context/AuthContext";
import * as passwordRecordService from "../../services/passwordRecordService";

describe("PasswordRecordItem", () => {
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

  const userMock = {
    first_name: "John",
    last_name: "Doe",
    username: "john_doe",
    email: "johndoe@example.com",
    password: "password",
  };

  const onDecrypt = vi.fn();
  const maskPassword = vi.fn();
  const onRecordDeleted = vi.fn();

  it("renders password record details", () => {
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
        <PasswordRecordItem
          record={mockRecord}
          decrypted={false}
          onDecrypt={onDecrypt}
          maskPassword={maskPassword}
          onRecordDeleted={onRecordDeleted}
        />
      </AuthContext.Provider>
    );

    expect(screen.getByText("Username:")).toBeInTheDocument();
    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("Password:")).toBeInTheDocument();
    expect(screen.getByText("••••••••")).toBeInTheDocument();
    expect(screen.getByText("URL:")).toBeInTheDocument();
    expect(screen.getByText("This is a test note.")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
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
        <PasswordRecordItem
          record={mockRecord}
          decrypted={false}
          onDecrypt={onDecrypt}
          maskPassword={maskPassword}
          onRecordDeleted={onRecordDeleted}
        />
      </AuthContext.Provider>
    );

    const viewButton = screen.getByTestId("mask-unmask-password-btn");
    fireEvent.click(viewButton);

    expect(onDecrypt).toHaveBeenCalledTimes(1);
  });

  it("calls maskPassword when unmasking", () => {
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
        <PasswordRecordItem
          record={mockRecord}
          decrypted={true}
          onDecrypt={onDecrypt}
          maskPassword={maskPassword}
          onRecordDeleted={onRecordDeleted}
        />
      </AuthContext.Provider>
    );

    const maskButton = screen.getByTestId("mask-unmask-password-btn");
    fireEvent.click(maskButton);

    expect(maskPassword).toHaveBeenCalledTimes(1);
  });

  it("toggles actions menu visibility", () => {
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
        <PasswordRecordItem
          record={mockRecord}
          decrypted={false}
          onDecrypt={onDecrypt}
          maskPassword={maskPassword}
          onRecordDeleted={onRecordDeleted}
        />
      </AuthContext.Provider>
    );

    const ellipsisButton = screen.getByTestId("ellipsis-action-menu");
    fireEvent.click(ellipsisButton);

    expect(screen.getByText("Delete Record")).toBeInTheDocument();
  });

  it("opens delete confirmation modal", async () => {
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
        <PasswordRecordItem
          record={mockRecord}
          decrypted={false}
          onDecrypt={onDecrypt}
          maskPassword={maskPassword}
          onRecordDeleted={onRecordDeleted}
        />
      </AuthContext.Provider>
    );

    const ellipsisButton = screen.getByTestId("ellipsis-action-menu");
    fireEvent.click(ellipsisButton);

    const deleteButton = screen.getByText("Delete Record");
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(screen.getByText("Delete Vault?")).toBeInTheDocument()
    );
  });

  it("deletes the password record on confirmation", async () => {
    const deletePasswordRecordSpy = vi.spyOn(
      passwordRecordService,
      "deletePasswordRecord"
    );

    const mockResponse = {
      data: {},
      status: 204,
      statusText: "No Content",
      headers: {},
      config: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer your-token-here`,
        } as AxiosRequestHeaders,
      },
    };

    deletePasswordRecordSpy.mockResolvedValue(mockResponse);
    render(
      <AuthContext.Provider
        value={{
          login: vi.fn(),
          authError: null,
          user: userMock,
          userToken: "random-user-token",
          loading: false,
          register: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <PasswordRecordItem
          record={mockRecord}
          decrypted={false}
          onDecrypt={onDecrypt}
          maskPassword={maskPassword}
          onRecordDeleted={onRecordDeleted}
        />
      </AuthContext.Provider>
    );

    const ellipsisButton = screen.getByTestId("ellipsis-action-menu");
    fireEvent.click(ellipsisButton);

    const deleteButton = screen.getByTestId("record-delete-button");
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByTestId("confirm-button");
    fireEvent.click(confirmButton);
    fireEvent.click(confirmButton);

    await waitFor(() =>
      expect(deletePasswordRecordSpy).toHaveBeenCalledTimes(1)
    );
    expect(onRecordDeleted).toHaveBeenCalledWith(mockRecord);
    expect(screen.queryByText("Delete Vault")).not.toBeInTheDocument();
  });

  it("shows an error if deletion fails", async () => {
    const deletePasswordRecordSpy = vi.spyOn(
      passwordRecordService,
      "deletePasswordRecord"
    );
    deletePasswordRecordSpy.mockRejectedValue("Deletion failed");
    render(
      <AuthContext.Provider
        value={{
          login: vi.fn(),
          authError: null,
          user: userMock,
          userToken: "random-user-token",
          loading: false,
          register: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <PasswordRecordItem
          record={mockRecord}
          decrypted={false}
          onDecrypt={onDecrypt}
          maskPassword={maskPassword}
          onRecordDeleted={onRecordDeleted}
        />
      </AuthContext.Provider>
    );

    const ellipsisButton = screen.getByTestId("ellipsis-action-menu");
    fireEvent.click(ellipsisButton);

    const deleteButton = screen.getByTestId("record-delete-button");
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByTestId("confirm-button");

    fireEvent.click(confirmButton);

    await waitFor(() =>
      expect(screen.getByText("Deletion failed")).toBeInTheDocument()
    );
  });
});
