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
  type: "vault";
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
    unlock_code?: string;
    created_at: string;
    updated_at: string;
  };
}

// export interface PasswordRecordAttributes {
//   name: string;
//   username: string;
//   url: string | null;
//   notes: string | null;
//   password: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface PasswordRecord {
//   id: number;
//   type: "password_record";
//   attributes: PasswordRecordAttributes;
// }
// export interface VaultAttributes {
//   name: string;
//   description: string | null;
//   vault_type: string;
//   status: string;
//   created_at: string;
//   updated_at: string;
//   unlock_code?: string;
// }
