import axios from "axios";
import { handleApiError } from "./errorHandler";
import { PasswordRecordData } from "./../types/PasswordRecordTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createPasswordRecord = async (
  userToken: string,
  vaultId: string,
  passwordRecordData: PasswordRecordData
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/vaults/${vaultId}/password_records`,
      passwordRecordData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const decryptPassword = async (
  userToken: string,
  passwordRecordId: string,
  passwordRecordData: { encryption_key: string }
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/password_records/${passwordRecordId}/decrypt_password`,
      passwordRecordData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const deletePasswordRecord = async (
  userToken: string,
  passwordRecordId: string
) => {
  try {
    return await axios.delete(
      `${API_BASE_URL}/password_records/${passwordRecordId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    handleApiError(error);
  }
};

export const updatePasswordRecord = async (
  userToken: string,
  vaultId: string,
  passwordRecordData: PasswordRecordData
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/vaults/${vaultId}/password_records`,
      passwordRecordData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};
