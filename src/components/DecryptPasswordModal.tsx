interface DecryptPasswordModalProps {
  modalRef: React.RefObject<HTMLDivElement>;
  decryptionKey: string;
  setDecryptionKey: React.Dispatch<React.SetStateAction<string>>;
  handleDecrypt: () => void;
  errors: string[];
  onClose: () => void;
}

const DecryptPasswordModal: React.FC<DecryptPasswordModalProps> = ({
  modalRef,
  decryptionKey,
  setDecryptionKey,
  handleDecrypt,
  errors,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div ref={modalRef} className="bg-white p-4 rounded-lg shadow-lg w-96">
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
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button
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
