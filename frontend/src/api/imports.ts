import { api } from "./client.ts";

export async function uploadCSV(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/api/imports/upload/", formData);
  return res.data;
}
