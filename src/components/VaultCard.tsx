import { Link } from "react-router-dom";
import React, { useState, useContext, Dispatch, SetStateAction } from "react";
import { Vault } from "../types/VaultTypes";
import { deleteVault } from "../services/vaultService";
import ConfirmationModal from "../shared/ConfirmationModal";
import VaultModal from "./VaultModal";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../shared/Spinner";

interface VaultCardProps {
  vault: Vault;
  setVaultsUpdated: Dispatch<SetStateAction<boolean>>;
}

const VaultCard: React.FC<VaultCardProps> = ({ vault, setVaultsUpdated }) => {
  const authContext = useContext(AuthContext);
  const { userToken } = authContext;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setLoading(true);
    setErrors([]);
    if (!userToken) {
      setErrors(["User token is missing."]);
      setLoading(false);
      return;
    }

    try {
      await deleteVault(userToken, vault.id);
      setIsDeleteModalOpen(false);
      setVaultsUpdated((prev) => !prev);
    } catch (error) {
      setErrors(Array.isArray(error) ? error : [error]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 max-w-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {loading && <Spinner />}
        {errors.length > 0 && (
          <div className="mb-4">
            <ul className="text-red-500">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {vault?.attributes?.name}
      </h3>
      {vault?.attributes?.description && (
        <p className="text-sm text-gray-700 mb-4 truncate max-w-full leading-relaxed">
          {vault?.attributes?.description}
        </p>
      )}
      <p className="text-sm text-gray-500 mb-1">
        <span className="font-medium">Type:</span>{" "}
        {vault?.attributes?.vault_type}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-medium">Status:</span> {vault?.attributes?.status}
      </p>

      <div className="flex flex-col space-y-2">
        <Link
          to={`/vault/${vault?.id}/details`}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 w-full text-center"
        >
          Access Vault
        </Link>

        {/* Update Vault Button */}
        <button
          onClick={() => setIsVaultModalOpen(true)} // Open the modal when clicked
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 w-full"
        >
          Update Vault
        </button>

        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200 w-full"
        >
          Delete Vault
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          title="Delete Vault"
          message={
            <>
              Are you sure you want to delete the vault{" "}
              <strong>{vault?.attributes?.name}</strong>? This action cannot be
              undone.
            </>
          }
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}

      {/* Vault Modal for creating/updating a vault */}
      {isVaultModalOpen && (
        <VaultModal
          visible={isVaultModalOpen}
          setModalVisible={setIsVaultModalOpen}
          setVaultsUpdated={setVaultsUpdated}
          setVaults={() => {}} // If needed, add logic to update vaults
          vault={vault} // Pass the vault data for updating
          onClose={() => setIsVaultModalOpen(false)} // Close the modal
        />
      )}
    </div>
  );
};

export default VaultCard;
