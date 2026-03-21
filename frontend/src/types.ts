export interface ImportJob {
  id: number;
  status: "pending" | "processing" | "completed" | "failed";
  total_rows: number;
  processed_rows: number;
  success_rows: number;
  failed_rows: number;
  error_message?: string | null;
}
