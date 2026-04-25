import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export function getCmsToken() {
  return Cookies.get("cms_access_token");
}

export function setCmsTokens(access: string, refresh: string) {
  Cookies.set("cms_access_token", access, { expires: 1 / 24 }); // 1 hour
  Cookies.set("cms_refresh_token", refresh, { expires: 7 }); // 7 days
}

export function clearCmsTokens() {
  Cookies.remove("cms_access_token");
  Cookies.remove("cms_refresh_token");
}

export async function cmsFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getCmsToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options?.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_URL}/cms${endpoint}`, {
    ...options,
    headers,
  });

  // Handle Token Expiry
  if (response.status === 401) {
    const refreshToken = Cookies.get("cms_refresh_token");
    if (refreshToken) {
      const refreshRes = await fetch(`${API_URL}/cms/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (refreshRes.ok) {
        const { access } = await refreshRes.json();
        Cookies.set("cms_access_token", access, { expires: 1 / 24 });
        headers["Authorization"] = `Bearer ${access}`;
        // Retry original request
        response = await fetch(`${API_URL}/cms${endpoint}`, { ...options, headers });
      } else {
        clearCmsTokens();
        window.location.href = "/cms/login";
        throw new Error("Session expired. Please log in again.");
      }
    } else {
      clearCmsTokens();
      window.location.href = "/cms/login";
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    let errorMessage = `API Error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || JSON.stringify(errorData);
    } catch {
      // Ignored
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
