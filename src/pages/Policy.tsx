import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";

const PrivacyPolicy: React.FC = () => {
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

      <h1 className="text-3xl font-bold">Privacy Policy – LTO NAIC</h1>
      <p><strong>Effective Date:</strong> February 18, 2026</p>
      <p>
        <strong>LTO NAIC</strong> (“we”, “our”, “us”) values your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our application.
      </p>

      <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Personal Information:</strong> Name, email address, and other information you provide when signing in using Google OAuth.</li>
        <li><strong>Usage Data:</strong> Information about how you use the app, including actions, preferences, and interactions.</li>
      </ul>

      <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>Provide and improve our services.</li>
        <li>Authenticate your account via Google OAuth.</li>
        <li>Communicate with you about updates with regards of your appointment.</li>
      </ul>

      <h2 className="text-2xl font-semibold">3. Sharing Your Information</h2>
      <p>We do <strong>not</strong> sell or rent your information. We may share information with trusted service providers to help operate the app or comply with legal obligations.</p>

      <h2 className="text-2xl font-semibold">4. Data Security</h2>
      <p>We take reasonable steps to protect your data from unauthorized access, disclosure, or alteration. However, no method of transmission over the Internet is 100% secure.</p>

      <h2 className="text-2xl font-semibold">5. Your Rights</h2>
      <p>You can:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>Access or correct your personal information.</li>
        <li>Request deletion of your personal data.</li>
        <li>Revoke consent to use Google OAuth at any time.</li>
      </ul>

      <h2 className="text-2xl font-semibold">6. Third-Party Services</h2>
      <p>Our app uses Google OAuth for authentication. Please review Google’s privacy policies regarding their services.</p>

      <h2 className="text-2xl font-semibold">7. Changes to This Policy</h2>
      <p>We may update this Privacy Policy. Changes will be posted with an updated effective date.</p>

      <h2 className="text-2xl font-semibold">Contact Us</h2>
      <p>
        If you have questions about this policy, email us at{" "}
        <a className="text-blue-600 underline" href="mailto:admin@lto.com">
          admin@lto.com
        </a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
