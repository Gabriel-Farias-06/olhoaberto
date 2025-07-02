// lib/fetchWithInterceptor.ts
export default async function fetchWithInterceptor(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const isBrowser = typeof window !== "undefined";

  // Retrieve token only in the browser
  const accessToken = isBrowser ? localStorage.getItem("accessToken") : null;

  const headers: HeadersInit = {
    ...(init?.headers || {}),
    ...(accessToken
      ? { Authorization: `Bearer ${accessToken.replaceAll('"', "")}` }
      : {}),
    "Content-Type": "application/json",
  };

  const modifiedInit: RequestInit = {
    ...init,
    headers,
  };

  try {
    console.log("req");

    const response = await fetch(input, modifiedInit);

    if (!response.ok) {
      console.warn(`Fetch failed with status: ${response.status}`);
      if (response.status === 403 || response.status === 401) {
        window.location.href = "/login";
      }
    }
    console.log(response.status);

    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
