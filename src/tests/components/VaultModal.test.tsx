// import { render, screen, waitFor, fireEvent } from "@testing-library/react";
// import { MemoryRouter } from "react-router-dom";
// import * as router from "react-router";
// import { vi } from "vitest";
// import VaultModal from "../../components/VaultModal";
// import { AuthContext } from "../../context/AuthContext";
// import { AxiosError } from "axios";

// const navigate = vi.fn();
// beforeEach(() => {
//   vi.clearAllMocks();
//   vi.spyOn(router, "useNavigate").mockImplementation(() => navigate);
// });

// afterAll(() => {
//   vi.restoreAllMocks();
//   vi.clearAllMocks();
// });

// const userToken = "random-token";
// const userMock = {
//   first_name: "John",
//   last_name: "Doe",
//   username: "john_doe",
//   email: "johndoe@example.com",
//   password: "password",
// };

// const vaultMock = {
//   id: "3",
//   type: "vault",
//   attributes: {
//     id: "3",
//     name: "Daniel's Vault",
//     created_at: new Date(),
//     updated_at: new Date(),
//     last_accessed_at: new Date(),
//     description: "A vault to store my password records.",
//     vault_type: "business",
//     shared_with: [],
//     unlock_code: "random-unlock-code",
//     status: "active",
//     access_count: 0,
//     is_shared: false,
//     failed_attempts: 0,
//   },
// };

// const updatedVaultMock = {
//   id: "3",
//   type: "vault",
//   attributes: {
//     id: "3",
//     name: "Updated vault name",
//     created_at: new Date(),
//     updated_at: new Date(),
//     last_accessed_at: new Date(),
//     description: "A vault to store my password records.",
//     vault_type: "business",
//     shared_with: [],
//     unlock_code: "random-unlock-code",
//     status: "active",
//     access_count: 0,
//     is_shared: false,
//     failed_attempts: 0,
//   },
// };

// describe("Home Component", () => {
//   it("should display the vault modal when no vault is passed", async () => {
//     render(
//       <AuthContext.Provider
//         value={{
//           login: vi.fn(),
//           authError: null,
//           user: userMock,
//           userToken: userToken,
//           loading: false,
//           register: vi.fn(),
//           logout: vi.fn(),
//         }}
//       >
//         <MemoryRouter>
//           <VaultModal
//             setModalVisible={vi.fn()}
//             onClose={vi.fn()}
//             setVaults={vi.fn()}
//             visible={true}
//           />
//         </MemoryRouter>
//       </AuthContext.Provider>
//     );

//     expect(screen.getByText("Create vault")).toBeInTheDocument();
//     expect(screen.getByLabelText(/Vault Name/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Unlock Code/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Vault Type/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
//     expect(screen.getByTestId("vault-submit-button")).toBeInTheDocument();
//   });

//   it("should display the spinner when submit button is clicked after filling fields", async () => {
//     vi.mock("../../services/vaultService.ts", () => ({
//       createVault: vi.fn(() => Promise.resolve(vaultMock)),
//       updateVault: vi.fn(() => Promise.resolve(updatedVaultMock)),
//     }));
//     render(
//       <AuthContext.Provider
//         value={{
//           login: vi.fn(),
//           authError: null,
//           user: userMock,
//           userToken: userToken,
//           loading: false,
//           register: vi.fn(),
//           logout: vi.fn(),
//         }}
//       >
//         <MemoryRouter>
//           <VaultModal
//             setModalVisible={vi.fn()}
//             onClose={vi.fn()}
//             setVaults={vi.fn()}
//             visible={true}
//           />
//         </MemoryRouter>
//       </AuthContext.Provider>
//     );

//     const vaultNameInput = screen.getByLabelText("Vault Name");
//     fireEvent.change(vaultNameInput, {
//       target: { value: "New vault name" },
//     });

//     const codeInput = screen.getByLabelText("Unlock Code");
//     fireEvent.change(codeInput, {
//       target: { value: "Favouritepassword123!*" },
//     });

//     const descriptionInput = screen.getByLabelText("Description");
//     fireEvent.change(descriptionInput, {
//       target: { value: "A special vault." },
//     });

