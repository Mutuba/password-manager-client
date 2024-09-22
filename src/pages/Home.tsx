import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../shared/Spinner";
import { fetchVaults } from "../services/vaultService";
import VaultModal from "../components/VaultModal";
import { Vault } from "../types/VaultTypes";
import VaultCard from "../components/VaultCard";

const Home: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { user, userToken } = authContext;
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [vaultsUpdated, setVaultsUpdated] = useState<boolean>(false);

  const fetchAllVaults = async () => {
    setLoading(true);
    setError(null);

    if (!userToken) {
      setError("User token is missing.");
      setLoading(false);
      return;
    }

    try {
      const vaultsData = await fetchVaults(userToken);
      setVaults(vaultsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVaults();
  }, [vaultsUpdated]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <VaultModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
        onClose={() => setModalVisible(false)}
        setVaults={setVaults}
        setVaultsUpdated={setVaultsUpdated}
      />
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
              onClick={() => setModalVisible(true)}
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
                  <VaultCard key={vault.id} vault={vault} />
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
