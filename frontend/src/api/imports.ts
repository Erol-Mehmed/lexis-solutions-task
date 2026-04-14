import axios from "axios";
import { api } from "./client.ts";

type UploadResponse = {
  id: number;
};

type ApiErrorPayload = {
  detail?: string;
  error?: string;
  file?: string[];
};

export async function uploadCSV(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api.post<UploadResponse>(
      "/api/imports/upload/",
      formData,
    );

    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const payload = err.response?.data as ApiErrorPayload | undefined;
      const message =
        payload?.detail ??
        payload?.error ??
        payload?.file?.[0] ??
        "Upload failed. Please try again.";
      throw new Error(message);
    }

    throw err;
  }
}