//     fireEvent.click(screen.getByTestId("vault-submit-button"));

//     await waitFor(() => {
//       expect(screen.getByTestId("spinner")).toBeInTheDocument();
//     });
//   });

//   it("should display error message when vault creation fails", async () => {
//     vi.mock("../../services/vaultService.ts", () => ({
//       createVault: vi.fn(() =>
//         Promise.reject("An error occurred while creating the vault.")
//       ),
//     }));
//     render(
//       <AuthContext.Provider
//         value={{
//           login: vi.fn(),
//           authError: null,
//           user: userMock,
//           userToken: userToken,
//           loading: false,
//           register: vi.fn(),
//           logout: vi.fn(),
//         }}
//       >
//         <MemoryRouter>
//           <VaultModal
//             setModalVisible={vi.fn()}
//             onClose={vi.fn()}
//             setVaults={vi.fn()}
//             visible={true}
//           />
//         </MemoryRouter>
//       </AuthContext.Provider>
//     );

//     const vaultNameInput = screen.getByLabelText("Vault Name");
//     fireEvent.change(vaultNameInput, {
//       target: { value: "New vault name" },
//     });

//     const codeInput = screen.getByLabelText("Unlock Code");
//     fireEvent.change(codeInput, {
//       target: { value: "Favouritepassword123!*" },
//     });

//     const descriptionInput = screen.getByLabelText("Description");
//     fireEvent.change(descriptionInput, {
//       target: { value: "A special vault." },
//     });

//     fireEvent.click(screen.getByTestId("vault-submit-button"));

//     await waitFor(() =>
//       expect(
//         screen.getByText("An error occurred while creating the vault.")
//       ).toBeInTheDocument()
//     );
//   });

//   it("should display the vault modal with data when vault is passed", async () => {
//     render(
//       <AuthContext.Provider
//         value={{
//           login: vi.fn(),
//           authError: null,
//           user: userMock,
//           userToken: userToken,
//           loading: false,
//           register: vi.fn(),
//           logout: vi.fn(),
//         }}
//       >
//         <MemoryRouter>
//           <VaultModal
//             vault={vaultMock}
//             setModalVisible={vi.fn()}
//             onClose={vi.fn()}
//             setVaults={vi.fn()}
//             visible={true}
//           />
//         </MemoryRouter>
//       </AuthContext.Provider>
//     );

//     await waitFor(() =>
//       expect(screen.getByText("Update vault")).toBeInTheDocument()
//     );
//     await waitFor(() =>
//       expect(screen.getByDisplayValue("Daniel's Vault")).toBeInTheDocument()
//     );
//     await waitFor(() =>
//       expect(
//         screen.getByDisplayValue("A vault to store my password records.")
//       ).toBeInTheDocument()
//     );
//   });

//   it("should display the spinner when submit button is clicked after updating fields", async () => {
//     vi.mock("../../services/vaultService.ts", () => ({
//       createVault: vi.fn(() => Promise.resolve(vaultMock)),
//       updateVault: vi.fn(() => Promise.resolve(updatedVaultMock)),
//     }));
//     render(
//       <AuthContext.Provider
//         value={{
//           login: vi.fn(),
//           authError: null,
//           user: userMock,
//           userToken: userToken,
//           loading: false,
//           register: vi.fn(),
//           logout: vi.fn(),
//         }}
//       >
//         <MemoryRouter>
//           <VaultModal
//             vault={vaultMock}
//             setModalVisible={vi.fn()}
//             onClose={vi.fn()}
//             setVaults={vi.fn()}
//             visible={true}
//           />
//         </MemoryRouter>
//       </AuthContext.Provider>
//     );

//     await waitFor(() =>
//       expect(screen.getByDisplayValue("Daniel's Vault")).toBeInTheDocument()
//     );

//     const vaultNameInput = screen.getByLabelText("Vault Name");
//     fireEvent.change(vaultNameInput, {
//       target: { value: "Updated vault name" },
//     });

//     fireEvent.click(screen.getByTestId("vault-submit-button"));

//     await waitFor(() =>
//       expect(screen.getByTestId("spinner")).toBeInTheDocument()
//     );
//   });
// });

// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import { vi } from "vitest";
// import VaultModal from "../../components/VaultModal";
// import { AuthContext } from "../../context/AuthContext";
// import { useVaultSubmit } from "../../hooks/useVaultSubmit";

// vi.mock("../hooks/useVaultSubmit", () => ({
//   useVaultSubmit: jest.fn(),
// }));

// describe("VaultModal", () => {
//   const mockSetVaults = vi.fn();
//   const mockOnClose = vi.fn();
//   const userToken = "random-token";
//   const userMock = {
//     first_name: "John",
//     last_name: "Doe",
//     username: "john_doe",
//     email: "johndoe@example.com",
//     password: "password",
//   };

//   const renderComponent = (props = {}) => {
//     const authContextValue = {
//       login: vi.fn(),
//       authError: null,
//       user: userMock,
//       userToken: userToken,
//       loading: false,
//       register: vi.fn(),
//       logout: vi.fn(),
//     };
//     return render(
//       <AuthContext.Provider value={authContextValue}>
//         <VaultModal
//           visible={true}
//           setModalVisible={jest.fn()}
//           onClose={mockOnClose}
//           setVaults={mockSetVaults}
//           {...props}
//         />
//       </AuthContext.Provider>
//     );
//   };

//   beforeEach(() => {
//     mockSetVaults.mockClear();
//     mockOnClose.mockClear();

//     useVaultSubmit.mockReturnValue({
//       submitVaultData: vi.fn(), // Use vi.fn() instead of jest.fn()
//       errors: [],
//       loading: false,
//     });
//   });

//   it("renders the modal with the form fields", () => {
//     renderComponent();

//     expect(screen.getByLabelText(/vault name/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/unlock code/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/vault type/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/is shared/i)).toBeInTheDocument();
//   });

//   it("calls submitVaultData on form submission", async () => {
//     const submitVaultDataMock = jest.fn();
//     (useVaultSubmit as jest.Mock).mockReturnValue({
//       submitVaultData: submitVaultDataMock,
//       errors: [],
//       loading: false,
//     });

//     renderComponent();

//     fireEvent.change(screen.getByLabelText(/vault name/i), {
//       target: { value: "Test Vault" },
//     });
//     fireEvent.change(screen.getByLabelText(/unlock code/i), {
//       target: { value: "1234" },
//     });
//     fireEvent.change(screen.getByLabelText(/description/i), {
//       target: { value: "Test Description" },
//     });
//     fireEvent.change(screen.getByLabelText(/vault type/i), {
//       target: { value: "personal" },
//     });
//     fireEvent.change(screen.getByLabelText(/status/i), {
//       target: { value: "active" },
//     });
//     fireEvent.click(screen.getByLabelText(/is shared/i));

//     fireEvent.click(screen.getByTestId("vault-submit-button"));

//     await waitFor(() => {
//       expect(submitVaultDataMock).toHaveBeenCalledWith({
//         name: "Test Vault",
//         unlock_code: "1234",
//         description: "Test Description",
//         vault_type: "personal",
//         shared_with: [],
//         status: "active",
//         is_shared: true,
//       });
//     });
//   });

//   it("displays validation errors if they exist", () => {
//     const errors = ["Vault name is required", "Unlock code is required"];
//     (useVaultSubmit as jest.Mock).mockReturnValue({
//       submitVaultData: jest.fn(),
//       errors,
//       loading: false,
//     });

//     renderComponent();

//     expect(screen.getByText(/vault name is required/i)).toBeInTheDocument();
//     expect(screen.getByText(/unlock code is required/i)).toBeInTheDocument();
//   });

//   it("disables the form while loading", () => {
//     (useVaultSubmit as jest.Mock).mockReturnValue({
//       submitVaultData: jest.fn(),
//       errors: [],
//       loading: true,
//     });

//     renderComponent();

//     expect(screen.getByTestId("vault-submit-button")).toBeDisabled();
//   });

//   it("closes the modal when clicking outside", async () => {
//     renderComponent();

//     fireEvent.mouseDown(document.body);

//     await waitFor(() => {
//       expect(mockOnClose).toHaveBeenCalled();
//     });
//   });
// });
