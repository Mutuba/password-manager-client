import React from "react";
import { PasswordRecord } from "../types/PasswordRecordTypes";

interface PasswordRecordItemProps {
  record: PasswordRecord;
  decrypted: boolean;
  onDecrypt: () => void;
}

const PasswordRecordItem: React.FC<PasswordRecordItemProps> = ({
  record,
  decrypted,
  onDecrypt,
}) => {
  return (
    <li
      data-testid="password-record-item"
      className="border border-gray-200 rounded-md p-4"
    >
      <p className="text-gray-600">
        <strong>Username:</strong> {record.attributes.username}
      </p>
      <p className="text-gray-600">
        <strong>Password:</strong>{" "}
        {decrypted ? record.attributes.password : "••••••••"}
        {!decrypted && (
          <button
            onClick={onDecrypt}
            className="ml-2 text-blue-500 hover:underline"
          >
            👁️ View
          </button>
        )}
      </p>
      {record.attributes.url && (
        <p className="text-gray-600">
          <strong>URL:</strong>{" "}
          <a
            href={record.attributes.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {record.attributes.url}
          </a>
        </p>
      )}
      {record.attributes.notes && (
        <p className="text-gray-600">
          <strong>Notes:</strong> {record.attributes.notes}
        </p>
      )}
    </li>
  );
};

export default PasswordRecordItem;
