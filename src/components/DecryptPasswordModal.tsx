import { useEffect, useRef, Dispatch, FC, SetStateAction } from "react";
interface DecryptPasswordModalProps {
  decryptionKey: string;
  setDecryptionKey: Dispatch<SetStateAction<string>>;
  setShowDecryptModal: Dispatch<SetStateAction<boolean>>;
  handleDecrypt: () => void;
  errors: string[];
  onClose: () => void;
  showDecryptModal: boolean;
}

const DecryptPasswordModal: FC<DecryptPasswordModalProps> = ({
  decryptionKey,
  setDecryptionKey,
  handleDecrypt,
  errors,
  onClose,
  setShowDecryptModal,
  showDecryptModal,
}) => {
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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        data-testid="decrypt-modal"
        ref={modalRef}
        className="bg-white p-4 rounded-lg shadow-lg w-96"
      >
        <input
          type="password"
          placeholder="Enter decryption key"
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
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
            data-testid="decrypt-password-modal-cancel-btn"
          >
            Cancel
          </button>
          <button
            data-testid="decrypt-password-button"
            onClick={handleDecrypt}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Decrypt
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecryptPasswordModal;
