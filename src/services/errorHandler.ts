import axios from "axios";

export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { data } = error.response;
      if (data?.errors) {
        throw data?.errors;
      }
      if (data?.error) {
        throw data?.error;
      }
      throw error;
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
