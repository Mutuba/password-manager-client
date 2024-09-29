import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import PasswordRecordList from "../../components/PasswordRecordList";

// import * as passwordRecordService from "../../services/passwordRecordService";

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
  ];

  it("should records when available", async () => {
    render(
      <PasswordRecordList
        records={recordList}
        vault={vaultMock}
        userToken={userToken}
      />
    );
    await waitFor(() =>
      expect(screen.getByText("Daniel's Vault")).toBeInTheDocument()
    );
  });
});
