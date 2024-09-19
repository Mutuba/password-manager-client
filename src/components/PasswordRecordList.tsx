import React from "react";
import { PasswordRecord } from "../types/VaultTypes";

interface PasswordRecordListProps {
  records: PasswordRecord[];
}

const PasswordRecordList: React.FC<PasswordRecordListProps> = ({ records }) => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-md">
      <h4 className="text-lg font-semibold text-gray-800">Password Records</h4>
      <ul className="mt-4 space-y-2">
        {records.map((record) => (
          <li key={record.id} className="border border-gray-200 rounded-md p-2">
            <p className="font-semibold">{record.attributes.name}</p>
            <p className="text-gray-600">
              Username: {record.attributes.username}
            </p>
            <p className="text-gray-600">
              Password: {record.attributes.password}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRecordList;
