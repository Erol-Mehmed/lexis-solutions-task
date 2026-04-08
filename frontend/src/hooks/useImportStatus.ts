import useSWR from "swr";
import type { ImportJob } from "../types";

export function useImportStatus(jobId: number | null) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetcher = async (url: string): Promise<ImportJob> => {
    const res = await fetch(url, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    return res.json();
  };

  const { data, error, isLoading } = useSWR<ImportJob>(
    jobId ? `${API_BASE_URL}/api/imports/${jobId}/` : null,
    fetcher,
    {
      refreshInterval: (data) => {
        if (!data) return 1000;

        if (data.status === "completed" || data.status === "failed") {
          return 0;
        }

        return 1000;
      },
      revalidateOnFocus: true,
    },
  );

  return { data, error, isLoading };
}
