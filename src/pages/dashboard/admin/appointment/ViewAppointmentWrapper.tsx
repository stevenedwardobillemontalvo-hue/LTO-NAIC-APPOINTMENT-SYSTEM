import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { viewAppointment, statusAppointment } from "../../../../services/admin/appointment";
import ViewAppointment from "./ViewAppointment";
import { useSnackbar } from "notistack";

export default function ViewAppointmentWrapper() {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (!appointmentId) return;
    const fetch = async () => {
      try {
        const data = await viewAppointment(appointmentId);
        setAppointment(data);
      } catch (err) {
        console.error(err);
        enqueueSnackbar("Failed to fetch appointment", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [appointmentId]);

  if (loading) return <p>Loading appointment...</p>;
  if (!appointment) return <p>Appointment not found</p>;

  const handleApprove = async () => {
    const token = localStorage.getItem("token");
    try {
      if (!token) return;
      await statusAppointment(appointment.id, token, "approved");
      setAppointment({ ...appointment, status: "approved" });
      enqueueSnackbar("Appointment approved!", { variant: "success" });
    } catch (err) {
        console.error(err);
        enqueueSnackbar("Failed to approve appointment", { variant: "error" });
      }
    };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await statusAppointment(appointment.id, token, "rejected");
      setAppointment({ ...appointment, status: "rejected" });
      enqueueSnackbar("Appointment rejected!", { variant: "warning" });
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to reject appointment", { variant: "error" });
    }
  };

  return (
    <ViewAppointment
      appointment={appointment}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}
