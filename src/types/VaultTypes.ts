export interface CreateVaultData {
  name: string;
  unlock_code: string;
  description: string;
  vault_type: number;
  shared_with: string[];
  status: number;
  is_shared: boolean;
}

export interface Vault {
  id: number;
  type: string;
  attributes: {
    id: number;
    name: string;
    last_accessed_at: Date;
    description: string;
    vault_type: string;
    shared_with: string[];
    status: string;
    access_count: number;
    is_shared: boolean;
    failed_attempts: number;
    created_at: string;
    updated_at: string;
  };
}
