import { jwtDecode } from "jwt-decode";
import type { NavigateFunction } from "react-router-dom";

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

export const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

export const checkTokenAndLogout = (navigate?: NavigateFunction) => {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (navigate) {
      navigate("/login");
    }
    return true;
  }
  return false;
};

export const logout = (navigate?: NavigateFunction) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  if (navigate) navigate("/login");
};
