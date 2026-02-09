import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Print from "./dashboard/client/myAppointment/PrintAppointment"; 
import { reviewAppointment } from "../../src/services/client/appointment";

interface Appointment {
  id: string;
  name: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  typeOfTransaction?: string;
  requirement?: Record<string, string>;
  createdAt?: string;
  client?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    birthdate?: string;
    email?: string;
    contactNumber?: string;
  };
  note?: string;
}

export default function ConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (id) {
      reviewAppointment(id).then((data) => setAppointment(data));
    }
  }, [id]);

  if (!appointment) {
    return <p className="p-10">Loading appointment...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-10">
      <Print appointment={appointment} />
    </div>
  );
}
