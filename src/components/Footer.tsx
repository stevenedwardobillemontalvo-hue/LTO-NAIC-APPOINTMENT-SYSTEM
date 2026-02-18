import { Link } from "react-router-dom";

export default function Footer() {
  const yearToday = new Date().getFullYear();

  return (
    <footer className="relative z-20 bg-gray-950 text-gray-200 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
        
        <div className="flex items-center gap-2 text-sm">
          <span>LTO Naic Appointment System</span>
          <span>©</span>
          <span>{yearToday}</span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <Link
            to="/privacy-policy"
            className="opacity-90 hover:opacity-100 hover:text-blue-600 transition-colors duration-200"
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms-and-condition"
            className="opacity-90 hover:opacity-100 hover:text-blue-600 transition-colors duration-200"
          >
            Terms of Services
          </Link>
        </div>
      </div>
    </footer>
  );
}
