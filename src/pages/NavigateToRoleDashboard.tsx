import { Navigate } from "react-router-dom";

export function NavigateToRoleDashboard() {
  const userString = localStorage.getItem("user");
  if (!userString) return <Navigate to="/" replace />;

  const user = JSON.parse(userString);
  const userId = user.id;

  if (user.role === "Admin" || user.role === "SuperAdmin") {
    return <Navigate to={`/dashboard/${userId}/dashboard`} replace />;
  } else {
    return <Navigate to={`/dashboard/${userId}/appointment`} replace />;
  }
}