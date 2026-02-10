const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export interface HealthPayload {
  status: string;
  service: string;
  timestamp: string;
}

export async function getHealthStatus(): Promise<HealthPayload | null> {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Request failed with ${res.status}`);
    }
    return (await res.json()) as HealthPayload;
  } catch (error) {
    console.warn("Failed to reach API", error);
    return null;
  }
}
