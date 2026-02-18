import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { AUTH_MESSAGES } from "./schema/authSchema";


interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPanel() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  // const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // setError("");

    try {
      const { data } = await axios.post(
        "https://lto-naic-appointment-server.onrender.com/auth/login",
        form,
        { withCredentials: true }
      );

      if (data.success) {
        localStorage.setItem("token", data.user.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        enqueueSnackbar(AUTH_MESSAGES.LOGIN.SUCCESS, { variant: "success" });

        navigate(`/dashboard/${data.user.id}`);
      }
      else {
        enqueueSnackbar(AUTH_MESSAGES.LOGIN.FAILED, { variant: "error" });
      }
    } catch (err: any) {
        enqueueSnackbar(
        err.response?.data?.message || AUTH_MESSAGES.LOGIN.FAILED,
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

    const handleForgotPassword = async () => {

      if (!resetEmail) {
      enqueueSnackbar("Please enter your email.", { variant: "warning" });
      return;
    }

    setResetLoading(true);
    try {
      const { data } = await axios.post(
        "https://lto-naic-appointment-server.onrender.com/auth/forgot-password",
        { email: resetEmail }
      );
      enqueueSnackbar(data.message || AUTH_MESSAGES.FORGOT_PASSWORD.SUCCESS, {
        variant: "success",
      });

      setShowModal(false);
      setResetEmail("");
    } catch (err: any) {
      enqueueSnackbar(
        err.response?.data?.message || AUTH_MESSAGES.FORGOT_PASSWORD.FAILED,
        { variant: "error" }
      );
    } finally {
      setResetLoading(false);
    }
  };
  //     setResetMessage(data.message);
  //   } catch (err: any) {
  //     setResetMessage(err.response?.data?.message || "Failed to send reset email");
  //   } finally {
  //     setResetLoading(false);
  //   }
  // };


  return (
  <>
    <form onSubmit={handleSubmit} className="rounded w-full max-w-4xl mx-auto">
      <h2 className="text-xl md:text-xl font-bold text-start">Sign In</h2>

    <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-start justify-start">
      <input
        type="email"
        placeholder="Email"
        name="email"
        className="w-full md:flex-1 border border-gray-300 text-sm rounded px-2 py-1"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        placeholder="Password"
        name="password"
        className="w-full md:flex-1 border border-gray-300 text-sm rounded px-2 py-1"
        value={form.password}
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-auto bg-gray-900 text-white px-6 py-1 rounded hover:bg-gray-700 whitespace-nowrap"
      >
        {loading ? "Signing in..." : "Login"}
      </button>
    </div>
  
        <p
          className="text-sm text-blue-500 mt-2 cursor-pointer hover:underline"
          onClick={() => setShowModal(true)}
        >
          Forgot Password?
        </p>

      {/* {error && <p className="text-center mt-4 text-red-500">{error}</p>} */}
    </form>
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-md flex items-center justify-center z-50">

          <div className="bg-white rounded p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Reset Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-2 rounded mb-4"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <button
              onClick={handleForgotPassword}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
              disabled={resetLoading}
            >
              {resetLoading ? "Sending..." : "Send Reset Email"}
            </button>
            {/* {resetMessage && (
              <p className="mt-3 text-sm text-green-600">{resetMessage}</p>
            )} */}
          </div>
        </div>
      )}
    </>

  );
}
