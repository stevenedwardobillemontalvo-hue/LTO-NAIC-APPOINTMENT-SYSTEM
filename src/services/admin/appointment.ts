import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://lto-naic-appointment-server.onrender.com";

export const getAdminAppointments = async (token: string) => {
  const url = `${API_BASE}/appointment/admin/appointment`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("📩 Response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Fetch failed:", errorText);
    throw new Error(`Failed to fetch appointments (${res.status})`);
  }

  const json = await res.json();
  console.log("JSON response:", json);
  return json.appointments || [];
};

export const statusAppointment = async (
  id: string,
  token: string,
  status: "approved" | "rejected"
) => {
  const res = await axios.put(
    `${API_BASE}/appointment/admin/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const AppointmentNote = async (
  id: string,
  token: string,
  note: string
) => {
  const res = await axios.post(
    `${API_BASE}/appointment/admin/${id}/notes`,
    { note },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

export const getAllClients = async (token: string) => {
  try {
    const res = await axios.get(`${API_BASE}/appointment/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.users;
  } catch (err: any) {
    throw err;
  }
};

export const saveBlockDate = async (token: string, date: string, time: string, maxSlots: number) => {
  const res = await axios.post(
    `${API_BASE}/appointment/admin/block-dates`,
    { date, time, maxSlots },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getBlockDates = async (
  token: string,
  date: string
): Promise<{ date: string; time: string; maxSlots: number }[]> => {
  const res = await axios.get(`${API_BASE}/appointment/block-dates`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { date },
  });
  return res.data.blocks || [];
};

export const viewAppointment = async (id: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await axios.get(`${API_BASE}/appointment/admin/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.appointment;
};

export const updateClientInfo = async (
  clientId: string,
  token: string,
  data: { email?: string; birthdate?: string | null; ltms_number?: string | null }
) => {
  try {
    const res = await axios.put(`${API_BASE}/appointment/admin/users/${clientId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.user;
  } catch (err: any) {
    console.error("Failed to update client info:", err.response?.data || err.message);
    throw err;
  }
};

export const getAppointmentCounts = async (token: string) => {
  const res = await axios.get(`${API_BASE}/appointment/admin/appointments/counts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.counts;
};

export const getAppointmentCharts = async (token: string) => {
  const res = await axios.get(`${API_BASE}/appointment/admin/appointments/charts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; 
};

export const getTodaysAppointments = async (token: string) => {
  const res = await axios.get(`${API_BASE}/appointment/admin/appointments/today`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.appointments; 
};

export const getAllAdmins = async (token: string) => {
  try {
    const res = await axios.get(`${API_BASE}/appointment/admins`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.admins; 
  } catch (err: any) {
    console.error("Failed to fetch admins:", err.response?.data || err.message);
    throw err;
  }
};
