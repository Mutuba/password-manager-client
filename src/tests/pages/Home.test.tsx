import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Home from "../../pages/Home";
import { AuthContext } from "../../context/AuthContext";

beforeAll(() => {
  vi.spyOn(global.Date, "now").mockImplementation(() => 1637842997000);
});

afterAll(() => {
  vi.restoreAllMocks();
});

const userToken = "random-token";
const vaultDataMock = [
  {
    id: 3,
    type: "vault",
    attributes: {
      id: 3,
      name: "Daniel's Vault",
      created_at: "2024-09-19T12:13:19.862Z",
      updated_at: "2024-09-24T07:47:32.790Z",
      last_accessed_at: "2024-09-23T13:37:18.541Z",
      description: "A vault to store my password records.",
      vault_type: "business",
      shared_with: [],
      status: "active",
      access_count: 0,
      is_shared: false,
      failed_attempts: 0,
    },
    relationships: {
      password_records: {
        data: [],
      },
    },
  },
];

vi.mock("../../services/vaultService.ts", () => ({
  fetchVaults: vi.fn(() => Promise.resolve(vaultDataMock)),
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
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => expect(screen.getByText(/John/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/Hello/i)).toBeInTheDocument());
  });

  it("should display the user's username if first name is not available", async () => {
    const userMock = {
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
          userToken: null,
          loading: false,
          register: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <Home />
      </AuthContext.Provider>
    );

    await waitFor(() => expect(screen.getByText(/Hello/i)).toBeInTheDocument());
    await waitFor(() =>
      expect(screen.getByText(/john_doe/i)).toBeInTheDocument()
    );
  });

  it("should display vaults after fetching", async () => {
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
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() =>
      expect(screen.getByText("Daniel's Vault")).toBeInTheDocument()
    );
  });

  it("should display the create vault modal when create button is clicked", async () => {
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
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("create-vault-btn")).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText("+ New Vault")).toBeInTheDocument()
    );

    const createButton = screen.getByText("+ New Vault");
    fireEvent.click(createButton);

    await waitFor(() =>
      expect(screen.getByText("Create vault")).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByTestId("create-vault-modal")).toBeInTheDocument()
    );
  });
});
