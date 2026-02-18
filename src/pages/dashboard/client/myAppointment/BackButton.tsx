import { IoArrowBackCircle } from "react-icons/io5";

interface BackButtonProps {
  onBack: () => void;
}

export default function BackButton({ onBack }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
    >
      <IoArrowBackCircle className="text-2xl mr-2" />
      Back
    </button>
  );
}
