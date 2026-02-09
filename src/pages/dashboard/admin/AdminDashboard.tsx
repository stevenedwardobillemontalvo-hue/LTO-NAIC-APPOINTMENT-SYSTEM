import { useEffect, useState } from "react";
import { getAppointmentCharts, getAppointmentCounts, getTodaysAppointments, statusAppointment, viewAppointment } from "../../../services/admin/appointment";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import DropdownMenu from "../../../components/dropdownMenu";
import ViewAppointment from "./appointment/ViewAppointment";
import { useSnackbar } from "notistack";

interface Appointment {
  id: string;
  name: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
}

const AdminDashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [counts, setCounts] = useState({
    approved: 0,
    rejected: 0,
    cancelled: 0,
    pending: 0,
  });
  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>([]);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingView, setLoadingView] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [monthlyChartData, setMonthlyChartData] = useState<any[]>([]);


  const token = localStorage.getItem("token");

  const [sortConfig, setSortConfig] = useState<{ key: keyof Appointment; direction: "asc" | "desc" } | null>(null);

  const getSortIcon = (key: keyof Appointment) => {
    if (!sortConfig || sortConfig.key !== key) return "↕"; 
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const handleSort = (key: keyof Appointment) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedAppointments = [...todaysAppointments].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const order = direction === "asc" ? 1 : -1;

    if (key === "appointmentTime") {
      return (
        (new Date(`2000-01-01 ${a.appointmentTime}`).getTime() -
          new Date(`2000-01-01 ${b.appointmentTime}`).getTime()) *
        order
      );
    }

    if (a[key] < b[key]) return -1 * order;
    if (a[key] > b[key]) return 1 * order;
    return 0;
  });


  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const countData = await getAppointmentCounts(token);
        setCounts(countData);

        const todayData = await getTodaysAppointments(token);
        const sorted = todayData.sort(
          (a: Appointment, b: Appointment) =>
            new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime()
        );
        setTodaysAppointments(sorted);
      } catch (err) {
        console.error(err);
        enqueueSnackbar("Failed to load dashboard data", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleView = async (id: string) => {
    if (!token) return;
    setLoadingView(true);
    try {
      const appointment = await viewAppointment(id);
      setSelected(appointment);
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to fetch appointment details", { variant: "error" });
    } finally {
      setLoadingView(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!token) return;
    try {
      await statusAppointment(id, token, "approved");
      setTodaysAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "approved" } : a))
      );
      if (selected?.id === id) setSelected({ ...selected, status: "approved" });
      enqueueSnackbar("Appointment approved!", { variant: "success" });
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to approve appointment", { variant: "error" });
    }
  };

  const handleReject = async (id: string) => {
    if (!token) return;
    try {
      await statusAppointment(id, token, "rejected");
      setTodaysAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "rejected" } : a))
      );
      if (selected?.id === id) setSelected({ ...selected, status: "rejected" });
      enqueueSnackbar("Appointment rejected!", { variant: "warning" });
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to reject appointment", { variant: "error" });
    }
  };

  const boxClass =
    "bg-white shadow-md rounded-lg p-6 flex flex-col justify-center items-center";

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const chartData = await getAppointmentCharts(token);

        setCounts(chartData.totals);
        setMonthlyChartData(chartData.monthly);

        const todayData = await getTodaysAppointments(token);
        const sorted = todayData.sort((a: Appointment, b: Appointment) => {
          const [aStart] = a.appointmentTime.split("-").map(Number);
          const [bStart] = b.appointmentTime.split("-").map(Number);
          return aStart - bStart;
        });
        setTodaysAppointments(sorted);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  const formatAppointmentTime = (time: string) => {
  const [startStr, endStr] = time.split("-");
  let start = Number(startStr);
  let end = Number(endStr);

  const formatHour = (hour: number) => {
    if (hour === 12) return "12:00PM";
    if (hour >= 1 && hour < 12) return `${hour}:00${hour >= 8 ? "AM" : "PM"}`; // fix later
    return `${hour}:00AM`;
  };

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

  if (loading) return <p className="text-gray-500">Loading dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className={boxClass}>
          <span className="text-gray-500">Rejected</span>
          <span className="text-3xl font-bold">{counts.rejected}</span>
        </div>
        <div className={boxClass}>
          <span className="text-gray-500">Approved</span>
          <span className="text-3xl font-bold">{counts.approved}</span>
        </div>
        <div className={boxClass}>
          <span className="text-gray-500">Cancelled</span>
          <span className="text-3xl font-bold">{counts.cancelled}</span>
        </div>
        <div className={boxClass}>
          <span className="text-gray-500">Pending</span>
          <span className="text-3xl font-bold">{counts.pending}</span>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Monthly Appointment Status
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={monthlyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />

            <Line dataKey="approved" stroke="#16a34a" strokeWidth={3} name="Approved" />
            <Line dataKey="rejected" stroke="#dc2626" strokeWidth={3} name="Rejected" />
            <Line dataKey="pending" stroke="#ca8a04" strokeWidth={3} name="Pending" />
            <Line dataKey="cancelled" stroke="#6b7280" strokeWidth={3} name="Cancelled" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
        {selected ? (
          loadingView ? (
            <p>Loading details...</p>
          ) : (
            <ViewAppointment
              appointment={selected}
              onApprove={() => handleApprove(selected.id)}
              onReject={() => handleReject(selected.id)}
            />
          )
        ) : todaysAppointments.length === 0 ? (
          <p className="text-gray-500">No appointments today</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full border-collapse text-sm text-gray-800">
              <thead className="bg-gray-200 text-left">
                <tr>
                  <th className="p-3 border-b cursor-pointer" onClick={() => handleSort("id")}>
                    ID {getSortIcon("id")}
                  </th>
                  <th className="p-3 border-b cursor-pointer" onClick={() => handleSort("name")}>
                    Name {getSortIcon("name")}
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
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-3 border-b font-medium">{a.id}</td>
                    <td className="p-3 border-b">{a.name}</td>
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
                          onApprove={() => handleApprove(a.id)}
                          onReject={() => handleReject(a.id)}
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
    </div>
  );
};

export default AdminDashboard;
