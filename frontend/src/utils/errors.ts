import type { AxiosError } from "axios";

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  const axiosError = error as AxiosError<{
    detail?: string;
    error?: string;
    message?: string;
  }>;

  if (axiosError?.response?.data) {
    const data = axiosError.response.data;
    if (typeof data.detail === "string") return data.detail;
    if (typeof data.error === "string") return data.error;
    if (typeof data.message === "string") return data.message;
  }

  if (error instanceof Error) return error.message;

  return fallback;
}
