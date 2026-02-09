import { useEffect, useState } from "react";
import { getAllAdmins } from "../../../services/admin/appointment";
import { registerUser, type RegisterFormData } from "../../../services/auth";
import dayjs from "dayjs";
import { FiX } from "react-icons/fi";
import { useSnackbar } from "notistack";

interface Admin {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    type: "admin", 
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    birthdate: "",
    contactNumber: "",
    ltmsNumber: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();

  const [sortField, setSortField] = useState<keyof Admin>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedAdmins = [...admins].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];

    if (sortField === "createdAt") {
      return sortOrder === "asc"
        ? dayjs(valA).unix() - dayjs(valB).unix()
        : dayjs(valB).unix() - dayjs(valA).unix();
    }

    return sortOrder === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const getSortIcon = (field: keyof Admin) => {
    if (field !== sortField) return "↕";      
    return sortOrder === "asc" ? "↑" : "↓";   
  };


  const handleSort = (field: keyof Admin) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };


  const fetchAdmins = async () => {
    try {
      if (!token) throw new Error("No token found");
      const data = await getAllAdmins(token);
      setAdmins(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch admins");
      enqueueSnackbar(err.message || "Failed to fetch admins", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerUser(formData);
      enqueueSnackbar(res.message || "Admin added successfully", { variant: "success" });
      setShowForm(false);
      fetchAdmins(); 
    } catch (err: any) {
      enqueueSnackbar(err.message || "Failed to add admin", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Admins</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Add Admin
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading admins...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th
                  onClick={() => handleSort("id")}
                  className="p-3 border-b cursor-pointer select-none"
                >
                  ID {getSortIcon("id")}
                </th>

                <th
                  onClick={() => handleSort("name")}
                  className="p-3 border-b cursor-pointer select-none"
                >
                  Name {getSortIcon("name")}
                </th>

                <th
                  onClick={() => handleSort("email")}
                  className="p-3 border-b cursor-pointer select-none"
                >
                  Email {getSortIcon("email")}
                </th>

                <th
                  onClick={() => handleSort("createdAt")}
                  className="p-3 border-b cursor-pointer select-none"
                >
                  Created At {getSortIcon("createdAt")}
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.length > 0 ? (
                sortedAdmins.map(admin => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{admin.id}</td>
                    <td className="p-3 border-b">{admin.name}</td>
                    <td className="p-3 border-b">{admin.email}</td>
                    <td className="p-3 border-b">{dayjs(admin.createdAt).format("YYYY-MM-DD")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 p-4">
                    No admins found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full md:w-1/2 bg-white shadow-xl p-6 transform transition-transform duration-300 ease-in-out z-50 ${
          showForm ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Admin</h2>
          <button onClick={() => setShowForm(false)}>
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
{formData.type === "admin" && (
  <div>
    <label className="block text-sm mb-1">Admin Type</label>
    <select
      name="adminType"
      value={formData.adminType || "admin"}
      onChange={handleChange}
      className="w-full border px-2 py-1 rounded text-sm"
      required
    >
      <option value="admin">Admin Staff Access</option>
      <option value="superadmin">All Access</option>
    </select>
  </div>
)}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border px-2 py-1 text-sm rounded"
              required
            />
            <input
              type="text"
              name="middleName"
              placeholder="Middle Name (optional)"
              value={formData.middleName}
              onChange={handleChange}
              className="w-full border px-2 py-1 text-sm rounded"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border px-2 py-1 text-sm rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-2 py-1 text-sm rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-2 py-1 text-sm rounded"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border px-2 py-1 text-sm rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            {submitting ? "Adding..." : "Add Admin"}
          </button>
        </form>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
