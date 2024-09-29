import React, { useState, useRef, useEffect } from "react";
import { PasswordRecord } from "../types/PasswordRecordTypes";
import { decryptPassword } from "../services/passwordRecordService";
import Spinner from "../shared/Spinner";
import { Vault } from "src/types/VaultTypes";
import PasswordRecordModal from "./PasswordRecordModal";
import PasswordRecordItem from "./PasswordRecordItem";
import DecryptPasswordModal from "./DecryptPasswordModal";

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
  const [decryptionKey, setDecryptionKey] = useState<string>("");
  const [currentRecord, setCurrentRecord] = useState<PasswordRecord | null>(
    null
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatedRecords, setUpdatedRecords] =
    useState<PasswordRecord[]>(records);
  const [showAddRecordModal, setShowAddRecordModal] = useState<boolean>(false);
  const [showDecryptModal, setShowDecryptModal] = useState<boolean>(false);
  const [decryptedRecords, setDecryptedRecords] = useState<string[]>([]);

  const handleToggleDecryptModal = (record: PasswordRecord) => {
    setCurrentRecord(record);
    setShowDecryptModal((prev) => !prev);
  };

  const handleRecordDeleted = (deletedRecord: PasswordRecord) => {
    setUpdatedRecords((prevRecords) =>
      prevRecords.filter((record) => record.id !== deletedRecord.id)
    );
  };

  const handleDecryptPassword = async () => {
    if (!currentRecord || !userToken) {
      setErrors(["Missing record or user token."]);
      return;
    }

    setLoading(true);
    try {
      const response = await decryptPassword(userToken, currentRecord.id, {
        encryption_key: decryptionKey,
      });

      setDecryptedRecords((prevRecords) => [...prevRecords, currentRecord.id]);
      const updatedRecord = {
        ...currentRecord,
        attributes: {
          ...currentRecord.attributes,
          password: response.password,
        },
      };

      setUpdatedRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === updatedRecord.id ? updatedRecord : record
        )
      );

      setDecryptionKey("");
      setShowDecryptModal(false);
    } catch (error) {
      setErrors(Array.isArray(error) ? error : [error]);
    } finally {
      setLoading(false);
    }
  };

  const hidePassword = () => {
    if (!currentRecord) {
      setErrors(["Missing record or user token."]);
      return;
    }

    setDecryptedRecords((prevRecords) =>
      prevRecords.filter((recordId) => recordId !== currentRecord.id)
    );
  };

  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowDecryptModal(false);
      }
    };
    if (showDecryptModal)
      document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showDecryptModal]);

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
              onDecrypt={() => handleToggleDecryptModal(record)}
              onRecordDeleted={handleRecordDeleted}
              hidePassword={hidePassword}
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

      {showDecryptModal && currentRecord && (
        <DecryptPasswordModal
          modalRef={modalRef}
          decryptionKey={decryptionKey}
          setDecryptionKey={setDecryptionKey}
          handleDecrypt={handleDecryptPassword}
          errors={errors}
          onClose={() => setShowDecryptModal(false)}
        />
      )}
    </div>
  );
};

export default PasswordRecordList;
