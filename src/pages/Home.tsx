// src/pages/Home.tsx

import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>Loading...</div>;
  }

  const { user } = authContext;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-center">
          Welcome to the Home Page!
        </h1>
        {user ? (
          <>
            <p className="text-gray-700 text-center">
              Hello, <span className="font-semibold">{user.username}</span>! You
              have successfully logged in.
            </p>
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() =>
                  console.log("Explore functionality coming soon!")
                }
              >
                Explore
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-700 text-center">
            Loading user information...
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
