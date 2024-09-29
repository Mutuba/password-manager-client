import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      if (vault) {
        const response = await updateVault(userToken, vault.id, formData);
        const vaultData = response.data;
        setVaults((prevVaults) =>
          prevVaults.map((vault) =>
            vault.id === vaultData.id ? vaultData : vault
          )
        );
        const toastId = "update-vault-success";
        toast.dismiss(toastId);
        toast.success("Vault successfully updated.", {
          toastId,
        });
      } else {
        const response = await createVault(userToken, formData);
        const vaultData = response.data;
        setVaults((prevVaults) => [...prevVaults, vaultData]);
        const toastId = "create-vault-success";
        toast.dismiss(toastId);
        toast.success("New Vault successfully created.", {
          toastId,
        });
      }
      onSuccess();
    } catch (err) {
      setErrors(Array.isArray(err) ? err : [err]);
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
