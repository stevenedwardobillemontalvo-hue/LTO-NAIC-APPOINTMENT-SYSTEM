import { useState } from "react";
import { useSnackbar } from "notistack";

interface NoteModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

export default function NoteModal({ title, isOpen, onClose, onSubmit }: NoteModalProps) {
  const [note, setNote] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = () => {
    if (!note.trim()){
        enqueueSnackbar("Please enter a note before submitting.", { variant: "warning" });
    return; 
    }
    onSubmit(note);
    setNote("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-40">
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <textarea
          className="border w-full p-2 rounded mb-4"
          placeholder="Enter note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => { setNote(""); onClose(); }}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}