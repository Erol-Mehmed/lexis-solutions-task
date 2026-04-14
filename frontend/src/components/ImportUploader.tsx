import { useRef, useState, type ChangeEvent } from "react";
import { useImportStatus } from "../hooks/useImportStatus";
import { uploadCSV } from "../api/imports";

export default function ImportUploader() {
  const [jobId, setJobId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [displayFileName, setDisplayFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data, isLoading, error } = useImportStatus(jobId);

  const isCsvByName = (name: string) => name.toLowerCase().endsWith(".csv");

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selected = e.target.files[0];
    const isCSV = isCsvByName(selected.name);

    if (!isCSV) {
      setFileError("Only .csv files are allowed.");
      setUploadError(null);
      setFile(null);
      setDisplayFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFileError(null);
    setUploadError(null);
    setJobId(null); // clear previous job status so retry starts fresh
    setFile(selected);
    setDisplayFileName(selected.name);
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!isCsvByName(file.name)) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const res = await uploadCSV(file);
      setJobId(res.id);

      // Keep shown filename, but clear input value so the same file can be selected again.
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
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
          ref={fileInputRef}
          type="file"
          className="form-control"
          accept=".csv,text/csv"
          onChange={onFileChange}
        />
        {fileError && <p className="text-danger mt-1">{fileError}</p>}
        {uploadError && <p className="text-danger mt-1">{uploadError}</p>}
      </div>

      <div className="d-flex justify-content-between">
        <button
          onClick={handleUpload}
          disabled={!file || isUploading || isProcessing}
          className="btn btn-primary"
        >
          {isUploading ? "Uploading..." : "Upload CSV"}
        </button>

        {displayFileName && (
          <p className="text-muted mt-2 mb-0">
            Uploaded file: {displayFileName}
          </p>
        )}
      </div>

      {isLoading && <div className="mt-3 spinner-border" role="status" />}

      {/* Error */}
      {error && <p className="text-danger mt-3">Something went wrong</p>}

      {/* Status */}
      {data && (
        <div className="shadow-sm border rounded p-3 mt-5">
          <p className="fw-semibold">Status: {data.status}</p>

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

          {data.status === "completed" && (
            <div className="mt-4">
              <p>Total: {data.total_rows}</p>
              <p>Success: {data.success_rows}</p>
              <p>Failed: {data.failed_rows}</p>
            </div>
          )}

          {data.status === "failed" && (
            <p className="text-danger mt-3">
              {data.error_message || "Import failed"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
