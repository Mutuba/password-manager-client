import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Vault } from "../types/VaultTypes";
import { PasswordRecord } from "../types/PasswordRecordTypes";

import PasswordRecordList from "./PasswordRecordList";
import { vaultLogin } from "../services/vaultService";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../shared/Spinner";

const VaultDetails: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  const { userToken } = authContext;
  const [records, setRecords] = useState<PasswordRecord[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [unlockCode, setUnlockCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);
  const [vault, setVault] = useState<Vault | null>(null);

  const navigate = useNavigate();

  const handleVaultAccess = async () => {
    if (isVaultOpen) {
      setRecords(null);
      setIsVaultOpen(false);
      return;
    }

    setLoading(true);
    setErrors([]);
    if (!userToken) {
      setErrors(["User token is missing."]);
      setLoading(false);
      return;
    }

    if (!id) {
      setErrors(["Something went wrong"]);
      setLoading(false);
      return;
    }
    if (!unlockCode) {
      setErrors(["Unlock code is required to access the vault."]);
      setLoading(false);
      return;
    }
    try {
      const responseData = await vaultLogin(userToken, parseInt(id), {
        unlock_code: unlockCode,
      });

      setVault(responseData.data);
      setRecords(responseData.included);
      setIsVaultOpen(true);
      setErrors([]);
      setUnlockCode("");
    } catch (err: any) {
      setErrors(Array.isArray(err) ? err : [err]);
      setRecords(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg max-w-lg w-full">
        {vault && (
          <>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {vault.attributes?.name}
            </h3>
            {vault.attributes?.description && (
              <p className="text-sm text-gray-700 mb-4">
                {vault.attributes.description}
              </p>
            )}
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Type:</span>{" "}
              {vault.attributes?.vault_type}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Status:</span>{" "}
              {vault.attributes?.status}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Created At:</span>{" "}
              {new Date(vault.attributes?.created_at).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">Last Accessed At:</span>{" "}
              {new Date(vault.attributes?.last_accessed_at).toLocaleString()}
            </p>
          </>
        )}

        <div className="mt-4">
          {!isVaultOpen && (
            <input
              type="password"
              value={unlockCode}
              required
              onChange={(e) => setUnlockCode(e.target.value)}
              placeholder="Enter unlock code"
              className="border border-gray-300 rounded-md p-3 mb-4 w-full focus:outline-none focus:ring focus:ring-green-300"
            />
          )}
          {loading && <Spinner />}
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors w-full"
            onClick={handleVaultAccess}
          >
            {isVaultOpen ? "Close Vault" : "Access Vault"}
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mt-4">
            <ul className="text-red-600">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {isVaultOpen && records?.length === 0 && (
          <div className="text-center text-gray-500 mt-4">
            No password records found in this vault.
          </div>
        )}

        {isVaultOpen && records && records.length > 0 && (
          <PasswordRecordList records={records} userToken={userToken} />
        )}

        {isVaultOpen && (
          <button
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        )}
      </div>
    </div>
  );
};

export default VaultDetails;
