import { useState } from "react";
import { useImportStatus } from "../hooks/useImportStatus";
import { uploadCSV } from "../api/imports";

export default function ImportUploader() {
  const [jobId, setJobId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { data, isLoading, error } = useImportStatus(jobId);

  const handleUpload = async () => {
    if (!file) return;

    const res = await uploadCSV(file);
    setJobId(res.id);
    setFile(null); // reset after upload
  };

  const progress =
    data?.total_rows && data.total_rows > 0
      ? (data.processed_rows / data.total_rows) * 100
      : 0;

  const isProcessing =
    data?.status === "processing" || data?.status === "pending";

  return (
    <div className="container mt-4">
      {/* Upload */}
      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0] ?? null;
            setFile(selectedFile);
            setJobId(null);
          }}
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || isProcessing}
        className="btn btn-primary"
      >
        Upload CSV
      </button>

      {/* Loading spinner */}
      {isLoading && <div className="mt-3 spinner-border" role="status" />}

      {/* Error */}
      {error && <p className="text-danger mt-3">Something went wrong</p>}

      {/* Status */}
      {data && (
        <div className="mt-4">
          <p className="fw-semibold">Status: {data.status}</p>

          {/* Progress container */}
          <div className="bg-light-subtle shadow-sm border border-gray-200 rounded p-3">
            {/* Progress text */}
            <p>
              Progress: {data.processed_rows} / {data.total_rows}
            </p>

            {/* Progress bar */}
            <div className="progress mt-3">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
              >
                {Math.round(progress)}%
              </div>
            </div>
          </div>

          {/* Completed summary */}
          {data.status === "completed" && (
            <div className="mt-4">
              <p>Total: {data.total_rows}</p>
              <p>Success: {data.success_rows}</p>
              <p>Failed: {data.failed_rows}</p>
            </div>
          )}

          {/* Failed state */}
          {data.status === "failed" && (
            <p className="text-danger mt-3">Import failed</p>
          )}
        </div>
      )}
    </div>
  );
}
