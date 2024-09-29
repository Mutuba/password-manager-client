import axios, { AxiosError } from "axios";
import { vaultData } from "../types/VaultTypes";
import { handleApiError } from "./errorHandler";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  } catch (error) {
    const errors = error as Error | AxiosError;
    handleApiError(errors);
  }
};

export const fetchVaults = async (userToken: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vaults`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    const errors = error as Error | AxiosError;
    handleApiError(errors);
  }
};

export const createVault = async (userToken: string, vaultData: vaultData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/vaults`, vaultData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const errors = error as Error | AxiosError;
    handleApiError(errors);
  }
};

export const updateVault = async (
  userToken: string,
  vaultId: string,
  vaultData: vaultData
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
  } catch (error) {
    const errors = error as Error | AxiosError;
    handleApiError(errors);
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
    const errors = error as Error | AxiosError;
    handleApiError(errors);
  }
};
