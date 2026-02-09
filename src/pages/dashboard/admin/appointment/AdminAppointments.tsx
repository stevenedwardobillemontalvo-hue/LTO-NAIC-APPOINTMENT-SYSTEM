import { useEffect, useState } from "react";
import {
  getAdminAppointments,
  statusAppointment,
  AppointmentNote
} from "../../../../services/admin/appointment";
import DropdownMenu from "../../../../components/dropdownMenu";
import ViewAppointment from "./ViewAppointment";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

interface Appointment {
  id: string;
  name: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  note?: string;
}

export default function AdminApplicants() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [loadingView] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [statusQuery, setStatusQuery] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);

  const STATUS_OPTIONS = ["pending", "approved", "rejected", "cancelled"];
  const { enqueueSnackbar } = useSnackbar();

  const addStatus = (status: string) => {
    if (!selectedStatuses.includes(status)) {
      setSelectedStatuses((prev) => [...prev, status]);
    }
    setStatusQuery("");
    setStatusOpen(false);
  };

  const removeStatus = (status: string) => {
    setSelectedStatuses((prev) => prev.filter((s) => s !== status));
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

const handleFilter = () => {
  setAppliedFilters(true); 
};

const handleClear = () => {
  setSearchId("");
  setSearchName("");
  setSelectedStatuses([]);
  setStatusQuery("");
  setAppliedFilters(false); 
};
const filteredStatusOptions: string[] = STATUS_OPTIONS.filter(
  (status) =>
    status.includes(statusQuery.toLowerCase()) &&
    !selectedStatuses.includes(status)
);

const filteredAppointments = appointments.filter((a) => {
  if (!appliedFilters) return true;

  const matchId =
    searchId === "" || a.id.toLowerCase().includes(searchId.toLowerCase());

  const matchName =
    searchName === "" ||
    a.name.toLowerCase().includes(searchName.toLowerCase());

  const matchStatus =
    selectedStatuses.length === 0 || selectedStatuses.includes(a.status);

  return matchId && matchName && matchStatus;
});

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    let order = direction === "asc" ? 1 : -1;

    if (key === "status") {
      const statusOrder: Record<string, number> = {
        pending: 1,
        approved: 2,
        rejected: 3,
        cancelled: 4,
      };
      return (statusOrder[a.status] - statusOrder[b.status]) * order;
    }

    if (key === "appointmentDate") {
      return (
        (new Date(a.appointmentDate).getTime() -
          new Date(b.appointmentDate).getTime()) * order
      );
    }

    if (key === "appointmentTime") {
      return (
        (new Date(`2000-01-01 ${a.appointmentTime}`).getTime() -
          new Date(`2000-01-01 ${b.appointmentTime}`).getTime()) * order
      );
    }

    const aValue = a[key as keyof Appointment] ?? "";
    const bValue = b[key as keyof Appointment] ?? "";

    if (aValue < bValue) return -1 * order;
    if (aValue > bValue) return 1 * order;
    return 0;
  });


  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getAdminAppointments(token);

        setAppointments(data);
      } catch (err) {
        console.error(err);
        enqueueSnackbar("Failed to load appointments", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  const handleSort = (key: string) => {
  setSortConfig((prev) => {
    if (prev?.key === key) {
      return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
    }
    return { key, direction: "asc" };
  });
};

  const handleView = (appointmentId: string) => {
    navigate(`/dashboard/${id}/appointments/${appointmentId}`);
  };

const handleApprove = async (id: string, note?: string) => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    if (note && note.trim() !== "") {
      await AppointmentNote(id, token, note);
    }
    await statusAppointment(id, token, "approved");
    enqueueSnackbar("Appointment approved!", { variant: "success" });
    
    // Update main appointments array
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "approved", note: note || a.note } : a
      )
    );

    if (selected?.id === id) {
      setSelected({ ...selected, status: "approved", note: note || selected.note });
    }

  } catch (err) {
    console.error(err);
    enqueueSnackbar("Failed to approve appointment", { variant: "error" });
  }
};

const handleReject = async (id: string, note?: string) => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    if (note && note.trim() !== "") {
      await AppointmentNote(id, token, note);
    }
    await statusAppointment(id, token, "rejected");
    enqueueSnackbar("Appointment rejected!", { variant: "warning" });

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "rejected", note: note || a.note } : a
      )
    );

    if (selected?.id === id) {
      setSelected({ ...selected, status: "rejected", note: note || selected.note });
    }

  } catch (err) {
    console.error(err);
    enqueueSnackbar("Failed to reject appointment", { variant: "error" });
  }
};

