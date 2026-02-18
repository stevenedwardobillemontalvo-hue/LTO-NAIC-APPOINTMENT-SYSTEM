import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import { viewAppointment, statusAppointment } from "../../../../services/admin/appointment";
import { viewAppointment } from "../../../../services/admin/appointment";
import ViewAppointment from "./ViewAppointment";
import { useSnackbar } from "notistack";

export default function ViewAppointmentWrapper() {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar()
  // const [processing, setProcessing] = useState(false);

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

const handleApprove = (note: string) => {
  setAppointment({ ...appointment, status: "approved", note });
};

const handleReject = (note: string) => {
  setAppointment({ ...appointment, status: "rejected", note });
};

  return (
    <ViewAppointment
      appointment={appointment}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}
