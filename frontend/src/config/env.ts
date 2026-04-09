function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const API_BASE_URL = required(
  "VITE_API_BASE_URL",
  import.meta.env.VITE_API_BASE_URL,
);
