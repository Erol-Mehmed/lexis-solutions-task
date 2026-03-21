import useSWR from "swr";
import type { ImportJob } from "../types";

const fetcher = (url: string): Promise<ImportJob> =>
  fetch(url).then((res) => res.json());

export function useImportStatus(jobId: number | null) {
  const { data, error, isLoading } = useSWR<ImportJob>(
    jobId ? `http://localhost:8000/api/imports/${jobId}/` : null,
    fetcher,
    {
      refreshInterval: (data) => (data?.status === "completed" ? 0 : 2000),
    },
  );

  return { data, error, isLoading };
}
