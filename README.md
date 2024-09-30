# Password Guardian Frontend

This is the frontend of the Password Guardian, built using React, Tailwind CSS, and React Router. The application includes user authentication, a vault details page, and secure handling of encryption and decryption.

## Table of Contents

- Features
- Tech Stack
- Prerequisites
- Installation
- Running the Application
- Folder Structure
- Available Scripts
- Environment Variables
- Key Components
- Contributing
- License

## Features

- User Authentication: Login and registration pages integrated with the backend authentication service.
- Vault Management: View and manage vault details securely.
- Encryption & Decryption: Secure encryption and decryption using user-provided keys.
- Responsive Design: Mobile-friendly layout using Tailwind CSS.
- Error Handling: Toast notifications for successful actions or errors.
- React Router: Routing for handling navigation between different pages.
- Protected Routes: Restricts access to certain pages for unauthorized users.

## Tech Stack

- React (Frontend framework)
- TypeScript (Type safety)
- Tailwind CSS (Utility-first CSS framework)
- React Router (Routing)
- React Toastify (Notifications)
- Context API (State management for user authentication)

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (>= 14.x)
- npm or yarn
- An IDE or text editor like VSCode

## Installation

1. Clone the Repository

```javascript
git clone https://github.com/Mutuba/password-manager-client.git
cd vault-security-frontend
```

2. Install Dependencies

Using npm:

`npm install`

3. Configure Environment Variables

Create a .env file at the root of your project with the following environment variables:

```javascript
REACT_APP_API_URL=http://localhost:5000/api

```

- REACT_APP_API_URL: The URL of your backend API server (make sure the backend is running).
- REACT_APP_TOAST_POSITION: Position of Toast notifications (optional).

## Running the Application

1. Start the Development Server

To run the app in development mode:

`npm run dev`

## Folder Structure

.
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│ ├── \_redirects
│ └── vite.svg
├── setupTests.ts
├── src
│ ├── App.tsx
│ ├── assets
│ │ ├── images
│ │ │ ├── vault-background.svg
│ │ │ └── vault-bg.svg
│ │ └── logo.svg
│ ├── components
│ │ ├── DecryptPasswordModal.tsx
│ │ ├── PasswordRecordItem.tsx
│ │ ├── PasswordRecordList.tsx
│ │ ├── PasswordRecordModal.tsx
│ │ ├── VaultCard.tsx
│ │ ├── VaultDetails.tsx
│ │ ├── VaultModal.tsx
│ │ └── authentication
│ │ ├── Login.tsx
│ │ └── Register.tsx
│ ├── context
│ │ └── AuthContext.tsx
│ ├── hooks
│ │ ├── useVaultForm.ts
│ │ └── useVaultSubmit.ts
│ ├── index.css
│ ├── main.tsx
│ ├── pages
│ │ └── Home.tsx
│ ├── services
│ │ ├── errorHandler.ts
│ │ ├── passwordRecordService.ts
│ │ └── vaultService.ts
│ ├── shared
│ │ ├── ConfirmationModal.tsx
│ │ ├── NavBar.tsx
│ │ └── Spinner.tsx
│ ├── tests
│ │ ├── components
│ │ │ ├── DecryptPasswordModal.test.tsx
│ │ │ ├── PasswordRecordItem.test.tsx
│ │ │ ├── PasswordRecordList.test.tsx
│ │ │ ├── PasswordRecordModal.test.tsx
│ │ │ ├── VaultCard.test.tsx
│ │ │ ├── VaultDetails.test.tsx
│ │ │ ├── VaultModal.test.tsx
│ │ │ └── authentication
│ │ │ ├── Login.test.tsx
│ │ │ └── Register.test.tsx
│ │ ├── hooks
│ │ │ ├── useVaultSubmit.test.tsx
│ │ │ ├── users.service.tsx
│ │ │ └── users.test.tsx
│ │ └── pages
│ │ └── Home.test.tsx
│ ├── types
│ │ ├── AuthTypes.ts
│ │ ├── PasswordRecordTypes.ts
│ │ └── VaultTypes.ts
│ └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

## Key Components

1. Authentication Context (src/context/AuthContext.tsx)
   Handles the global state for user authentication using the React Context API.

2. ProtectedRoute (src/App.tsx)
   Protects certain routes and redirects unauthorized users to the login page.

3. Navbar (src/shared/NavBar.tsx)
   Displays the navigation bar for navigating between different sections of the app.

4. VaultDetails (src/components/VaultDetails.tsx)
   Displays detailed information about a specific vault, requiring a decryption key for access.

5. Toast Notifications
   Integrated via react-toastify, provides visual feedback for various user actions.
