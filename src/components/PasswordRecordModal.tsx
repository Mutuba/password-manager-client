import React, { useState } from "react";
import { CreatePasswordRecordData } from "../types/PasswordRecordTypes";
import Spinner from "../shared/Spinner";

interface PasswordRecordModalProps {
  onClose: () => void;
  onSave: (data: CreatePasswordRecordData) => void;
}

const PasswordRecordModal: React.FC<PasswordRecordModalProps> = ({
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CreatePasswordRecordData>({
    encryption_key: "",
    password_records: {
      name: "",
      username: "",
      password: "",
      url: "",
      notes: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      password_records: { ...prev.password_records, [name]: value },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setErrors([]);
    try {
      await onSave(formData);
    } catch (error) {
      setErrors(["Failed to save the record."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-bold">Add New Password Record</h2>
        <div className="mt-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border border-gray-300 p-2 w-full mb-2"
            value={formData.password_records.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="border border-gray-300 p-2 w-full mb-2"
            value={formData.password_records.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border border-gray-300 p-2 w-full mb-2"
            value={formData.password_records.password}
            onChange={handleChange}
          />
          <input
            type="text"
            name="url"
            placeholder="URL"
            className="border border-gray-300 p-2 w-full mb-2"
            value={formData.password_records.url}
            onChange={handleChange}
          />
          <textarea
            name="notes"
            placeholder="Notes"
            className="border border-gray-300 p-2 w-full mb-2"
            value={formData.password_records.notes}
            onChange={handleChange}
          />

          <input
            type="password"
            name="encryption_key"
            placeholder="Encryption Key"
            className="border border-gray-300 p-2 w-full mb-2"
            value={formData.encryption_key}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                encryption_key: e.target.value,
              }))
            }
          />

          {errors.length > 0 && (
            <ul className="text-red-500">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex justify-between">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Save"}
          </button>
          <button className="px-4 py-2 rounded-md border" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecordModal;
