import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";

const Terms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
      >
        <IoArrowBackCircle className="text-3xl" />
        <span className="text-base font-medium">Back</span>
      </button>

      <h1 className="text-3xl font-bold">Terms of Service – LTO NAIC</h1>
      <p><strong>Effective Date:</strong> February 18, 2026</p>
      <p>
        These Terms of Service (“Terms”) govern your use of the{" "}
        <strong>LTO NAIC</strong> application. By using our app, you agree to
        these terms.
      </p>

      <h2 className="text-2xl font-semibold">1. Using Our App</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>You must be at least 18 years old to use the app.</li>
        <li>You agree to provide accurate information when signing in via Google OAuth.</li>
      </ul>

      <h2 className="text-2xl font-semibold">2. Account Responsibilities</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>You are responsible for maintaining the confidentiality of your account.</li>
        <li>You agree not to misuse the app or interfere with other users’ experience.</li>
      </ul>

      <h2 className="text-2xl font-semibold">3. Intellectual Property</h2>
      <p>
        All content, logos, and software in LTO NAIC are owned by us. You may not
        copy, modify, or distribute our content without permission.
      </p>

      <h2 className="text-2xl font-semibold">4. Limitation of Liability</h2>
      <p>
        LTO NAIC is provided “as is.” We are not liable for any damages arising
        from your use of the app.
      </p>

      <h2 className="text-2xl font-semibold">5. Termination</h2>
      <p>
        We may suspend or terminate your access if you violate these Terms.
      </p>

      <h2 className="text-2xl font-semibold">6. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the app
        constitutes acceptance of the updated Terms.
      </p>

      <h2 className="text-2xl font-semibold">Contact Us</h2>
      <p>
        For questions regarding these Terms, email us at{" "}
        <a className="text-blue-600 underline" href="mailto:admin@lto.com">
          admin@lto.com
        </a>.
      </p>
    </div>
  );
};

export default Terms;
