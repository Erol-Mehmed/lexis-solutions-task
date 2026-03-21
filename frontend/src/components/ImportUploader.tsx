import { useState } from "react";
import { useImportStatus } from "../hooks/useImportStatus.ts";
import { uploadCSV } from "../api/imports.ts";

export default function ImportUploader() {
  const [jobId, setJobId] = useState(null);
  const [file, setFile] = useState<File | null>(null);

  const { data } = useImportStatus(jobId);

  const handleUpload = async () => {
    if (!file) return;

    const res = await uploadCSV(file);
    setJobId(res.id);
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <button onClick={handleUpload}>Upload</button>

      {data && (
        <div>
          <p>Status: {data.status}</p>
          <p>
            Progress: {data.processed_rows} / {data.total_rows}
          </p>
          <p>Success: {data.success_rows}</p>
          <p>Failed: {data.failed_rows}</p>
        </div>
      )}
    </div>
  );
}
