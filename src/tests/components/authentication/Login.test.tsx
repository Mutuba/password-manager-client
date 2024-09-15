// import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "../../../components/authentication/Login";
import { AuthContext } from "../../../context/AuthContext";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: vi.fn(),
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

    // Check if the login button is rendered
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  // it("should update input fields when typing", () => {
  //   render(
  //     <Router>
  //       <AuthContext.Provider value={{ login: jest.fn(), authError: null }}>
  //         <Login />
  //       </AuthContext.Provider>
  //     </Router>
  //   );

  //   const usernameInput = screen.getByPlaceholderText("Username");
  //   const passwordInput = screen.getByPlaceholderText("Password");

  //   fireEvent.change(usernameInput, { target: { value: "testuser" } });
  //   fireEvent.change(passwordInput, { target: { value: "password123" } });

  //   expect(usernameInput).toHaveValue("testuser");
  //   expect(passwordInput).toHaveValue("password123");
  // });

  // it("should call login function on form submit and navigate on success", async () => {
  //   const mockLogin = jest.fn().mockResolvedValue({ success: true });
  //   render(
  //     <Router>
  //       <AuthContext.Provider value={{ login: mockLogin, authError: null }}>
  //         <Login />
  //       </AuthContext.Provider>
  //     </Router>
  //   );

  //   // Simulate input changes
  //   fireEvent.change(screen.getByPlaceholderText("Username"), {
  //     target: { value: "testuser" },
  //   });
  //   fireEvent.change(screen.getByPlaceholderText("Password"), {
  //     target: { value: "password123" },
  //   });

  //   // Simulate form submission
  //   fireEvent.click(screen.getByRole("button", { name: /login/i }));

  //   await waitFor(() =>
  //     expect(mockLogin).toHaveBeenCalledWith({
  //       username: "testuser",
  //       password: "password123",
  //     })
  //   );

  //   // Expect navigate to be called on successful login
  //   await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
  // });

  // it("should display error message on login failure", async () => {
  //   const mockLogin = jest.fn().mockResolvedValue({ success: false });
  //   const authError = "Invalid username or password";

  //   render(
  //     <Router>
  //       <AuthContext.Provider value={{ login: mockLogin, authError }}>
  //         <Login />
  //       </AuthContext.Provider>
  //     </Router>
  //   );

  //   // Simulate form submission
  //   fireEvent.click(screen.getByRole("button", { name: /login/i }));

  //   // Check if the error message is displayed
  //   expect(await screen.findByText(authError)).toBeInTheDocument();
  // });
});
