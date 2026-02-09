import { useState, useRef, useEffect } from "react";
import DropdownMenu from "../../../../components/dropdownMenu";
import { useReactToPrint } from "react-to-print";
import Print from "./PrintAppointment";
import RescheduleCalendar from "../Resched";
import { rescheduleAppointment } from "../../../../services/client/appointment";

interface Appointment {
  id: string;
  name: string;
  appointmentDate: string;
  appointmentTime: string;
  createdAt?: string;
  status: string;
  typeOfTransaction?: string;
  requirement?: Record<string, string>;
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

interface Props {
  appointment: Appointment;
  onUpdate?: (updated: Appointment) => void;
}

export default function ViewAppointment({ appointment, onUpdate }: Props) {
  if (!appointment) return null;

  const requirement = appointment.requirement || {};
  const transactionType = appointment.typeOfTransaction || "N/A";
  const personal = appointment.client || {};

  const [printAppointment, setPrintAppointment] = useState<Appointment | null>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Appointment",
    onAfterPrint: () => setPrintAppointment(null),
  });

  const onPrintClick = (appointment: Appointment) => setPrintAppointment(appointment);

  useEffect(() => {
    if (printAppointment) handlePrint();
  }, [printAppointment]);

  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (confirmCancel) {
      console.log("Cancelled appointment:", appointment.id);
      alert("Appointment cancelled successfully.");
    }
  };

  const handleReschedule = () => setRescheduleMode(true);

  const handleSaveReschedule = async (newDate: string, newTime: string) => {
    try {
      await rescheduleAppointment(appointment.id, newDate, newTime);
      alert("Appointment rescheduled successfully!");
      setRescheduleMode(false);

      if (onUpdate) {
        onUpdate({
          ...appointment,
          appointmentDate: newDate,
          appointmentTime: newTime,
          status: "pending",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to reschedule appointment.");
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

  return (
    <div className="bg-gray-100 p-6 rounded-lg text-gray-800 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Appointment Details</h2>
        <DropdownMenu
          open={openMenu}
          onToggle={() => setOpenMenu(!openMenu)}
          onCancel={
            appointment.status === "pending" || appointment.status === "approved"
              ? handleCancel
              : undefined
          }
          onReschedule={appointment.status === "approved" ? handleReschedule : undefined}
          onPrint={appointment.status === "approved" ? () => onPrintClick(appointment) : undefined}
          visibleButtons={["Reschedule", "Cancel", "Print"]}
        />
      </div>

      {rescheduleMode ? (
        <RescheduleCalendar
          appointmentId={appointment.id}
          onSave={handleSaveReschedule}
        />
      ) : (
        <>
          <div className="space-y-1">
            <p><strong>ID:</strong> {appointment.id}</p>
            <p>
              <strong>Appointment Date & Time:</strong>{" "}
              {appointment.appointmentDate} — {formatAppointmentTime(appointment.appointmentTime)}
            </p>
            {appointment.createdAt && (
              <p>
                <strong>Request Date:</strong>{" "}
                {new Date(appointment.createdAt).toISOString().split("T")[0]}
              </p>
            )}
            <p><strong>Status:</strong> {appointment.status}</p>
          </div>
          <hr />

          <div className="space-y-1">
            <p>
              <strong>Name:</strong> {personal.firstName} {personal.middleName || ""}{" "}
              {personal.lastName || ""}
            </p>
            {personal.birthdate && <p><strong>Birthdate:</strong> {personal.birthdate}</p>}
            {personal.email && <p><strong>Email Address:</strong> {personal.email}</p>}
            {personal.contactNumber && <p><strong>Contact Number:</strong> {personal.contactNumber}</p>}
            <p><strong>Type of Application:</strong> {transactionType}</p>
          </div>
          <hr />

          <div>
            <strong>Uploaded Requirements:</strong>
            {Object.keys(requirement).length === 0 ? (
              <p>No documents uploaded.</p>
            ) : (
              <ul className="list-disc ml-6">
                {Object.entries(requirement).map(([key, value]) => (
                  <li key={key}>
                    {key}:{" "}
                    <a href={value as string} target="_blank" rel="noreferrer">
                      {value as string}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <hr />

          <div>
            <p>{appointment.note || ""}</p>
          </div>
        </>
      )}

      {printAppointment && (
        <div style={{ display: "none" }}>
          <Print ref={printRef} appointment={printAppointment} />
        </div>
      )}
    </div>
  );
}
