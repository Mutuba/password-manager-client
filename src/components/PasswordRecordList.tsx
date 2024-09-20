import React, { useState } from "react";
import { PasswordRecord } from "../types/VaultTypes";
import { decryptPassword } from "../services/vaultService";
import Spinner from "../shared/Spinner";

interface PasswordRecordListProps {
  records: PasswordRecord[];
  userToken: string | null;
}

const PasswordRecordList: React.FC<PasswordRecordListProps> = ({
  records,
  userToken,
}) => {
  const [visibleRecords, setVisibleRecords] = useState<number[]>([]);
  const [decryptionKey, setDecryptionKey] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<PasswordRecord | null>(
    null
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatedRecords, setUpdatedRecords] =
    useState<PasswordRecord[]>(records);

  const toggleModal = (record: PasswordRecord) => {
    setCurrentRecord(record);
    setShowModal(true);
  };

  const handleDecryptPassword = async () => {
    setLoading(true);
    if (!currentRecord) {
      setLoading(false);
      return;
    }
    if (!userToken) {
      setErrors(["User token is missing."]);
      setLoading(false);
      return;
    }
    try {
      const response = await decryptPassword(userToken, currentRecord.id, {
        encryption_key: decryptionKey,
      });

      const decryptedPassword = response.password;
      setVisibleRecords((prev) => [...prev, currentRecord.id]);
      const updatedRecord = {
        ...currentRecord,
        attributes: {
          ...currentRecord.attributes,
          password: decryptedPassword,
        },
      };

      setUpdatedRecords((prev) =>
        prev.map((record) =>
          record.id === updatedRecord.id ? updatedRecord : record
        )
      );

      setShowModal(false);
      setDecryptionKey("");
    } catch (error) {
      setErrors(Array.isArray(error) ? error : [error]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-md">
      <h4 className="text-lg font-semibold text-gray-800">Password Records</h4>
      <ul className="mt-4 space-y-2">
        {updatedRecords.map((record) => (
          <li key={record.id} className="border border-gray-200 rounded-md p-2">
            <p className="font-semibold">{record.attributes.name}</p>
            <p className="text-gray-600">
              Username: {record.attributes.username}
            </p>
            <p className="text-gray-600">
              Password:{" "}
              {visibleRecords.includes(record.id)
                ? record.attributes.password
                : "••••••••"}
              {!visibleRecords.includes(record.id) && (
                <button onClick={() => toggleModal(record)} className="ml-2">
                  👁️
                </button>
              )}
            </p>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Enter Decryption Key</h2>
            <input
              type="password"
              className="border border-gray-300 p-2 mt-2 w-full"
              value={decryptionKey}
              onChange={(e) => setDecryptionKey(e.target.value)}
            />
            {loading && <Spinner />}

            {errors.length > 0 && (
              <div className="mb-4">
                <ul className="text-red-500">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-4">
              <button
                onClick={handleDecryptPassword}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Decrypt
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="ml-2 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordRecordList;
