import { API_BASE_URL } from "../config/env.ts";
import { throwIfNotOk } from "../utils/http.ts";

export async function uploadCSV(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/imports/upload/`, {
    method: "POST",
    body: formData,
  });

  await throwIfNotOk(res, "Upload failed");

  return res.json();
}
