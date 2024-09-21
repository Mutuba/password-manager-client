import { Link } from "react-router-dom";
import React from "react";
import { Vault } from "../types/VaultTypes";

interface VaultCardProps {
  vault: Vault;
}

const VaultCard: React.FC<VaultCardProps> = ({ vault }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 max-w-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {vault.attributes.name}
      </h3>
      {vault.attributes.description && (
        <p className="text-sm text-gray-700 mb-4 truncate max-w-full leading-relaxed">
          {vault.attributes.description}
        </p>
      )}
      <p className="text-sm text-gray-500 mb-1">
        <span className="font-medium">Type:</span> {vault.attributes.vault_type}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-medium">Status:</span> {vault.attributes.status}
      </p>

      <Link
        to={`/vault/${vault.id}/details`}
        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 w-full text-center block"
      >
        Access Vault
      </Link>
    </div>
  );
};

export default VaultCard;
