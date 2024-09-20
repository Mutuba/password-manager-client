import React, { useState, useContext } from "react";
import { Vault, PasswordRecord } from "../types/VaultTypes";
import PasswordRecordList from "./PasswordRecordList";
import { vaultLogin } from "../services/vaultService";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../shared/Spinner";

interface VaultCardProps {
  vault: Vault;
}

const VaultCard: React.FC<VaultCardProps> = ({ vault }) => {
  const authContext = useContext(AuthContext);
  const { userToken } = authContext;
  const [records, setRecords] = useState<PasswordRecord[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [unlockCode, setUnlockCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);

  const handleAccessVault = async (vaultId: number) => {
    if (isVaultOpen) {
      setRecords(null);
      setIsVaultOpen(false);
      return;
    }

    setLoading(true);
    setErrors([""]);
    if (!userToken) {
      setErrors(["User token is missing."]);
      setLoading(false);
      return;
    }
    if (!unlockCode) {
      setErrors(["Unlock code is required to access the vault."]);
      setLoading(false);
      return;
    }
    try {
      const response = await vaultLogin(userToken, vaultId, {
        unlock_code: unlockCode,
      });
      setRecords(response.data);
      setIsVaultOpen(true);
      setErrors([""]);
      setUnlockCode("");
    } catch (err: any) {
      setErrors(Array.isArray(err) ? err : [err]);
      setRecords(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md max-w-xs">
      <h3 className="text-lg font-semibold text-gray-800">
        {vault.attributes.name}
      </h3>
      {vault.attributes.description && (
        <p className="text-sm text-gray-600 truncate max-w-full">
          {vault.attributes.description}
        </p>
      )}
      <p className="text-xs text-gray-500">
        Type: {vault.attributes.vault_type}
      </p>
      <p className="text-xs text-gray-500">Status: {vault.attributes.status}</p>
      <p className="text-xs text-gray-500">
        Created At: {new Date(vault.attributes.created_at).toLocaleString()}
      </p>
      <p className="text-xs text-gray-500">
        Last Accessed At:{" "}
        {new Date(vault.attributes.last_accessed_at).toLocaleString()}
      </p>
      <div className="mt-4">
        {!isVaultOpen && (
          <input
            type="text"
            value={unlockCode}
            required
            onChange={(e) => setUnlockCode(e.target.value)}
            placeholder="Enter unlock code"
            className="border border-gray-300 rounded p-2 mb-2 w-full"
          />
        )}
        {loading && <Spinner />}
        <button
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 w-full"
          onClick={() => handleAccessVault(vault.id)}
        >
          {isVaultOpen ? "Close Vault" : "Access Vault"}
        </button>
      </div>
      {errors.length > 0 && (
        <div className="mb-4">
          <ul className="text-red-500">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      {isVaultOpen && records && (
        <PasswordRecordList records={records} userToken={userToken} />
      )}
    </div>
  );
};

export default VaultCard;
