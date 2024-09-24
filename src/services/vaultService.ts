import axios from "axios";
import { CreateVaultData } from "../types/VaultTypes";
import { handleApiError } from "./errorHandler";

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

export const updateVault = async (
  userToken: string,
  vaultId: string,
  vaultData: CreateVaultData
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/vaults/${vaultId}`,
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

export const vaultLogin = async (
  userToken: string,
  vaultId: string,
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

export const deleteVault = async (userToken: string, vaultId: string) => {
  try {
    return await axios.delete(`${API_BASE_URL}/vaults/${vaultId}/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    handleApiError(error);
  }
};
