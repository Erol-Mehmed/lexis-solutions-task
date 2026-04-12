export async function getApiErrorMessage(
  res: Response,
  fallback = "Request failed",
): Promise<string> {
  try {
    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const data = await res.json();
      if (typeof data?.error === "string") return data.error;
      if (typeof data?.detail === "string") return data.detail;
      if (typeof data?.message === "string") return data.message;
    } else {
      const text = await res.text();
      if (text.trim()) return text;
    }
  } catch {
    // Ignore parse errors and return fallback
  }

  return fallback;
}

export async function throwIfNotOk(
  res: Response,
  fallback = "Request failed",
): Promise<void> {
  if (!res.ok) {
    const message = await getApiErrorMessage(res, fallback);
    throw new Error(message);
  }
}
