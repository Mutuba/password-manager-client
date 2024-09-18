import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../shared/NavBar";
import Spinner from "../shared/Spinner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Vault {
  id: number;
  type: string;
  attributes: {
    id: string;
    name: string;
    last_accessed_at: Date;
    description: string;
    vault_type: string;
    shared_with: string[];
    status: string;
    access_count: number;
    is_shared: boolean;
    failed_attempts: number;
    created_at: string;
    updated_at: string;
  };
}

const Home: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { user, userToken } = authContext;

  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVaults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/vaults`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setVaults(response.data.data);
      } catch (err) {
        setError("Failed to fetch vaults. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchVaults();
    }
    console.log("useEffect running");
  }, []);

  const handleCreateVault = () => {
    console.log("Create a new vault");
  };

  console.log("After loadings", vaults);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center p-6 space-y-8">
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg space-y-4">
          {user && (
            <p className="text-gray-700 text-center">
              Hello,{" "}
              <span className="font-semibold">
                {user?.first_name || user?.username}
              </span>
              ! Manage your vaults below.
            </p>
          )}
        </div>

        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Vaults</h2>
            <button
              onClick={handleCreateVault}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create New Vault
            </button>
          </div>

          {loading && <Spinner />}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vaults.length > 0 ? (
                vaults.map((vault: Vault) => (
                  <div
                    key={vault.id}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {vault.attributes.name}
                    </h3>
                    {vault.attributes.description && (
                      <p className="text-sm text-gray-600">
                        {vault.attributes.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Type: {vault.attributes.vault_type}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {vault.attributes.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created At:{" "}
                      {new Date(vault.attributes.created_at).toLocaleString()}
                    </p>
                    <div className="mt-4">
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        onClick={() => console.log("Access Vault", vault.id)}
                      >
                        Access Vault
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">You don't have any vaults yet.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
