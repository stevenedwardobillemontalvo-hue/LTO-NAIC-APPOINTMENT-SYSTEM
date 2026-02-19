import { forwardRef } from "react";
// import Logo from "../../../../components/header";
import PrintLogo from "../../../../components/printHeader";
import QRCode from "react-qr-code"

interface PrintProps {
  appointment: {
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
  };
}

const Print = forwardRef<HTMLDivElement, PrintProps>(({ appointment }, ref) => {
  const requirement = appointment.requirement || {};
  const typeOfTransaction = appointment.typeOfTransaction || "N/A";
  const client = appointment.client || {};
  const fullName = `${client.firstName || ""} ${client.middleName || ""} ${client.lastName || ""}`.replace(/\s+/g, " ").trim();

  const confirmationURL = `, "https://lto-naic-appointment-system.vercel.app"/confirmation/${appointment.id}`;

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
    // <div ref={ref} className="p-10 bg-white text-gray-900 space-y-6">
    <div ref={ref} className="p-10 bg-white text-gray-900 space-y-8 leading-relaxed">
      <PrintLogo />

      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-bold text-center uppercase mb-6">
          Appointment Details
        </h2>

        {/* <div className="space-y-1"> */}
        <div className="space-y-2 text-[16px] leading-7">
          {/* <p><strong>ID:</strong> {appointment.id}</p> */}
          <p>
              <strong>Ref. ID:</strong>{" "}
              {(appointment.id || "").slice(0, 8).toUpperCase()}
            </p>
          <p>
            <strong>Appointment Date & Time:</strong> {appointment.appointmentDate} — {formatAppointmentTime(appointment.appointmentTime)}
          </p>
          {appointment.createdAt && (
            <p>
              <strong>Request Date:</strong> {new Date(appointment.createdAt).toISOString().split("T")[0]}
            </p>
          )}
          <p>
            <strong>Status:</strong>{" "}
            {(appointment.status || "N/A").toUpperCase()}
          </p>
        </div>
        <hr className="my-4" />

        {/* <div className="space-y-1"> */}
        <div className="space-y-2 text-[16px] leading-7">
          <p><strong>Name:</strong> {fullName}</p>
          {client.birthdate && <p><strong>Birthdate:</strong> {client.birthdate}</p>}
          {client.email && <p><strong>Email Address:</strong> {client.email}</p>}
          {client.contactNumber && <p><strong>Contact Number:</strong> {client.contactNumber}</p>}
          <p><strong>Type of Application:</strong> {typeOfTransaction}</p>
        </div>
        <hr className="my-4" />

        <div>
          <strong>Uploaded Requirements:</strong>
          {Object.keys(requirement).length === 0 ? (
            <p>No documents uploaded.</p>
          ) : (
            <ul className="list-disc ml-6">
              {Object.entries(requirement).map(([key]) => (
                <li key={key}>
                  {key}
                </li>
              ))}
            </ul>
          )}
        </div>
        <hr className="my-4" />

        <div>
          <p><strong>Note:</strong> {appointment.note || "Kindly bring your hard copy requirement."}</p>
          
        </div>
        <hr className="my-4" />
        {/* <div className="space-y-1"> */}
        <div className="space-y-2 text-[16px] leading-7">
          <p className="mb-2 font-semibold">Scan this QR code to view your confirmation online:</p>
          <QRCode value={confirmationURL} size={130} />
        </div>
      </div>
    </div>
  );
});

export default Print;
