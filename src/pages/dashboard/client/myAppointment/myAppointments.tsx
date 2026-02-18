import { useEffect, useState, useRef } from "react";
import {
  getClientAppointments,
  cancelAppointment,
  reviewAppointment,
  rescheduleAppointment
} from "../../../../services/client/appointment";
import ViewAppointment from "./ViewAppointment";
import DropdownMenu from "../../../../components/dropdownMenu";
import { useReactToPrint } from "react-to-print";
import RescheduleCalendar from "../Resched";
import { useSnackbar } from "notistack";
import BackButton from "./BackButton";
import ConfirmModal from "./ConfirmModal";

interface Appointment {
  id: string;
  name: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  typeOfTransaction?: string;
  requirement?: Record<string, string>;
  personalInfo?: any;
  createdAt?: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [loadingView, setLoadingView] = useState(false);
  const [printAppointment, setPrintAppointment] = useState<Appointment | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const statusColors: Record<string, string> = {
  approved: "text-green-600",
  pending: "text-blue-500",
  rejected: "text-red-600",
  cancelled: "text-orange-500",
};

const statusPriority: Record<string, number> = {
  approved: 1,
  pending: 2,
  rejected: 3,
  cancelled: 4,
};


  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Appointment",
    onAfterPrint: () => setPrintAppointment(null),
  });


