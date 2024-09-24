export interface CreateVaultData {
  name: string;
  unlock_code: string;
  description: string;
  vault_type: string;
  shared_with: string[];
  status: string;
  is_shared: boolean;
}

export interface Vault {
  id: string;
  type: string;
  attributes: {
    id: string;
    name: string;
    last_accessed_at: Date;
    description: string;
    vault_type: string;
    shared_with: string[];
    status: string;
    access_count: number;
    is_shared: boolean;
    failed_attempts: number;
    unlock_code: string;
    created_at: Date;
    updated_at: Date;
  };
}