const formatAppointmentTime = (time: string) => {

  const slots: Record<string, string> = {
    "8-9": "8:00AM-9:00AM",
    "9-10": "9:00AM-10:00AM",
    "10-11": "10:00AM-11:00AM",
    "11-12": "11:00AM-12:00PM",
    "12-1": "12:00PM-1:00PM",
    "1-2": "1:00PM-2:00PM",
    "2-3": "2:00PM-3:00PM",
    "3-4": "3:00PM-4:00PM",
  };

  return slots[time] || time;
};


  if (loading) return <p>Loading appointments...</p>;
  if (appointments.length === 0) return <p>No appointments found.</p>;

  return (
    <div className="w-full max-w-6xl mx-auto mt-6">
          <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-wrap gap-4 items-end">

  <div className="flex flex-col min-w-[200px]">
    <label className="text-xs text-gray-600">Search ID</label>
    <input
      type="text"
      value={searchId}
      onChange={(e) => setSearchId(e.target.value)}
      className="border px-3 py-1 rounded text-sm"
      placeholder="Enter ID"
    />
  </div>

  <div className="flex flex-col min-w-[200px]">
    <label className="text-xs text-gray-600">Search Name</label>
    <input
      type="text"
      value={searchName}
      onChange={(e) => setSearchName(e.target.value)}
      className="border px-3 py-1 rounded text-sm"
      placeholder="Enter name"
    />
  </div>

      <div className="flex flex-col relative min-w-[200px]">
        <label className="text-xs text-gray-600">Status</label>

        <div
          className="border px-3 py-1 rounded text-sm flex-wrap gap-1 items-center cursor-text"
          onClick={() => setStatusOpen(true)}
        >
          {selectedStatuses.map((status) => (
            <span
              key={status}
              className="flex items-center gap-1 bg-blue-100 text-blue-700 rounded text-xs capitalize"
            >
              {status}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeStatus(status);
                }}
                className="text-blue-600 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          ))}

          <input
            value={statusQuery}
            onChange={(e) => {
              setStatusQuery(e.target.value);
              setStatusOpen(true);
            }}
            onFocus={() => setStatusOpen(true)}
            placeholder="Type status..."
            className="rounded text-sm"
          />
        </div>

        {statusOpen && filteredStatusOptions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border rounded shadow mt-1 z-10">
            {filteredStatusOptions.map((status) => (
              <div
                key={status}
                onClick={() => addStatus(status)}
                className="px-3 py-2 text-sm capitalize cursor-pointer hover:bg-gray-100"
              >
                {status}
              </div>
            ))}
          </div>
        )}
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
      {selected ? (
        loadingView ? (
          <p>Loading details...</p>
        ) : (
          <ViewAppointment
            appointment={selected}
            onApprove={(note) => handleApprove(selected.id, note)}
            onReject={(note) => handleReject(selected.id, note)}
          />
        )
      ) : (
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="w-full border-collapse text-sm text-gray-800">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-3 border-b cursor-pointer" onClick={() => handleSort("id")}>
                  ID {getSortIcon("id")}
                </th>

                <th className="p-3 border-b cursor-pointer" onClick={() => handleSort("name")}>
                  Name {getSortIcon("name")}
                </th>

                <th className="p-3 border-b cursor-pointer" onClick={() => handleSort("appointmentDate")}>
                  Date {getSortIcon("appointmentDate")}
                </th>

                <th className="p-3 border-b cursor-pointer" onClick={() => handleSort("appointmentTime")}>
                  Time {getSortIcon("appointmentTime")}
                </th>

                <th className="p-3 border-b cursor-pointer" onClick={() => handleSort("status")}>
                  Status {getSortIcon("status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.map((a) => (
                <tr
                  key={a.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="p-3 border-b font-medium">{a.id}</td>
                  <td className="p-3 border-b">{a.name}</td>
                  <td className="p-3 border-b">{a.appointmentDate}</td>
                  <td className="p-3 border-b">{formatAppointmentTime(a.appointmentTime)}</td>
                  <td className="p-3 border-b">
                    <div className="flex items-center justify-between">
                      <span
                        className={`capitalize ${
                          a.status === "cancelled"
                            ? "text-red-500"
                            : a.status === "pending"
                            ? "text-yellow-600"
                            : a.status === "rejected"
                            ? "text-red-500"
                            : a.status === "approved"
                            ? "text-green-600"
                            : "text-gray-700"
                        }`}
                      >
                        {a.status}
                      </span>
                      <DropdownMenu
                        open={openDropdownId === a.id}
                        onToggle={() =>
                          setOpenDropdownId(openDropdownId === a.id ? null : a.id)
                        }
                        onView={() => handleView(a.id)}
                       onApprove={a.status === "pending" ? async () => {
                        const note = prompt("Enter a note before approving:") || "";
                        await handleApprove(a.id, note);
                      } : undefined}

                      onReject={a.status === "pending" ? async () => {
                        const note = prompt("Enter a note before rejecting:") || "";
                        await handleReject(a.id, note);
                      } : undefined}
                        visibleButtons={["View", "Approve", "Reject"]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
