import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchVaults = async (userToken: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vaults`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch vaults. Please try again later.");
  }
};
