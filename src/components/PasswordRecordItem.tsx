import React, { useState, useRef, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PasswordRecord } from "../types/PasswordRecordTypes";
import { FaEllipsisV, FaTrashAlt } from "react-icons/fa";
import ConfirmationModal from "../shared/ConfirmationModal";
import { AuthContext } from "../context/AuthContext";
import { deletePasswordRecord } from "../services/passwordRecordService";
import Spinner from "../shared/Spinner";

interface PasswordRecordItemProps {
  record: PasswordRecord;
  decrypted: boolean;
  onDecrypt: () => void;
  onRecordDeleted: (record: PasswordRecord) => void;
}

const PasswordRecordItem: React.FC<PasswordRecordItemProps> = ({
  record,
  decrypted,
  onDecrypt,
  onRecordDeleted,
}) => {
  const authContext = useContext(AuthContext);
  const { userToken } = authContext;
  const [isActionsVisible, setIsActionsVisible] = useState(false);
  const ActionsVisibleRef = useRef<HTMLDivElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      ActionsVisibleRef.current &&
      !ActionsVisibleRef.current.contains(event.target as Node)
    ) {
      setIsActionsVisible(false);
    }
  };

  useEffect(() => {
    if (isActionsVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isActionsVisible]);

  const handleToggleActions = () => {
    setIsActionsVisible((prev) => !prev);
  };

  const handleDelete = async () => {
    setLoading(true);
    setErrors([]);
    if (!userToken) {
      setErrors(["User token is missing."]);
      setLoading(false);
      return;
    }
    try {
      await deletePasswordRecord(userToken, record.id);
      setIsDeleteModalOpen(false);
      onRecordDeleted(record);
      const toastId = "delete-record-success";
      toast.dismiss(toastId);
      toast.success("Vault record deleted successfully", {
        toastId,
      });
    } catch (error) {
      setErrors(Array.isArray(error) ? error : [error]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <li
      data-testid="password-record-item"
      className="border border-gray-200 rounded-md p-4 relative"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {errors.length > 0 && (
          <div className="mb-4">
            <ul className="text-red-500">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </h3>
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
      <button
        data-testid="ellipsis-action-menu"
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        onClick={handleToggleActions}
      >
        <FaEllipsisV />
      </button>
      {isActionsVisible && (
        <div
          ref={ActionsVisibleRef}
          className="absolute right-3 top-10 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
        >
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            <FaTrashAlt /> <span>Delete Record</span>
          </button>
        </div>
      )}

      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          title="Delete Vault"
          message={
            <>
              Are you sure you want to delete the vault?
              <strong>{record?.attributes?.name}</strong>? This action cannot be
              undone.
            </>
          }
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </li>
  );
};

export default PasswordRecordItem;
