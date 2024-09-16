import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import Register from "../../../components/authentication/Register";
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

describe("Register Component", () => {
  it("should render registeration form correctly", () => {
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
          <Register />
        </AuthContext.Provider>
      </Router>
    );

    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Register" })
    ).toBeInTheDocument();
  });

  it("should update input fields when filled", () => {
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
          <Register />
        </AuthContext.Provider>
      </Router>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(emailInput, { target: { value: "example@example.com" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("example@example.com");
    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("password123");
  });

  it("should call register on form submit and navigate on success", async () => {
    const mockRegister = vi.fn().mockResolvedValue({ success: true });
    render(
      <Router>
        <AuthContext.Provider
          value={{
            login: vi.fn(),
            authError: null,
            user: null,
            userToken: null,
            loading: false,
            register: mockRegister,
            logout: vi.fn(),
          }}
        >
          <Register />
        </AuthContext.Provider>
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "example@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() =>
      expect(mockRegister).toHaveBeenCalledWith({
        first_name: "",
        last_name: "",
        email: "example@example.com",
        username: "testuser",
        password: "password123",
      })
    );

    await waitFor(() => expect(mockedUseNavigate).toHaveBeenCalledWith("/"));
  });

  it("should display error message on registration failure", async () => {
    const mockRegister = vi.fn().mockResolvedValue({ success: false });
    const authError = "Email and username already exists";

    render(
      <Router>
        <AuthContext.Provider
          value={{
            login: vi.fn(),
            authError: authError,
            user: null,
            userToken: null,
            loading: false,
            register: mockRegister,
            logout: vi.fn(),
          }}
        >
          <Register />
        </AuthContext.Provider>
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "example@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(await screen.findByText(authError)).toBeInTheDocument();
  });
});
