import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getBlockDates } from "../../../../services/admin/appointment";
import { format } from "date-fns";
import { useSnackbar } from "notistack";


interface BlockDate {
  id?: string;
  date: string;
  time: string;
  maxSlots: number;
}

const TIME_SLOTS = ["08:00AM-09:00AM","09:00AM-10:00AM","10:00AM-11:00AM","11:00AM-12:00PM","12:00PM-1:00PM","1:00PM-2:00PM","2:00PM-3:00PM","3:00PM-4:00PM"];
// const TIME_SLOTS = ["8-9","9-10","10-11","11-12","12-1","1-2","2-3","3-4"];

const normalizeSlot = (slot: string) => {
  const [start, end] = slot.split("-");
  return `${parseInt(start)}:00-${parseInt(end)}:00`;
};

const normalizeBackendTime = (time: string) => {
  const [start, end] = time.split("-");
  return `${parseInt(start)}:00-${parseInt(end)}:00`;
};

interface Props {
  data: any;
  updateForm: (updates: any) => void;
  onNext: () => void;
}

export default function Step1Calendar({ updateForm, onNext }: Props) {
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, number>>({});
  const [availabilityRange, setAvailabilityRange] = useState<{ start: string; end: string } | null>(null);

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
          if (data.length === 0) {
            map[dateStr] = day === 0 || day === 6 ? 0 : 6; 
          } else {
            map[dateStr] = totalSlots;
          }

          d.setDate(d.getDate() + 1);
        }

        setAvailabilityMap(map);
        setAvailabilityRange({
          start: format(today, "yyyy-MM-dd"),
          end: format(nextMonth, "yyyy-MM-dd"),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);


  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const today = new Date().toISOString().split("T")[0];
        const data: BlockDate[] = await getBlockDates(token, today);
        const uniqueDates = [...new Set(data.map((b) => b.date))];
        setBlockedDates(uniqueDates);
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
      const data: BlockDate[] = await getBlockDates(token, dateStr);

      const blocks = data.map((b, idx) => ({
        id: b.id || `slot-${idx}`,
        date: b.date,
        time: b.time,
        maxSlots: b.maxSlots,
      }));

      setBlockedTimes(blocks);
    } catch (err) {
      console.error(err);
      setBlockedTimes([]);
    }
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; 
  };


const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
  if (view !== "month") return false;

  const today = new Date();
  const dateStr = format(date, "yyyy-MM-dd");

  if (date < today) return true;

  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(today.getDate() + 7);
  if (date <= sevenDaysLater) return true;

  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;

  let slots = availabilityMap[dateStr];

  // ✅ If no backend data, apply default rule
  if (slots === undefined) {
    slots = isWeekend ? 0 : 6;
  }

  return slots <= 0;
};

const tileClassName = ({ date, view }: { date: Date; view: string }) => {
  if (view !== "month") return "";

  const today = new Date();
  const dateStr = format(date, "yyyy-MM-dd");

  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(today.getDate() + 7);

  if (date < today) return "blocked-date";
  if (date <= sevenDaysLater) return "blocked-date";

  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;

  let slots = availabilityMap[dateStr];

  // ✅ Apply default rule if undefined
  if (slots === undefined) {
    slots = isWeekend ? 0 : 6;
  }

  if (slots <= 0) return "blocked-date";

  return "";
};

  
  const handleNext = () => {
     if (!selectedDate || !selectedSlot) {
    enqueueSnackbar("Please select date and time first.", {
      variant: "warning",
    });
    return;
  }
    updateForm({
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedSlot,
    });
    onNext();
  };

  if (loading) return <p>Loading calendar...</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Appointment Date</h2>
    <div className="flex max-w-4xl mx-auto mt-10 bg-white p-6 rounded-lg shadow gap-6">
      <div className="w-1/3">
        <h3 className="text-lg font-semibold mb-2">Time Slots</h3>
        {selectedDate ? (
          <ul>
            {TIME_SLOTS.map((slot) => {
              const block = blockedTimes.find(
                (b) => normalizeBackendTime(b.time) === normalizeSlot(slot)
              );

              let totalSlots;
              if (block) {
                totalSlots = block.maxSlots;
              } else {
                const day = selectedDate?.getDay() ?? 1;
                totalSlots = day === 0 || day === 6 ? 0 : 6;
              }

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
                  onClick={() => {
                    if (totalSlots > 0) setSelectedSlot(slot);
                  }}
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
  {/* <h2 className="text-xl font-semibold mb-3">Appointment Calendar</h2> */}

  <div className="calendar-wrapper">
  <Calendar
    calendarType="gregory"
    tileClassName={tileClassName}
    tileDisabled={tileDisabled}
    onChange={(value) => handleDateChange(value as Date)}
    value={selectedDate}
    formatShortWeekday={(_, date) => format(date, "EEE").toUpperCase()}
  />
</div>


  {/* <Calendar
    tileClassName={tileClassName}
    tileDisabled={tileDisabled}
    onChange={(value) => handleDateChange(value as Date)}
    value={selectedDate}
  /> */}

  {selectedDate && (
    <p className="mt-2 text-gray-700">
      Selected Date: {format(selectedDate, "MMMM dd, yyyy")}
    </p>
  )}

  {selectedSlot && (
    <p className="mt-1 text-gray-700">Selected Time: {selectedSlot}</p>
  )}

  <div className="flex justify-end mt-4">
    <button
      onClick={handleNext}
      className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      <span>Next </span>
      <span className="text-lg font-semibold">→</span>
    </button>
  </div>
</div>


      {/* <div className="w-2/3">
        <h2 className="text-xl font-semibold mb-3">Appointment Calendar</h2>
        <Calendar
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
          onChange={(value) => handleDateChange(value as Date)}
          value={selectedDate}
        />
        {selectedDate && (
          <p className="mt-2 text-gray-700">
            Selected Date: {format(selectedDate, "yyyy-MM-dd")}
          </p>
        )}
        {selectedSlot && (
          <p className="mt-1 text-gray-700">Selected Time: {selectedSlot}</p>
        )}
      </div>

      <button
        onClick={handleNext}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next ➜
      </button> */}


      <style>{`
        .blocked-date {
          background-color: #f87171;
          color: white;
          cursor: not-allowed;
        }

        .calendar-wrapper .react-calendar {
        width: 100% !important;
        max-width: 100% !important;
        font-size: 1.2rem !important;
        border-radius: 14px !important;
        padding: 14px !important;
        border: 1px solid #e5e7eb !important;
      }

      .calendar-wrapper .react-calendar__navigation button {
        font-size: 1.2rem !important;
        min-height: 65px !important;
      }

      .calendar-wrapper .react-calendar__tile {
        height: 65px !important;
        font-size: 1.05rem !important;
      }

      .calendar-wrapper .react-calendar__month-view__weekdays {
        font-size: 1rem !important;
      }

      .calendar-wrapper .react-calendar__navigation__label {
        text-transform: uppercase !important;
        font-weight: 700;
      }

      `}</style>
    </div>
    </div>
  );
}
