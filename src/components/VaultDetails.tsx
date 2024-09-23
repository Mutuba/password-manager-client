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
      <div className="relative bg-white border border-gray-200 rounded-lg p-8 shadow-lg max-w-2xl w-full">
        {isVaultOpen && (
          <button
            className="absolute top-4 right-4 flex items-center bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg hover:bg-red-700 transition"
            onClick={() => {
              setIsVaultOpen(false);
              setRecords(null);
            }}
          >
            <span className="text-xl mr-1">✕</span>
            Close
          </button>
        )}

        {vault && (
          <>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              {vault.attributes?.name}
            </h3>
            {vault.attributes?.description && (
              <p className="text-sm text-gray-700 mb-6 text-center">
                {vault.attributes.description}
              </p>
            )}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Type:</span>{" "}
                {vault.attributes?.vault_type}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Status:</span>{" "}
                {vault.attributes?.status}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Created At:</span>{" "}
                {new Date(vault.attributes?.created_at).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Last Accessed At:</span>{" "}
                {new Date(vault.attributes?.last_accessed_at).toLocaleString()}
              </p>
            </div>
          </>
        )}

        <div className="mt-6">
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
          {!isVaultOpen && (
            <button
              className="bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors w-full font-semibold"
              onClick={handleVaultAccess}
            >
              Access Vault
            </button>
          )}
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

        {isVaultOpen && records && (
          <PasswordRecordList
            records={records}
            userToken={userToken}
            vault={vault}
          />
        )}

        {isVaultOpen && (
          <div className="mt-6 flex justify-center">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultDetails;
