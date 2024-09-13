import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../shared/Spinner";
import Navbar from "../shared/NavBar";

const Home: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Spinner />;
  }

  const { user } = authContext;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg space-y-4">
          <h1 className="text-2xl font-bold text-center">
            Welcome to the Home Page!
          </h1>
          {user ? (
            <p className="text-gray-700 text-center">
              Hello,{" "}
              <span className="font-semibold">
                {user.first_name || user.username}
              </span>
              ! You have successfully logged in.
            </p>
          ) : (
            <p className="text-gray-700 text-center">
              Loading user information...
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
