import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Confirmation = () => {
  const [status, setStatus] = useState("Redirecting...");
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("No token provided");
      setStatus("");
      return;
    }

    window.location.href = `https://lto-naic-appointment-server.onrender.com/auth/confirmation?token=${token}`;
  }, [searchParams]);

  return (
    <div className="confirmation-page">
      <h1>Appointment Confirmation</h1>
      {status && <p>{status}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Confirmation;