import { getBlockDates } from "../../../services/admin/appointment";
import { rescheduleAppointment } from "../../../services/client/appointment";
import { format } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";

const TIME_SLOTS = ["8-9","9-10","10-11","11-12","12-1","1-2","2-3","3-4"];

interface Props {
  appointmentId: string;
  onSave: (newDate: string, newTime: string) => void | Promise<void>;
}

export default function RescheduleCalendar({ appointmentId }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [_blockedDates, setBlockedDates] = useState<string[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const today = new Date().toISOString().split("T")[0];
        const data = await getBlockDates(token, today);
        setBlockedDates([...new Set(data.map((b: any) => b.date))]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlocks();
  }, []);

  const handleDateChange = async (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const dateStr = format(date, "yyyy-MM-dd");
      const data = await getBlockDates(token, dateStr);
      setBlockedTimes(data);
    } catch (err) {
      console.error(err);
      setBlockedTimes([]);
    }
  };

  const handleSave = async () => {
    if (!selectedDate || !selectedSlot) return alert("Select date and time!");
    try {
      await rescheduleAppointment(
        appointmentId,
        format(selectedDate, "yyyy-MM-dd"),
        selectedSlot
      );
      alert("Appointment rescheduled successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to reschedule appointment.");
    }
  };

  if (loading) return <p>Loading calendar...</p>;

  return (
    <div className="flex max-w-4xl mx-auto mt-10 bg-white p-6 rounded-lg shadow gap-6">
      <div className="w-1/3">
        <h3 className="text-lg font-semibold mb-2">🕒 Time Slots</h3>
        {selectedDate ? (
          <ul>
            {TIME_SLOTS.map((slot) => {
              const block = blockedTimes.find((b) => b.time === slot);
              const totalSlots = block ? block.maxSlots : 6;

              return (
                <li
                  key={slot}
                  className={`p-2 mb-1 rounded ${
                    totalSlots <= 0
                      ? "bg-red-400 text-white cursor-not-allowed"
                      : selectedSlot === slot
                      ? "bg-blue-400 text-white cursor-pointer"
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
          <p className="text-gray-500">Select a date to see availability</p>
        )}
      </div>

      <div className="w-2/3">
        <h2 className="text-xl font-semibold mb-3">📅 Appointment Calendar</h2>
        <Calendar
          onChange={(value) => handleDateChange(value as Date)}
          value={selectedDate}
        />
        {selectedDate && <p>Selected Date: {format(selectedDate, "yyyy-MM-dd")}</p>}
        {selectedSlot && <p>Selected Time: {selectedSlot}</p>}
      </div>

      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save
      </button>
    </div>
  );
}
