import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function GoogleRedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const google = searchParams.get("google");
    if (google === "success") {
      alert("✅ Google Calendar connected successfully!");

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id;

      navigate(`/dashboard/${userId}/appointment`);
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Processing Google Calendar connection...</p>
    </div>
  );
}
