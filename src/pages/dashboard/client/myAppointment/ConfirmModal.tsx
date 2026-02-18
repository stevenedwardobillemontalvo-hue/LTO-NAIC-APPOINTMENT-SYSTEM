interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export default function ConfirmModal({
  open,
  title = "Confirmation",
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "No",
  loading = false,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded p-6 w-full max-w-md relative border-gray-500">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onCancel}
          type="button"
        >
          &times;
        </button>

        <h3 className="text-lg font-bold mb-4">{title}</h3>

        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
            disabled={loading}
            type="button"
          >
            {loading ? "Processing..." : confirmText}
          </button>

          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 w-full"
            disabled={loading}
            type="button"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
