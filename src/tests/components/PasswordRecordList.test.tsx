import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import PasswordRecordList from "../../components/PasswordRecordList";
import * as passwordRecordService from "../../services/passwordRecordService";

describe("PasswordRecordList", () => {
  const userToken = "random-token";
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

  const recordList = [
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
  ];

  it("should display records when available", async () => {
    render(
      <PasswordRecordList
        records={recordList}
        vault={vaultMock}
        userToken={userToken}
      />
    );
    await waitFor(() => expect(screen.getByText("Pearl")).toBeInTheDocument());
  });

  it("should open the add record modal when the + Record button is clicked", async () => {
    render(
      <PasswordRecordList
        records={recordList}
        vault={vaultMock}
        userToken={userToken}
      />
    );

    const addButton = screen.getByText("+ Record");
    fireEvent.click(addButton);

    expect(screen.getByText("Add New Record")).toBeInTheDocument();
  });

  it("should decrypt a password and update the record", async () => {
    const decryptPasswordSpy = vi.spyOn(
      passwordRecordService,
      "decryptPassword"
    );
    decryptPasswordSpy.mockResolvedValue({ password: "DecryptedPassword123" });

    render(
      <PasswordRecordList
        records={recordList}
        vault={vaultMock}
        userToken={userToken}
      />
    );

    const decryptModalLauncher = screen.getByTestId("mask-unmask-password-btn");
    fireEvent.click(decryptModalLauncher);

    await waitFor(() => {
      expect(screen.getByTestId("decrypt-modal")).toBeVisible();
      expect(
        screen.getByPlaceholderText("Enter decryption key")
      ).toBeInTheDocument();
    });

    const decryptionKeyInput = screen.getByPlaceholderText(
      "Enter decryption key"
    );
    fireEvent.change(decryptionKeyInput, {
      target: { value: "some-random-decryption-key" },
    });

    const decryptButton = screen.getByTestId("decrypt-password-button");
    fireEvent.click(decryptButton);

    await waitFor(() => expect(decryptPasswordSpy).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getByText("DecryptedPassword123")).toBeInTheDocument()
    );
  });

  it("should mask a decrypted password", async () => {
    const decryptPasswordSpy = vi.spyOn(
      passwordRecordService,
      "decryptPassword"
    );
    decryptPasswordSpy.mockResolvedValue({ password: "DecryptedPassword123" });

    render(
      <PasswordRecordList
        records={recordList}
        vault={vaultMock}
        userToken={userToken}
      />
    );

    const decryptModalLauncher = screen.getByTestId("mask-unmask-password-btn");
    fireEvent.click(decryptModalLauncher);

    await waitFor(() => {
      expect(screen.getByTestId("decrypt-modal")).toBeVisible();
      expect(
        screen.getByPlaceholderText("Enter decryption key")
      ).toBeInTheDocument();
    });

    const decryptionKeyInput = screen.getByPlaceholderText(
      "Enter decryption key"
    );
    fireEvent.change(decryptionKeyInput, {
      target: { value: "some-random-decryption-key" },
    });

    const decryptButton = screen.getByTestId("decrypt-password-button");
    fireEvent.click(decryptButton);

    await waitFor(() =>
      expect(screen.getByText("DecryptedPassword123")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByTestId("mask-unmask-password-btn"));

    await waitFor(() =>
      expect(screen.queryByText("DecryptedPassword123")).not.toBeInTheDocument()
    );
  });

  it("should display an error message when decryption fails", async () => {
    const decryptPasswordSpy = vi.spyOn(
      passwordRecordService,
      "decryptPassword"
    );
    decryptPasswordSpy.mockRejectedValue("Decryption failed");

    render(
      <PasswordRecordList
        records={recordList}
        vault={vaultMock}
        userToken={userToken}
      />
    );
    const decryptModalLauncher = screen.getByTestId("mask-unmask-password-btn");
    fireEvent.click(decryptModalLauncher);

    await waitFor(() => {
      expect(screen.getByTestId("decrypt-modal")).toBeVisible();
      expect(
        screen.getByPlaceholderText("Enter decryption key")
      ).toBeInTheDocument();
    });

    const decryptionKeyInput = screen.getByPlaceholderText(
      "Enter decryption key"
    );
    fireEvent.change(decryptionKeyInput, {
      target: { value: "some-random-decryption-key" },
    });

    const decryptButton = screen.getByTestId("decrypt-password-button");
    fireEvent.click(decryptButton);

    await waitFor(() =>
      expect(screen.getByText("Decryption failed")).toBeInTheDocument()
    );
  });

  it("should close the decrypt modal when clicking outside", async () => {
    render(
      <PasswordRecordList
        records={recordList}
        vault={vaultMock}
        userToken={userToken}
      />
    );
    const decryptModalLauncher = screen.getByTestId("mask-unmask-password-btn");
    fireEvent.click(decryptModalLauncher);
    const modal = screen.getByTestId("decrypt-modal");
    fireEvent.mouseDown(document.body);
    await waitFor(() => expect(modal).not.toBeInTheDocument());
  });

  it("should display a message when no records are available", () => {
    render(
      <PasswordRecordList
        records={[]}
        vault={vaultMock}
        userToken={userToken}
      />
    );

    expect(
      screen.getByText("No records yet, add some records.")
    ).toBeInTheDocument();
  });
});
