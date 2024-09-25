import React, { useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useVaultForm } from "../hooks/useVaultForm";
import { useVaultSubmit } from "../hooks/useVaultSubmit";
import { Vault } from "../types/VaultTypes";
import Spinner from "../shared/Spinner";
import { statusOptions, vaultTypeOptions } from "../hooks/useVaultForm";

interface VaultModalProps {
  visible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setVaultsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  setVaults: React.Dispatch<React.SetStateAction<Vault[]>>;
  vault?: Vault;
}

const VaultModal: React.FC<VaultModalProps> = ({
  visible,
  onClose,
  setVaults,
  setVaultsUpdated,
  vault,
}) => {
  const authContext = useContext(AuthContext);
  const { userToken } = authContext;
  const {
    name,
    unlockCode,
    description,
    vaultType,
    sharedWith,
    status,
    isShared,
    setName,
    setUnlockCode,
    setDescription,
    setVaultType,
    setSharedWith,
    setStatus,
    setIsShared,
    resetForm,
  } = useVaultForm(vault);

  const { errors, loading, submitVaultData } = useVaultSubmit({
    userToken,
    vault,
    setVaults,
    onSuccess: () => {
      resetForm();
      setVaultsUpdated((prev) => !prev);
      onClose();
    },
  });

  const modalRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await submitVaultData({
      name,
      unlock_code: unlockCode,
      description,
      vault_type: vaultType,
      shared_with: sharedWith,
      status,
      is_shared: isShared,
    });
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (visible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      data-testid="create-vault-modal"
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
    >
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h3 className="text-lg font-semibold mb-4">
          {vault ? "Update vault" : "Create vault"}
        </h3>
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
          {!vault && (
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
          )}
          <div className="mb-4">
            <label
              className="block text-gray-700 mb-2"
              htmlFor="vaultDescription"
            >
              Description
            </label>
            <textarea
              id="vaultDescription"
              required
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
              onChange={(e) => setVaultType(e.target.value)}
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
              onChange={(e) => setStatus(e.target.value)}
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
              data-testid="vault-cancel-button"
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="vault-submit-button"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {vault ? "Update Vault" : "Create Vault"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaultModal;
