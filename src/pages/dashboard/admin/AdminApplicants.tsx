import { useEffect, useState } from "react";
import { getAllClients, updateClientInfo } from "../../../services/admin/appointment";
import { FiTrash2 } from "react-icons/fi";
import { useSnackbar } from "notistack";

interface Client {
  id: string;
  ltmsNumber: string;
  name: string;
  email: string;
  birthdate: string;
  role: string;
}

const AdminApplicants = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const [searchLtms, setSearchLtms] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const token = localStorage.getItem("token");

  const { enqueueSnackbar } = useSnackbar();

  const fetchClients = async () => {
    try {
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      const data = await getAllClients(token);
      setClients(data);
    } catch (err) {
      setError("Failed to load clients");
      enqueueSnackbar("Failed to load clients", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Sorting toggle
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Sorting icon rule
  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return "↕"; // default
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

const [appliedFilters, setAppliedFilters] = useState({
  ltms: "",
  name: "",
  email: "",
});

const filteredClients = clients.filter((c) => {
  const matchLtms =
    appliedFilters.ltms === "" ||
    c.ltmsNumber?.toLowerCase().includes(appliedFilters.ltms.toLowerCase());

  const matchName =
    appliedFilters.name === "" ||
    c.name?.toLowerCase().includes(appliedFilters.name.toLowerCase());

  const matchEmail =
    appliedFilters.email === "" ||
    c.email?.toLowerCase().includes(appliedFilters.email.toLowerCase());

  return matchLtms && matchName && matchEmail;
});

const sortedClients = [...filteredClients].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    const order = direction === "asc" ? 1 : -1;

    let valA = a[key as keyof Client];
    let valB = b[key as keyof Client];

    // Handle null/undefined
    if (!valA) valA = "";
    if (!valB) valB = "";

    // If date
    if (key === "birthdate") {
      return (
        (new Date(valA as string).getTime() - new Date(valB as string).getTime()) *
        order
      );
    }

    // String comparison
    if (valA < valB) return -1 * order;
    if (valA > valB) return 1 * order;
    return 0;
  });

  const deleteField = async (clientId: string, field: "birthdate" | "ltms_number") => {
    if (!token) return;

    try {
      await updateClientInfo(clientId, token, { [field]: null });

      setClients((prev) =>
        prev.map((c) =>
          c.id === clientId
            ? { ...c, [field === "ltms_number" ? "ltmsNumber" : "birthdate"]: "" }
            : c
        )
      );
      enqueueSnackbar(
        `${field === "ltms_number" ? "LTMS Number" : "Birthdate"} deleted successfully`,
        { variant: "success" }
      );
    } catch (err) {
      console.error(`Failed to delete ${field}`, err);
      enqueueSnackbar(`Failed to delete ${field}`, { variant: "error" });
    }
  };

const handleFilter = () => {
  setAppliedFilters({
    ltms: searchLtms,
    name: searchName,
    email: searchEmail,
  });
};

const handleClear = () => {
  setSearchLtms("");
  setSearchName("");
  setSearchEmail("");
  setAppliedFilters({ ltms: "", name: "", email: "" });
};
  if (loading) return <p className="text-gray-500">Loading clients...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">All Clients</h1>
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col min-w-[200px]">
          <label className="text-xs text-gray-600 mb-1">Search LTMS Number</label>
          <input
            type="text"
            value={searchLtms}
            onChange={(e) => setSearchLtms(e.target.value)}
            placeholder="Enter LTMS Number"
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col min-w-[200px]">
          <label className="text-xs text-gray-600 mb-1">Search Name</label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter name"
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col min-w-[200px]">
          <label className="text-xs text-gray-600 mb-1">Search Email</label>
          <input
            type="text"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Enter email"
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Filter
          </button>

          <button
            onClick={handleClear}
            className="bg-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-400"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border-b border-r cursor-pointer w-60" onClick={() => handleSort("ltmsNumber")}>
                LTMS Number {getSortIcon("ltmsNumber")}
              </th>

              <th className="p-3 border-b border-r cursor-pointer" onClick={() => handleSort("name")}>
                Name {getSortIcon("name")}
              </th>

              <th className="p-3 border-b border-r cursor-pointer w-140" onClick={() => handleSort("email")}>
                Email {getSortIcon("email")}
              </th>

              <th className="p-3 border-b border-r cursor-pointer w-60" onClick={() => handleSort("birthdate")}>
                Birthdate {getSortIcon("birthdate")}
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedClients.length > 0 ? (
              sortedClients.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b border-r flex items-center justify-between">
                    {c.ltmsNumber || "No Data"}
                    {c.ltmsNumber && (
                      <FiTrash2
                        className="ml-2 cursor-pointer text-red-500"
                        onClick={() => deleteField(c.id, "ltms_number")}
                      />
                    )}
                  </td>
                  <td className="p-3 border-b border-r">{c.name}</td>
                  <td className="p-3 border-b border-r">{c.email}</td>

                  <td className="p-3 border-b flex items-center justify-between">
                    {c.birthdate || "No Data"}
                    {c.birthdate && (
                      <FiTrash2
                        className="ml-2 cursor-pointer text-red-500"
                        onClick={() => deleteField(c.id, "birthdate")}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 p-4">
                  No clients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApplicants;
