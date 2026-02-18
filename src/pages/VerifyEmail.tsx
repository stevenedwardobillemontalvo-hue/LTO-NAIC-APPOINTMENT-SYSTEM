import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/auth";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message || "Email verified successfully!");
        setTimeout(() => navigate("/"), 3000);
      })
      .catch((err: any) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed or token expired.");
      });
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        {status === "loading" && <h2> Verifying your email...</h2>}
        {status === "success" && (
          <>
            <h2>Email Verified</h2>
            <p>{message}</p>
            <p>Redirecting to homepage...</p>
          </>
        )}
        {status === "error" && (
          <>
            <h2>Verification Failed</h2>
            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;