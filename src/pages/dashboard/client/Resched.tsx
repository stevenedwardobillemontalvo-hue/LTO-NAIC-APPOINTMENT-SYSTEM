import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getBlockDates } from "../../../services/admin/appointment";
import { rescheduleAppointment } from "../../../services/client/appointment";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";
import { useSnackbar } from "notistack";

interface BlockDate {
  id?: string;
  date: string;
  time: string;
  maxSlots: number;
}

interface Props {
  appointmentId: string;
  appointmentDate: string;
  onSave: (newDate: string, newTime: string) => void | Promise<void>;
}

const TIME_SLOTS = [
  "08:00AM-09:00AM",
  "09:00AM-10:00AM",
  "10:00AM-11:00AM",
  "11:00AM-12:00PM",
  "12:00PM-1:00PM",
  "1:00PM-2:00PM",
  "2:00PM-3:00PM",
  "3:00PM-4:00PM",
];

const normalizeSlot = (slot: string) => {
  const [start] = slot.split("-");
  return `${parseInt(start)}:00-${parseInt(start) + 1}:00`;
};

const normalizeBackendTime = (time: string) => {
  const [start] = time.split("-");
  return `${parseInt(start)}:00-${parseInt(start) + 1}:00`;
};

export default function RescheduleCalendar({ appointmentId, appointmentDate }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;
  // const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
  appointmentDate ? new Date(appointmentDate) : null
);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const today = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1);

        const map: Record<string, number> = {};
        let d = new Date(today);

        while (d <= nextMonth) {
          const dateStr = format(d, "yyyy-MM-dd");
          const data: BlockDate[] = await getBlockDates(token, dateStr);

          const totalSlots = data.reduce((sum, b) => sum + b.maxSlots, 0);
          const day = d.getDay();
          map[dateStr] = data.length === 0 ? (day === 0 || day === 6 ? 0 : 6) : totalSlots;

          d.setDate(d.getDate() + 1);
        }

        setAvailabilityMap(map);

        if (appointmentDate) {
          const dateObj = new Date(appointmentDate);
          await loadTimeSlots(dateObj);
        }
      } catch (err) {
        console.error(err);
        enqueueSnackbar("Failed to fetch availability.", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const loadTimeSlots = async (date: Date) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const dateStr = format(date, "yyyy-MM-dd");
    const data: BlockDate[] = await getBlockDates(token, dateStr);
    setBlockedTimes(data);

    const firstAvailableSlot = TIME_SLOTS.find((slot) => {
      const block = data.find((b) => normalizeBackendTime(b.time) === normalizeSlot(slot));
      return (block ? block.maxSlots : 6) > 0;
    });
    if (firstAvailableSlot) setSelectedSlot(firstAvailableSlot);
  };

  const handleDateChange = async (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    await loadTimeSlots(date);
  };

  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

  const tileDisabled = ({ date, view }: any) => {
    if (view !== "month") return false;

    const today = new Date();
    const dateStr = format(date, "yyyy-MM-dd");
    const slots = availabilityMap[dateStr] ?? (isWeekend(date) ? 0 : 6);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);
    return date < today || date <= sevenDaysLater || slots <= 0;
  };

  const tileClassName = ({ date, view }: any) => {
    if (view !== "month") return "";

    const dateStr = format(date, "yyyy-MM-dd");
    const slots = availabilityMap[dateStr] ?? (isWeekend(date) ? 0 : 6);
    if (slots <= 0) return "blocked-date";
    return "";
  };

  const handleSave = async () => {
    if (!selectedDate || !selectedSlot) {
      enqueueSnackbar("Please select a date and time slot.", {
        variant: "warning",
      });
      return;
    }

    try {
      await rescheduleAppointment(
        appointmentId,
        format(selectedDate, "yyyy-MM-dd"),
        selectedSlot
      );

      enqueueSnackbar("Appointment rescheduled successfully!", { variant: "success" });

      if (typeof window !== "undefined") {
      window.location.href = `http://localhost:5173/dashboard/${userId}/my-appointments`;
    }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to reschedule appointment.", { variant: "error" });
    }
  };

  if (loading) return <p>Loading calendar...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Reschedule Appointment</h2>

      <div className="flex gap-6">
        <div className="w-1/3">
          <h3 className="text-lg font-semibold mb-2">Time Slots</h3>
          {selectedDate ? (
            <ul>
              {TIME_SLOTS.map((slot) => {
                const block = blockedTimes.find(
                  (b) => normalizeBackendTime(b.time) === normalizeSlot(slot)
                );
                const totalSlots = block ? block.maxSlots : isWeekend(selectedDate) ? 0 : 6;
                return (
                  <li
                    key={slot}
                    className={`p-2 mb-1 rounded ${
                      totalSlots <= 0
                        ? "bg-red-400 text-white cursor-not-allowed"
                        : selectedSlot === slot
                        ? "bg-blue-500 text-white cursor-pointer"
                        : "bg-green-200 cursor-pointer"
                    }`}
                    onClick={() => totalSlots > 0 && setSelectedSlot(slot)}
                  >
                    {slot} — {totalSlots} available
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500">Select a date to show appointment availability</p>
          )}
        </div>

        <div className="w-2/3">
          <div className="calendar-wrapper">
            <Calendar
              calendarType="gregory"
              tileDisabled={tileDisabled}
              tileClassName={tileClassName}
              onChange={(value) => handleDateChange(value as Date)}
              value={selectedDate}
              formatShortWeekday={(_, date) => format(date, "EEE").toUpperCase()}
            />
          </div>

          {selectedDate && (
            <p className="mt-3 text-gray-700">
              Selected Date: <strong>{format(selectedDate, "MMMM dd, yyyy")}</strong>
            </p>
          )}
          {selectedSlot && (
            <p className="mt-1 text-gray-700">
              Selected Time: <strong>{selectedSlot}</strong>
            </p>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .blocked-date {
          background-color: #f87171;
          color: white;
          cursor: not-allowed;
        }
        .calendar-wrapper .react-calendar {
          width: 100% !important;
          font-size: 1.2rem !important;
          border-radius: 14px !important;
          padding: 14px !important;
          border: 1px solid #e5e7eb !important;
        }
        .calendar-wrapper .react-calendar__tile {
          height: 65px !important;
          font-size: 1.05rem !important;
        }
        .calendar-wrapper .react-calendar__navigation__label {
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}