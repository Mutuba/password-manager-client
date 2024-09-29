export interface PasswordRecordData {
  encryption_key: string;
  password_record: {
    name: string;
    username: string;
    password: string;
    url: string;
    notes: string;
  };
}

export interface PasswordRecordAttributes {
  name: string;
  username: string;
  url: string | null;
  notes: string | null;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface PasswordRecord {
  id: string;
  type: string;
  attributes: PasswordRecordAttributes;
}
