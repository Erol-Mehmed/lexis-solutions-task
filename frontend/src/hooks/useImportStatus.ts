import useSWR from "swr";
import type { ImportJob } from "../types";
import { api } from "../api/client.ts";

export function useImportStatus(jobId: number | null) {
  const fetcher = async (url: string): Promise<ImportJob> => {
    const res = await api.get<ImportJob>(url);
    return res.data;
  };

  const { data, error, isLoading } = useSWR<ImportJob>(
    jobId ? `/api/imports/${jobId}/` : null,
    fetcher,
    {
      refreshInterval: (data) => {
        if (!data) return 1000;
        if (data.status === "completed" || data.status === "failed") return 0;
        return 1000;
      },
      revalidateOnFocus: false,
    },
  );

  return { data, error, isLoading };
}
