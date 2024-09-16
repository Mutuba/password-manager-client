import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Home from "../../pages/Home";
import { AuthContext } from "../../context/AuthContext";

vi.mock("../../shared/NavBar", () => ({
  default: () => <div data-testid="navbar">Mock Navbar</div>,
}));

describe("Home Component", () => {
  it("should render Navbar component", () => {
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
          userToken: null,
          loading: false,
          register: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <Home />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("should display the user's first name if logged in", () => {
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
          userToken: null,
          loading: false,
          register: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <Home />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Hello/i)).toBeInTheDocument();
    expect(screen.getByText(/John/i)).toBeInTheDocument();
  });

  it("should display the user's username if first name is not available", () => {
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

    expect(screen.getByText(/Hello/i)).toBeInTheDocument();
    expect(screen.getByText(/john_doe/i)).toBeInTheDocument();
  });
});
