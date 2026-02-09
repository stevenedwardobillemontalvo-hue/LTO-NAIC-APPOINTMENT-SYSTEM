import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired, logout } from "../utils/auth";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (!user || isTokenExpired(token)) {
    logout();
    return <Navigate to="/" replace />;
  }

  return children;
}

export function GuestRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");

  if (token && !isTokenExpired(token)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (token && isTokenExpired(token)) logout();

  return children;
}
