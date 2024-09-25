import React, { useEffect, useRef } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;

  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onCancel();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            data-testid="cancel-button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            data-testid="confirm-button"
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
