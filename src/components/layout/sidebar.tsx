import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../../utils/auth";
import { clientInfo } from "../../services/client/appointment";

interface SidebarProps {
  role: string;
  id?: string;
}

export default function Sidebar({ role, id }: SidebarProps) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>("");

  const menu =
    role === "SuperAdmin"
      ? [
          { label: "Dashboard", to: `/dashboard/${id}` },
          { label: "Admin Calendar", to: `/dashboard/${id}/calendar` },
          { label: "List of Appointments", to: `/dashboard/${id}/appointments` },
          { label: "Applicants", to: `/dashboard/${id}/applicants` },
          { label: "Admin", to: `/dashboard/${id}/manage-admins` },
        ]
      : role === "Admin"
      ? [
          { label: "Dashboard", to: `/dashboard/${id}` },
          { label: "Admin Calendar", to: `/dashboard/${id}/calendar` },
          { label: "List of Appointments", to: `/dashboard/${id}/appointments` },
          { label: "Applicants", to: `/dashboard/${id}/applicants` },
        ]
      : [
          { label: "Calendar", to: `/dashboard/${id}/appointment` },
          { label: "My Appointments", to: `/dashboard/${id}/my-appointments` },
        ];

  useEffect(() => {
    const fetchClient = async () => {
      try {
        if (role !== "Client") return;

        const token = localStorage.getItem("token");
        if (!token) return;

        const client = await clientInfo(token);

        setFirstName(client?.firstname || client?.firstName || "");
      } catch (err) {
        console.error("Failed to fetch client info:", err);
      }
    };

    fetchClient();
  }, [role]);

  const handleSidebarClick = (to: string) => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
      return;
    }
    navigate(to);
  };

  return (
    <aside className="w-64 h-full bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-xl font-semibold mb-4">
        {role === "Client"
          ? `Hi ${firstName ? firstName : "Client"}!`
          : "Administrator"}
      </h2>

      <nav className="flex-1 space-y-2">
        {menu.map((item) => (
          <button
            key={item.to}
            onClick={() => handleSidebarClick(item.to)}
            className="block w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
