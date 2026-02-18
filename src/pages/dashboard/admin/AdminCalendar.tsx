import { useEffect, useState } from "react";
import { saveBlockDate, getBlockDates } from "../../../services/admin/appointment";
import { socket } from "../../../utils/socket";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSnackbar } from "notistack";
import { format } from "date-fns";
import "./AdminCalendar.scss"

const times = [
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-1:00",
  "1:00-2:00",
  "2:00-3:00",
  "3:00-4:00",
];

export default function BlockDatesPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [active, setActive] = useState(true);
  const [availability, setAvailability] = useState<Record<string, number>>(
    Object.fromEntries(times.map((t) => [t, 6])) 
  );
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();


const handleDateChange = async (date: any) => {
  setSelectedDate(date);

  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const dateString = date.toLocaleDateString("en-CA");
    const blocks = await getBlockDates(token, dateString);

    let updated: Record<string, number>;

    if (blocks.length > 0) {
      updated = Object.fromEntries(times.map((t) => [t, 6])); // default
      for (const b of blocks) {
        updated[b.time] = b.maxSlots;
      }
    } else {
      updated = Object.fromEntries(times.map((t) => [t, isWeekend ? 0 : 6]));
    }

    setAvailability(updated);

    const allZero = Object.values(updated).every((val) => val === 0);
    setActive(!allZero);
  } catch (err) {
    enqueueSnackbar("Failed to fetch block dates", { variant: "error" });
  }
};

  const handleToggleActive = () => {
    setActive((prev) => {
      const newActive = !prev;
      setAvailability((prevAvail) => {
        const newAvail = Object.fromEntries(
          Object.entries(prevAvail).map(([time]) => [time, newActive ? 6 : 0])
        );
        return newAvail;
      });
      return newActive;
    });
  };

  const handleAdjust = (time: string, change: number) => {
    setAvailability((prev) => {
      const newValue = Math.min(6, Math.max(0, (prev[time] || 0) + change));
      return { ...prev, [time]: newValue };
    });
  };

  const handleSave = async () => {
    if (!selectedDate) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const dateString = selectedDate.toLocaleDateString("en-CA");

      for (const [time, slots] of Object.entries(availability)) {
        await saveBlockDate(token, dateString, time, active ? slots : 0);
      }

      socket.emit("blockDateUpdated", { date: dateString }); 
      enqueueSnackbar("Blocked dates saved successfully!", { variant: "success" });
      setSelectedDate(null);
      setAvailability(Object.fromEntries(times.map((t) => [t, 6])));
    } catch (err) {
      enqueueSnackbar("Failed to save blocked dates", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedDate(null);
    setAvailability(Object.fromEntries(times.map((t) => [t, 6])));
  };

  useEffect(() => {
  socket.on("blockDateUpdated", (data) => {
    console.log("📡 Update received:", data);

    setAvailability((prev) => {
      if (selectedDate && data.date === selectedDate.toISOString().split("T")[0]) {
        return { ...prev, [data.time]: data.maxSlots };
      }
      return prev;
    });
  });

  return () => {
    socket.off("blockDateUpdated");
  };
}, [selectedDate]);


  return (
    <div className="flex p-8 gap-8">
      <div className="w-2/3">
        <h1 className="text-2xl font-semibold mb-4">Manage Calendar</h1>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">
              Selected Date:{" "}
              <span className="font-bold text-blue-600">
                {selectedDate ? selectedDate.toDateString() : "None"}
              </span>
            </h2>

            {selectedDate && (
              <button
                onClick={handleToggleActive}
                className={`px-4 py-2 rounded ${
                  active ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                }`}
              >
                {active ? "ACTIVE" : "INACTIVE"}
              </button>
            )}
          </div>

          {selectedDate ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border-b">Time</th>
                  <th className="p-2 border-b">Availability</th>
                  <th className="p-2 border-b text-center">Adjust</th>
                </tr>
              </thead>
              <tbody>
                {times.map((time) => (
                  <tr key={time} className="hover:bg-gray-50">
                    <td className="p-2 border-b">{time}</td>
                    <td className="p-2 border-b">{availability[time]}</td>
                    <td className="p-2 border-b text-center">
                      <button
                        onClick={() => handleAdjust(time, -1)}
                        disabled={availability[time] <= 0}
                        className="px-2 py-1 mx-1 bg-red-500 text-white rounded disabled:opacity-50"
                      >
                        −
                      </button>
                      <button
                        onClick={() => handleAdjust(time, +1)}
                        disabled={availability[time] >= 6}
                        className="px-2 py-1 mx-1 bg-green-500 text-white rounded disabled:opacity-50"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">Please select a date to manage. </p>
          )}

          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !selectedDate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* <div className="w-1/3 bg-white shadow rounded-lg p-6"> */}
      <div className="w-1/3 bg-white shadow rounded-lg p-6 flex flex-col h-[420px]">
        <h2 className="text-lg font-semibold mb-2 text-center">CALENDAR</h2>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          // className="rounded-lg border-none"
          calendarType="gregory"
          formatShortWeekday={(_, date) => format(date, "EEE").toUpperCase()}
          className="w-full rounded-lg border-none text-base"
        />
      </div>
    </div>
  );
}
