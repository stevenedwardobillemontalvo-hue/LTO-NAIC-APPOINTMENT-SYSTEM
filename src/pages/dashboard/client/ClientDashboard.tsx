import { useEffect, useState } from "react";
import {
  getClientAppointmentCounts,
  getClientTodaysAppointments,
  reviewAppointment,
  cancelAppointment,
} from "../../../services/client/appointment";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Appointment {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
}

export default function ClientDashboard() {
  const [counts, setCounts] = useState({
    approved: 0,
    rejected: 0,
    cancelled: 0,
    pending: 0,
  });

  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>([]);
  const [_selected, setSelected] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const countData = await getClientAppointmentCounts(token);
        setCounts(countData);

        const todayData = await getClientTodaysAppointments(token);
        setTodaysAppointments(todayData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleView = async (id: string) => {
    const appointment = await reviewAppointment(id);
    setSelected(appointment);
  };

  const handleCancel = async (id: string) => {
    await cancelAppointment(id, token!);
    setTodaysAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "cancelled" } : a));
  };

  const chartData = [
    { name: "Approved", count: counts.approved },
    { name: "Rejected", count: counts.rejected },
    { name: "Cancelled", count: counts.cancelled },
    { name: "Pending", count: counts.pending },
  ];

  if (loading) return <p>Loading…</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-center items-center">
          <span className="text-gray-500">Approved</span>
          <span className="text-3xl font-bold">{counts.approved}</span>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-center items-center">
          <span className="text-gray-500">Rejected</span>
          <span className="text-3xl font-bold">{counts.rejected}</span>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-center items-center">
          <span className="text-gray-500">Cancelled</span>
          <span className="text-3xl font-bold">{counts.cancelled}</span>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-center items-center">
          <span className="text-gray-500">Pending</span>
          <span className="text-3xl font-bold">{counts.pending}</span>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-lg mb-4">Charts</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" stroke="#4f46e5" dataKey="count" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg mb-4">Today's Appointments</h2>

        {todaysAppointments.length === 0 ? (
          <p>No appointments today.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todaysAppointments.map(a => (
                <tr key={a.id} className="border-b">
                  <td className="p-3">{a.appointmentTime}</td>
                  <td className="p-3 capitalize">{a.status}</td>
                  <td className="p-3">
                    <button className="text-blue-600 mr-3" onClick={() => handleView(a.id)}>View</button>
                    {a.status === "pending" && (
                      <button className="text-red-600" onClick={() => handleCancel(a.id)}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
