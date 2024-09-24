import { useState } from "react";
import { createVault, updateVault } from "../services/vaultService";
import { Vault } from "../types/VaultTypes";

interface VaultSubmitHookProps {
  userToken: string | null;
  vault?: Vault;
  setVaults: React.Dispatch<React.SetStateAction<Vault[]>>;
  onSuccess: () => void;
}

export const useVaultSubmit = ({
  userToken,
  vault,
  setVaults,
  onSuccess,
}: VaultSubmitHookProps) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const submitVaultData = async (formData: {
    name: string;
    unlock_code: string;
    description: string;
    vault_type: string;
    shared_with: string[];
    status: string;
    is_shared: boolean;
  }) => {
    if (!userToken) {
      setErrors(["User token is missing."]);
      return;
    }

    setLoading(true);
    try {
      if (vault) {
        await updateVault(userToken, vault.id, formData);
      } else {
        console.log("initialVault", formData);

        const vaultData = await createVault(userToken, formData);
        setVaults((prevVaults) => [...prevVaults, vaultData]);
      }

      onSuccess();
    } catch (err: any) {
      setErrors(Array.isArray(err) ? err : [err.message]);
    } finally {
      setLoading(false);
    }
  };

  return {
    submitVaultData,
    errors,
    loading,
  };
};
