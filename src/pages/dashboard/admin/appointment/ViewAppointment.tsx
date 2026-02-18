import { useState } from "react";
import DropdownMenu from "../../../../components/dropdownMenu";
import {
  // viewAppointment,
  statusAppointment,
  AppointmentNote
} from "../../../../services/admin/appointment";
import { useSnackbar } from "notistack";

interface Props {
  appointment: {
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
  };
  onApprove: (note: string) => void;
  onReject: (note: string) => void;
}

// interface Appointment {
//   id: string;
//   name: string;
//   appointmentDate: string;
//   appointmentTime: string;
//   status: string;
//   note?: string;
// }

export default function ViewAppointment({
  appointment,
  onApprove,
  // onReject,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [note, setNote] = useState(appointment.note || "");
  // const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [processing, setProcessing] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  if (!appointment) return null;

  const requirement = appointment.requirement || {};
  const transactionType = appointment.typeOfTransaction || "N/A";
  const personal = appointment.client || {};

 const handleApprove = async () => {
  if (processing) return;
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    setProcessing(true);
    await statusAppointment(appointment.id, token, "approved");
    if (note.trim() !== "") {
      await AppointmentNote(appointment.id, token, note);
    }
    
    enqueueSnackbar("Appointment approved!", { variant: "success" });

    onApprove(note);
    setOpenMenu(false);

  } catch (err) {
    console.error(err);
    enqueueSnackbar("Failed to approve appointment", { variant: "error" });
  }finally {
    setProcessing(false);
  }
};

  
  const handleReject = async () => {
    if (processing) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setProcessing(true);
      await statusAppointment(appointment.id, token, "rejected");
      if (note.trim() !== "") {
        await AppointmentNote(appointment.id, token, note);
      }
    
      enqueueSnackbar("Appointment disapproved!", { variant: "warning" });

      // onReject(note);
      setOpenMenu(false);

    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to reject appointment", { variant: "error" });
    }finally {
    setProcessing(false);
  }
  };

  const formatAppointmentTime = (time: string) => {
  // const [startStr, endStr] = time.split("-");
  // let start = Number(startStr);
  // let end = Number(endStr);

  // const formatHour = (hour: number) => {
  //   if (hour === 12) return "12:00PM";
  //   if (hour >= 1 && hour < 12) return `${hour}:00${hour >= 8 ? "AM" : "PM"}`; // fix later
  //   return `${hour}:00AM`;
  // };

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
              onApprove={appointment.status === "pending" && !processing ? handleApprove : undefined} 
              onReject={appointment.status === "pending" && !processing ? handleReject : undefined} 
              // visibleButtons={["Approve", "Reject"]}
              visibleButtons={["Approve", "Disapprove"]}
        />
      </div>

      <div className="space-y-1">
        <p>
          <strong>REF. ID:</strong> {appointment.id.toUpperCase()}
        </p>
        <p>
          <strong>Appointment Date & Time:</strong> {appointment.appointmentDate} — {formatAppointmentTime(appointment.appointmentTime)}
        </p>
        {appointment.createdAt && (
          <p>
            <strong>Request Date:</strong>{" "}
            {new Date(appointment.createdAt).toISOString().split("T")[0]}
          </p>
        )}
        <p>
          {/* <strong>Status:</strong> {appointment.status} */}
          <strong>Status:</strong>{" "}
          {appointment.status === "rejected"
            ? "DISAPPROVED"
            : appointment.status.toUpperCase()}
        </p>
      </div>
      <hr />

      <div className="space-y-1">
        <p>
          <strong>Name:</strong> {personal.firstName} {personal.middleName || ""} {personal.lastName || ""}
        </p>
        {personal.birthdate && <p><strong>Birthdate:</strong> {personal.birthdate}</p>}
        {personal.email && <p><strong>Email Address:</strong> {personal.email}</p>}
        {personal.contactNumber && <p><strong>Contact Number:</strong> {personal.contactNumber}</p>}
        <p><strong>Type of Application:</strong> {transactionType}</p>
      </div>
      <hr />

      <div className="flex gap-4">
        <div className="flex-1">
          <strong>Uploaded Requirements:</strong>
          {Object.keys(requirement).length === 0 ? (
            <p>No documents uploaded.</p>
          ) : (
            <ul className="list-disc ml-6">
              {Object.entries(requirement).map(([key, value]) => (
                <li
                  key={key}
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={() => setSelectedFile(value as string)}
                >
                  {key}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex-1">
          {selectedFile ? (
            <img
              src={selectedFile}
              crossOrigin="anonymous"
              alt="Preview"
              className="max-h-80 border rounded cursor-zoom-in"
              onClick={() => setZoomImage(selectedFile)}
            />
          ) : (
            <p>Select a file to preview</p>
          )}
        </div>
      </div>

      {zoomImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setZoomImage(null)}
        >
          <img src={zoomImage} crossOrigin="anonymous" alt="Zoom" className="max-h-full max-w-full cursor-zoom-out" />
        </div>
      )}

      <hr />
       {/* <div>
        <label className="font-semibold">Admin Note:</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full mt-2 p-2 border rounded"
          rows={4}
          placeholder="Enter note here before approving/rejecting..."
        />
      </div> */}
      <div>
        <label className="font-semibold">Admin Note:</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={appointment.status !== "pending"} // disable kung hindi pending
          className={`w-full mt-2 p-2 border rounded ${
            appointment.status !== "pending" ? "bg-gray-200 cursor-not-allowed opacity-70" : "bg-white"
          }`}
          rows={4}
          placeholder="Enter note here before approving/rejecting..."
        />
      </div>
    </div>
  );
}
