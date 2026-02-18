import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_URL || "https://lto-naic-appointment-server.onrender.com";
const API_BASE = import.meta.env.VITE_BACKEND_URL || "https://lto-naic-appointment-server.onrender.com";

export const getClientAppointments = async (token: string) => {
  const url = `${API_BASE}/appointment/client`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Fetch failed:", errorText);
    throw new Error(`Failed to fetch appointments (${res.status})`);
  }

  const json = await res.json();
  console.log("✅ JSON response:", json);
  return json.appointments || [];
};

export const cancelAppointment = async (id: string, token: string) => {
  const res = await axios.put(
    `${API_BASE}/appointment/client/cancel/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const clientInfo = async (token: string) => {
  const res = await axios.get(`${API_BASE}/appointment/client/info`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.client;
};

export const createAppointment = async (formData: FormData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token not found");
  console.log("Sending form data to backend:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  const res = await axios.post(`${API_BASE}/appointment/client`, formData, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
      // "Content-Type": "application/json"
    },
  });

  return res.data;
};

export const reviewAppointment = async (id: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await axios.get(`${API_BASE}/appointment/client/review/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.appointment;
};

export const getClientAppointmentCounts = async (token: string) => {
  const res = await axios.get(`${API_BASE}/appointment/client/counts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.counts;
};

export const getClientTodaysAppointments = async (token: string) => {
  const res = await axios.get(`${API_BASE}/appointment/client/today`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.appointments;
};

export const rescheduleAppointment = async (appointmentId: string, newDate: string, newTime: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await axios.put(
    `${API_BASE}/appointment/client/reschedule/${appointmentId}`,
    { newDate, newTime },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
};