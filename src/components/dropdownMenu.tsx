import { MoreVertical } from "lucide-react";

interface MenuProps {
  onView?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
  onPrint?: () => void;
  open: boolean;
  onToggle: () => void;
  visibleButtons?: string[];
}

export default function DropdownMenu({
  onView,
  onApprove,
  onReject,
  onCancel,
  onReschedule,
  onPrint,
  open,
  onToggle,
  visibleButtons,
}: MenuProps) {
  const allButtons = [
    { label: "Print", onClick: onPrint, color: "" },
    { label: "View", onClick: onView, color: "" },
    { label: "Approve", onClick: onApprove, color: "text-green-600" },
    { label: "Disapprove", onClick: onReject, color: "text-red-600" },
    { label: "Cancel", onClick: onCancel, color: "text-red-600" },
    { label: "Reschedule", onClick: onReschedule, color: "" },
  ];

  const buttons = visibleButtons
    ? allButtons.filter(btn => visibleButtons.includes(btn.label))
    : allButtons;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={onToggle}
        className="cursor-pointer rounded-full hover:bg-gray-200 p-1 flex items-center justify-center"
      >
        <MoreVertical
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-20">
          <ul className="py-1 text-sm text-gray-700">
            {buttons.map(btn => (
              <li key={btn.label}>
                <button
                  onClick={btn.onClick}
                  disabled={!btn.onClick}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    btn.color
                  } ${!btn.onClick ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {btn.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
