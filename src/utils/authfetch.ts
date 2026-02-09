import { isTokenExpired, logout } from "./auth";

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    logout();
    throw new Error("Token expired or missing");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    if (res.status === 401) logout(); 
    throw await res.json();
  }

  return res.json();
};
