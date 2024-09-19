import React from "react";
import { Vault } from "../types/VaultTypes";

interface VaultCardProps {
  vault: Vault;
}

const VaultCard: React.FC<VaultCardProps> = ({ vault }) => {
  const handleAccessVault = (id: number) => {
    console.log("Access Vault", id);
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
      <div className="mt-4">
        <button
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          onClick={() => handleAccessVault(vault.id)}
        >
          Access Vault
        </button>
      </div>
    </div>
  );
};

export default VaultCard;
