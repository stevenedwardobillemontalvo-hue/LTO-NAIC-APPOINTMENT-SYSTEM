import Sidebar from "../components/layout/sidebar";
import Logo from "../components/header";
import { useParams, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === `/dashboard/${id}`) {
        if (role === "Client") {
          navigate(`/dashboard/${id}/appointment`, { replace: true });
        } 
        else if (role === "Admin" || role === "SuperAdmin") {
          navigate(`/dashboard/${id}/dashboard`, { replace: true });
        }
      }
    }, [role, id, navigate, location.pathname]);


  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <div className="flex h-[13vh] bg-gray-200 shadow-md px-6 py-2 text-gray-800">
        <div className="w-1/2 flex items-start"><Logo /></div>
        <div className="w-1/2 flex items-start justify-end">
          <p className="text-3xl font-bold">LTO NAIC ONLINE APPOINTMENT</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={role} id={id} />

        <div className="flex-1 bg-gray-100 text-gray-800 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
