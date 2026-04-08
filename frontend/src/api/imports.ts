export async function uploadCSV(file: File) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/imports/upload/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json();
}
