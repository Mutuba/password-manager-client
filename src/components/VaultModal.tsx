import React, { useState, useContext, Dispatch, SetStateAction } from "react";
import { AuthContext } from "../context/AuthContext";
import { createVault } from "../services/vaultService";
import { Vault } from "../types/VaultTypes";
import Spinner from "../shared/Spinner";

interface VaultModalProps {
  visible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  setVaults: Dispatch<SetStateAction<Vault[]>>;
}

const vaultTypeOptions = [
  { value: 0, label: "Personal" },
  { value: 0, label: "Business" },
  { value: 0, label: "Shared" },
  { value: 1, label: "Temporary" },
];

const statusOptions = [
  { value: 0, label: "Active" },
  { value: 1, label: "Archived" },
  { value: 1, label: "Deleted" },
  { value: 1, label: "Locked" },
];

const VaultModal: React.FC<VaultModalProps> = ({
  visible,
  onClose,
  setModalVisible,
  setVaults,
}) => {
  const authContext = useContext(AuthContext);
  const { userToken } = authContext;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [unlockCode, setUnlockCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [vaultType, setVaultType] = useState<number>(0);
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [status, setStatus] = useState<number>(0);
  const [isShared, setIsShared] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!userToken) {
      setError("User token is missing.");
      setLoading(false);
      return;
    }

    try {
      const vaultData = await createVault(userToken, {
        name,
        unlock_code: unlockCode,
        description,
        vault_type: vaultType,
        shared_with: sharedWith,
        status,
        is_shared: isShared,
      });
      setVaults((prevVaults) => [...prevVaults, vaultData]);
      setModalVisible(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Create New Vault</h3>
        {loading && <Spinner />}
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="vaultName">
              Vault Name
            </label>
            <input
              type="text"
              id="vaultName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="unlockCode">
              Unlock Code
            </label>
            <input
              type="text"
              id="unlockCode"
              value={unlockCode}
              onChange={(e) => setUnlockCode(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 mb-2"
              htmlFor="vaultDescription"
            >
              Description
            </label>
            <textarea
              id="vaultDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="vaultType">
              Vault Type
            </label>
            <select
              id="vaultType"
              value={vaultType}
              onChange={(e) => setVaultType(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              {vaultTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isShared"
              checked={isShared}
              onChange={() => setIsShared(!isShared)}
              className="mr-2"
            />
            <label htmlFor="isShared" className="text-gray-700">
              Is Shared
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="sharedWith">
              Shared With (comma-separated emails)
            </label>
            <input
              type="text"
              id="sharedWith"
              value={sharedWith.join(", ")}
              onChange={(e) =>
                setSharedWith(
                  e.target.value.split(",").map((email) => email.trim())
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create Vault
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaultModal;
