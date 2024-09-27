import React, {
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PasswordRecordData,
  PasswordRecord,
} from "../types/PasswordRecordTypes";
import Spinner from "../shared/Spinner";
import { createPasswordRecord } from "../services/passwordRecordService";
import { Vault } from "../types/VaultTypes";

interface PasswordRecordModalProps {
  onClose: () => void;
  userToken: string | null;
  vault: Vault | null;
  setUpdatedRecords: Dispatch<SetStateAction<PasswordRecord[] | []>>;
  showAddRecordModal: boolean;
}

const PasswordRecordModal: React.FC<PasswordRecordModalProps> = ({
  onClose,
  setUpdatedRecords,
  userToken,
  vault,
  showAddRecordModal,
}) => {
  const [formData, setFormData] = useState<PasswordRecordData>({
    encryption_key: "",
    password_record: {
      name: "",
      username: "",
      password: "",
      url: "",
      notes: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    username?: string;
    password?: string;
    encryption_key?: string;
  }>({});

  const modalRef = useRef<HTMLDivElement>(null);
  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (showAddRecordModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showAddRecordModal]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      password_record: { ...prev.password_record, [name]: value },
    }));
  };

  const validateForm = () => {
    const errorMessages: {
      name?: string;
      username?: string;
      password?: string;
      encryption_key?: string;
    } = {};

    if (!formData.password_record.name)
      errorMessages.name = "Name is required.";
    if (!formData.password_record.username)
      errorMessages.username = "Username is required.";
    if (!formData.password_record.password)
      errorMessages.password = "Password is required.";
    if (!formData.encryption_key)
      errorMessages.encryption_key = "Encryption key is required.";

    return errorMessages;
  };

  const handleSave = async () => {
    setLoading(true);
    setErrors([]);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setLoading(false);
      return;
    }

    if (!userToken || !vault) return;

    try {
      const newRecord = await createPasswordRecord(
        userToken,
        vault.id,
        formData
      );

      setUpdatedRecords((prevRecords) => [...prevRecords, newRecord.data]);
      onClose();
      const toastId = "create_record-success";
      toast.dismiss(toastId);
      toast.success("New record successfully created.", {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h2 className="text-lg font-bold">Add New Record</h2>
        <div className="mt-2">
          <div className="mb-4">
            <input
              type="text"
              name="name"
              required
              placeholder="Name"
              className="border border-gray-300 p-2 w-full mb-1"
              value={formData.password_record.name}
              onChange={handleChange}
            />
            {formErrors.name && (
              <p className="text-red-500">{formErrors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="username"
              required
              placeholder="Username"
              className="border border-gray-300 p-2 w-full mb-1"
              value={formData.password_record.username}
              onChange={handleChange}
            />
            {formErrors.username && (
              <p className="text-red-500">{formErrors.username}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              className="border border-gray-300 p-2 w-full mb-1"
              value={formData.password_record.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <p className="text-red-500">{formErrors.password}</p>
            )}
          </div>

          <input
            type="text"
            name="url"
            placeholder="URL"
            className="border border-gray-300 p-2 w-full mb-2"
            value={formData.password_record.url}
            onChange={handleChange}
          />
          <textarea
            name="notes"
            placeholder="Notes"
            className="border border-gray-300 p-2 w-full mb-2"
            value={formData.password_record.notes}
            onChange={handleChange}
          />

          <div className="mb-4">
            <input
              type="password"
              required
              name="encryption_key"
              placeholder="Encryption Key"
              className="border border-gray-300 p-2 w-full mb-1"
              value={formData.encryption_key}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  encryption_key: e.target.value,
                }))
              }
            />
            {formErrors.encryption_key && (
              <p className="text-red-500">{formErrors.encryption_key}</p>
            )}
          </div>

          {errors.length > 0 && (
            <ul className="text-red-500">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex justify-between">
          <button className="px-4 py-2 rounded-md border" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleSave}
            disabled={loading}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecordModal;
