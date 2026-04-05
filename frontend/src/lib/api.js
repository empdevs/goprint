import { API_BASE_URL } from "../constants";
export async function apiRequest(path, options = {}, token) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {})
        }
    });
    const payload = (await response.json());
    if (!response.ok || !payload.success) {
        throw new Error(payload.message ?? "Request gagal");
    }
    return payload;
}