const canReschedule = (appointment: Appointment) => {
  if (appointment.status !== "approved") return false;
  if (!appointment.createdAt) return false;

  const createdTime = new Date(appointment.createdAt).getTime();
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;

  return now - createdTime <= twentyFourHours;
};
  // const onPrintClick = (appointment: Appointment) => setPrintAppointment(appointment);

  useEffect(() => {
    if (printAppointment) handlePrint();
  }, [printAppointment]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getClientAppointments(token);
        
        // const sorted = data.sort(
        //   (a: Appointment, b: Appointment) =>
        //     new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
        // );
        const sorted = data.sort((a: Appointment, b: Appointment) => {
        const aPriority = statusPriority[a.status] ?? 99;
        const bPriority = statusPriority[b.status] ?? 99;

        if (aPriority !== bPriority) return aPriority - bPriority;

        return (
          new Date(a.appointmentDate).getTime() -
          new Date(b.appointmentDate).getTime()
        );
      });
        setAppointments(sorted);
      } catch (err) {
        console.error(err);
        enqueueSnackbar("Failed to load appointments.", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
    await cancelAppointment(id, token);
    // setAppointments((prev) =>
    //   prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
    // );
    setAppointments((prev) => {
    const updated = prev.map((a) =>
      a.id === id ? { ...a, status: "cancelled" } : a
    );

    return updated.sort((a, b) => {
      const aPriority = statusPriority[a.status] ?? 99;
      const bPriority = statusPriority[b.status] ?? 99;

      if (aPriority !== bPriority) return aPriority - bPriority;

      return (
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime()
      );
    });
  });

    enqueueSnackbar("Appointment cancelled successfully!", { variant: "success" });
  } catch (err) {
    console.error(err);
    enqueueSnackbar("Failed to cancel appointment. Please try again.", { variant: "error" });
  } finally {
    setConfirmCancelId(null);
  }
};

  //   const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
  //   if (!confirmCancel) return;

  //   try {
  //     await cancelAppointment(id, token);
  //     setAppointments((prev) =>
  //       prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
  //     );
  //     enqueueSnackbar("Appointment cancelled successfully!", { variant: "success" });
  //   } catch (err) {
  //     console.error(err);
  //     enqueueSnackbar("Failed to cancel appointment. Please try again.", { variant: "error" });
  //   }
  // };

  const handleView = async (id: string) => {
    setLoadingView(true);
    try {
      const appointment = await reviewAppointment(id);
      setSelected(appointment);
    } catch (err) {
      enqueueSnackbar("Failed to fetch appointment details.", { variant: "error" });
    } finally {
      setLoadingView(false);
      setOpenDropdownId(null); 
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

  // const wrapperRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
  //       setOpenDropdownId(null);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  return slots[time] || time;
};

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="w-full max-w-4xl mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
      {selected && (
        <div className="mb-4">
          <BackButton onBack={() => setSelected(null)} />
        </div>
      )}

      {rescheduleMode && selected ? (
        <RescheduleCalendar
          appointmentId={selected.id}
          appointmentDate={selected.appointmentDate}
          onSave={async (newDate, newTime) => {
            try {
              await rescheduleAppointment(selected.id, newDate, newTime);
               enqueueSnackbar("Appointment rescheduled successfully!", { variant: "success" });
              // setAppointments((prev) =>
              //   prev.map((a) =>
              //     a.id === selected.id
              //       ? { ...a, appointmentDate: newDate, appointmentTime: newTime, status: "pending" }
              //       : a
              //   )
              // );
              setAppointments((prev) => {
              const updated = prev.map((a) =>
                a.id === selected.id
                  ? { ...a, appointmentDate: newDate, appointmentTime: newTime, status: "pending" }
                  : a
              );

              return updated.sort((a, b) => {
                const aPriority = statusPriority[a.status] ?? 99;
                const bPriority = statusPriority[b.status] ?? 99;

                if (aPriority !== bPriority) return aPriority - bPriority;

                return (
                  new Date(a.appointmentDate).getTime() -
                  new Date(b.appointmentDate).getTime()
                );
              });
            });

              setSelected((prev) =>
                prev ? { ...prev, appointmentDate: newDate, appointmentTime: newTime, status: "pending" } : null
              );
            } catch (err) {
              console.error(err);
               enqueueSnackbar("Failed to reschedule appointment.", { variant: "error" });
            } finally {
              setRescheduleMode(false);
            }
          }}
        />
      ) : !selected ? (
        <div className="space-y-4">
          {appointments.length === 0 && <p>No appointments found.</p>}
{appointments.map((a) => (
  <div
    key={a.id}
    className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 md:space-x-6"
  >
    <div className="flex-1 space-y-1">
      <p className="font-semibold">REF. ID: {(a.id || "").slice(0, 8).toUpperCase()}</p>
      <p className="text-sm">
        <span className="font-medium">Appointment Date:</span> {a.appointmentDate} — {formatAppointmentTime(a.appointmentTime)}
      </p>
      {a.createdAt && (
        <p className="text-sm text-gray-500">
          <span className="font-medium">Request Date:</span> {new Date(a.createdAt).toLocaleString()}
        </p>
      )}
      <p className={`text-xs mt-1 font-semibold ${statusColors[a.status] || "text-gray-600"}`}>
        Status: {a.status === "rejected" ? "DISAPPROVED" : a.status.toUpperCase()}
      </p>

      {/* <p className={`text-xs mt-1 font-semibold ${statusColors[a.status] || "text-gray-600"}`}>
        Status: {a.status.toUpperCase()}
      </p> */}
      {/* <p className={`text-xs mt-1 font-semibold ${
        a.status === "cancelled" ? "text-red-600" : "text-green-600"
      }`}>
        Status: {a.status.toUpperCase()}
      </p> */}
    </div>

    <div>
      <DropdownMenu
        open={openDropdownId === a.id}
        onToggle={() => setOpenDropdownId(openDropdownId === a.id ? null : a.id)}
        onView={() => handleView(a.id)}
        onCancel={
          a.status === "pending" || a.status === "approved"
            ? () => setConfirmCancelId(a.id) 
            : undefined
        }
        // onCancel={
        //   a.status === "pending" || a.status === "approved" ? () => handleCancel(a.id) : undefined
        // }
        onReschedule={
          canReschedule(a) 
            ? () => {
                setSelected(a);
                setRescheduleMode(true);
              }
            : undefined
        }
        visibleButtons={["View", "Cancel", "Reschedule"]}
      />

      <ConfirmModal
        open={!!confirmCancelId}
        message="Are you sure you want to cancel this appointment?"
        onConfirm={() => confirmCancelId && handleCancel(confirmCancelId)}
        onCancel={() => setConfirmCancelId(null)}
      />
    </div>
  </div>
))}
          {/* {appointments.length === 0 && <p>No appointments found.</p>}
          {appointments.map((a) => (
            <div
              key={a.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg text-gray-800"
            >
              <div>
                <p className="font-semibold">ID: {a.id}</p>
                <p className="text-sm">
                  APPOINTMENT: {a.appointmentDate} — {a.appointmentTime}
                </p>
                {a.createdAt && (
                  <p className="text-sm">
                    REQUEST DATE: {new Date(a.createdAt).toLocaleString()}
                  </p>
                )}
                <p className={`text-xs mt-1 ${a.status === "cancelled" ? "text-red-500" : "text-green-600"}`}>
                  STATUS: {a.status}
                </p>
              </div>
              <DropdownMenu
                open={openDropdownId === a.id}
                onToggle={() => setOpenDropdownId(openDropdownId === a.id ? null : a.id)}
                onView={() => handleView(a.id)}
                onCancel={
                  a.status === "pending" || a.status === "approved" ? () => handleCancel(a.id) : undefined
                }
                onReschedule={
                  a.status === "approved"
                    ? () => {
                        setSelected(a);
                        setRescheduleMode(true);
                      }
                    : undefined
                }
                visibleButtons={["View", "Cancel", "Reschedule"]}
              />
            </div>
          ))} */}
        </div>
      ) : loadingView ? (
        <p>Loading details...</p>
      ) : (
        <ViewAppointment
          appointment={selected}
          onUpdate={(updated) => {
            setAppointments((prev) =>
              prev.map((a) => (a.id === updated.id ? updated : a))
            );
            setSelected(updated);
          }}
        />
      )}
    </div>
  );
}
