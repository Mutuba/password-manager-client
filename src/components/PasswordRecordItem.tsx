import React, { useState, useRef, useEffect } from "react";
import { PasswordRecord } from "../types/PasswordRecordTypes";
import { FaEllipsisV, FaEdit, FaTrashAlt } from "react-icons/fa";

interface PasswordRecordItemProps {
  record: PasswordRecord;
  decrypted: boolean;
  onDecrypt: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

const PasswordRecordItem: React.FC<PasswordRecordItemProps> = ({
  record,
  decrypted,
  onDecrypt,
  onUpdate,
  onDelete,
}) => {
  const [isActionsVisible, setIsActionsVisible] = useState(false);
  const ActionsVisibleRef = useRef<HTMLDivElement>(null);

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

  return (
    <li
      data-testid="password-record-item"
      className="border border-gray-200 rounded-md p-4 relative"
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
            onClick={onUpdate}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            <FaEdit /> <span>Update Record</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            <FaTrashAlt /> <span>Delete Record</span>
          </button>
        </div>
      )}
    </li>
  );
};

export default PasswordRecordItem;
