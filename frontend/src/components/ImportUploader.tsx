import { useState } from "react";
import { useImportStatus } from "../hooks/useImportStatus";
import { uploadCSV } from "../api/imports";

export default function ImportUploader() {
  const [jobId, setJobId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const { data, isLoading, error } = useImportStatus(jobId);

  const handleUpload = async () => {
    if (!file) return;
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") return;

    const res = await uploadCSV(file);
    setJobId(res.id);

    setFile(null);
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
          accept=".csv,text/csv"
          onChange={(e) => {
            if (!e.target.files || e.target.files.length === 0) return;

            const selected = e.target.files[0];
            const isCSV =
              selected.name.endsWith(".csv") || selected.type === "text/csv";

            if (!isCSV) {
              setFileError("Only .csv files are allowed.");
              setFile(null);
              return;
            }

            setFileError(null);
            setFile(selected);
          }}
        />
        {fileError && <p className="text-danger mt-1">{fileError}</p>}
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
        <div className="shadow-sm border rounded p-3 mt-4">
          <p className="fw-semibold">Status: {data.status}</p>

          {/* Progress */}
          <div className="bg-light border rounded p-3">
            <p>
              Progress: {data.processed_rows} / {data.total_rows}
            </p>

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

          {/* Completed */}
          {data.status === "completed" && (
            <div className="mt-4">
              <p>Total: {data.total_rows}</p>
              <p>Success: {data.success_rows}</p>
              <p>Failed: {data.failed_rows}</p>
            </div>
          )}

          {/* Failed */}
          {data.status === "failed" && (
            <p className="text-danger mt-3">Import failed</p>
          )}
        </div>
      )}
    </div>
  );
}
