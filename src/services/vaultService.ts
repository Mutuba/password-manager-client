import axios from "axios";
import { CreateVaultData } from "../types/VaultTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchVaults = async (userToken: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vaults`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const createVault = async (
  userToken: string,
  vaultData: CreateVaultData
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/vaults`, vaultData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const vaultLogin = async (
  userToken: string,
  vaultId: number,
  vaultData: { unlock_code: string }
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/vaults/${vaultId}/login`,
      vaultData,
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

const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { data } = error.response;
      if (data?.errors) {
        throw data?.errors;
      }
      if (data?.error) {
        throw data?.error;
      }
      throw new Error("Something went wrong. Please try again.");
    } else if (error.request) {
      throw new Error(
        "Unable to connect to the server. Please check your internet connection."
      );
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }
  } else {
    throw new Error("An unexpected error occurred.");
  }
};
