import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired, logout } from "../utils/auth";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  if (!userString || isTokenExpired(token)) {
    logout();
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(userString); 
  const userId = user.id;
  if (location.pathname === `/dashboard/${userId}`) {
    if (user.role === "admin") {
      return <Navigate to={`/dashboard/${userId}/dashboard`} replace />;
    } else {
      return <Navigate to={`/dashboard/${userId}/appointment`} replace />;
    }
  }

  return children;
}

export function GuestRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  if (token && !isTokenExpired(token) && userString) {
    const user = JSON.parse(userString);
    const userId = user.id;

    const redirectPath =
      (user.role === "Admin" || user.role === "SuperAdmin")
        ? `/dashboard/${userId}/dashboard`
        : `/dashboard/${userId}/appointment`;

    return <Navigate to={redirectPath} replace />;
  }

  if (token && isTokenExpired(token)) {
    localStorage.clear();
  }

  return children; 
}
