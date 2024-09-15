import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "../../../components/authentication/Login";
import { AuthContext } from "../../../context/AuthContext";

const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
  };
});

describe("Login Component", () => {
  test("should render login form correctly", () => {
    render(
      <Router>
        <AuthContext.Provider
          value={{
            login: vi.fn(),
            authError: null,
            user: null,
            userToken: null,
            loading: false,
            register: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <Login />
        </AuthContext.Provider>
      </Router>
    );

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  test("should update input fields when typing", () => {
    render(
      <Router>
        <AuthContext.Provider
          value={{
            login: vi.fn(),
            authError: null,
            user: null,
            userToken: null,
            loading: false,
            register: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <Login />
        </AuthContext.Provider>
      </Router>
    );

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("password123");
  });

  it("should call login function on form submit and navigate on success", async () => {
    const mockLogin = vi.fn().mockResolvedValue({ success: true });
    render(
      <Router>
        <AuthContext.Provider
          value={{
            login: mockLogin,
            authError: null,
            user: null,
            userToken: null,
            loading: false,
            register: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <Login />
        </AuthContext.Provider>
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      })
    );

    await waitFor(() => expect(mockedUseNavigate).toHaveBeenCalledWith("/"));
  });

  it("should display error message on login failure", async () => {
    const mockLogin = vi.fn().mockResolvedValue({ success: false });
    const authError = "Invalid username or password";

    render(
      <Router>
        <AuthContext.Provider
          value={{
            login: mockLogin,
            authError: authError,
            user: null,
            userToken: null,
            loading: false,
            register: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <Login />
        </AuthContext.Provider>
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(await screen.findByText(authError)).toBeInTheDocument();
  });
});
