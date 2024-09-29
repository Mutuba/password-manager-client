import React, { useState, useRef, useEffect } from "react";
import { PasswordRecord } from "../types/PasswordRecordTypes";
import { decryptPassword } from "../services/passwordRecordService";
import Spinner from "../shared/Spinner";
import { Vault } from "src/types/VaultTypes";
import PasswordRecordModal from "./PasswordRecordModal";
import PasswordRecordItem from "./PasswordRecordItem";

interface PasswordRecordListProps {
  records: PasswordRecord[];
  userToken: string | null;
  vault: Vault | null;
}

const PasswordRecordList: React.FC<PasswordRecordListProps> = ({
  records,
  userToken,
  vault,
}) => {
  const [decryptedRecords, setDecryptedRecords] = useState<string[]>([]);
  const [decryptionKey, setDecryptionKey] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<PasswordRecord | null>(
    null
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatedRecords, setUpdatedRecords] =
    useState<PasswordRecord[]>(records);
  const [showAddRecordModal, setShowAddRecordModal] = useState<boolean>(false);

  const toggleModal = (record: PasswordRecord) => {
    if (currentRecord?.id === record.id && showModal) {
      setShowModal(false);
      setCurrentRecord(null);
      setErrors([]);
    } else {
      setCurrentRecord(record);
      setShowModal(true);
    }
  };

  const handleRecordDeleted = (deletedRecord: PasswordRecord) => {
    setUpdatedRecords((prevRecords) =>
      prevRecords.filter((record) => record.id !== deletedRecord.id)
    );
  };

  const handleDecryptPassword = async () => {
    setLoading(true);
    if (!currentRecord || !userToken) {
      setErrors(["Missing record or user token."]);
      setLoading(false);
      return;
    }

    try {
      const response = await decryptPassword(userToken, currentRecord.id, {
        encryption_key: decryptionKey,
      });
      const decryptedPassword = response.password;
      setDecryptedRecords((prev) => [...prev, currentRecord.id]);

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

  const showModalRef = useRef<HTMLDivElement>(null);
  const handleOutsideClick = (event: MouseEvent) => {
    if (
      showModalRef.current &&
      !showModalRef.current.contains(event.target as Node)
    ) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showModal]);

  if (loading) return <Spinner />;

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-300">
        <h4 className="text-2xl font-bold text-gray-900 tracking-wide text-center">
          Vault Records
        </h4>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          onClick={() => setShowAddRecordModal(true)}
        >
          + Record
        </button>
      </div>

      {updatedRecords.length === 0 ? (
        <div className="flex justify-center items-center h-24">
          <p className="text-gray-600 text-center">
            No records yet, add some records.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {updatedRecords.map((record) => (
            <PasswordRecordItem
              key={record.id}
              record={record}
              decrypted={decryptedRecords.includes(record.id)}
              onDecrypt={() => toggleModal(record)}
              onRecordDeleted={handleRecordDeleted}
            />
          ))}
        </ul>
      )}

      {showAddRecordModal && (
        <PasswordRecordModal
          onClose={() => setShowAddRecordModal(false)}
          userToken={userToken}
          setUpdatedRecords={setUpdatedRecords}
          vault={vault}
          showAddRecordModal={showAddRecordModal}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div ref={showModalRef} className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Enter Decryption Key</h2>
            <input
              type="password"
              className="border border-gray-300 p-2 mt-2 w-full"
              value={decryptionKey}
              onChange={(e) => setDecryptionKey(e.target.value)}
            />
            {errors.length > 0 && (
              <div className="mb-4">
                <ul className="text-red-500">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={handleDecryptPassword}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Decrypt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordRecordList;
