import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import VaultCard from "../../components/VaultCard";
import { AuthContext } from "../../context/AuthContext";

afterAll(() => {
  vi.restoreAllMocks();
});

const userToken = "random-token";

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
    const userMock = {
      first_name: "John",
      last_name: "Doe",
      username: "john_doe",
      email: "johndoe@example.com",
      password: "password",
    };

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

    await waitFor(() => expect(screen.getByText(/John/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/Hello/i)).toBeInTheDocument());
  });
});
