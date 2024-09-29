import axios, { AxiosError } from "axios";

export const handleApiError = (error: AxiosError | Error) => {
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
