import { useState, useEffect } from "react";
import { Vault } from "../types/VaultTypes";

export const vaultTypeOptions = [
  { value: "personal", label: "Personal" },
  { value: "business", label: "Business" },
  { value: "shared", label: "Shared" },
  { value: "temporary", label: "Temporary" },
];

export const statusOptions = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
  { value: "deleted", label: "Deleted" },
  { value: "locked", label: "Locked" },
];

export const useVaultForm = (initialVault?: Vault) => {
  const [name, setName] = useState<string>(initialVault?.attributes.name || "");
  const [unlockCode, setUnlockCode] = useState<string>(
    initialVault?.attributes.unlock_code || ""
  );
  const [description, setDescription] = useState<string>(
    initialVault?.attributes.description || ""
  );
  const [vaultType, setVaultType] = useState<string>(
    initialVault?.attributes?.vault_type || vaultTypeOptions[0].value
  );
  const [status, setStatus] = useState<string>(
    initialVault?.attributes?.status || statusOptions[0].value
  );
  const [sharedWith, setSharedWith] = useState<string[]>(
    initialVault?.attributes.shared_with || []
  );

  const [isShared, setIsShared] = useState<boolean>(
    initialVault?.attributes.is_shared || false
  );

  useEffect(() => {
    if (initialVault) {
      setName(initialVault?.attributes?.name);
      setUnlockCode(initialVault?.attributes?.unlock_code);
      setDescription(initialVault?.attributes?.description);
      setVaultType(initialVault?.attributes?.vault_type);
      setSharedWith(initialVault.attributes.shared_with || []);
      setStatus(initialVault?.attributes?.status);
      setIsShared(initialVault.attributes.is_shared);
    }
  }, [initialVault]);

  const resetForm = () => {
    setName("");
    setUnlockCode("");
    setDescription("");
    setVaultType("");
    setSharedWith([]);
    setStatus("");
    setIsShared(false);
  };

  return {
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
  };
};
