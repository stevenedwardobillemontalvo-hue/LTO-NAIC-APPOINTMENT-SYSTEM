import { useState, type ChangeEvent, type FormEvent } from "react";
import { registerUser, type RegisterFormData } from "../../services/auth";
import { useSnackbar } from "notistack";

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    type: "client",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    birthdate: "",
    contactNumber: "",
    ltmsNumber: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await registerUser(formData);

      enqueueSnackbar(res.message || "Registered successfully", { variant: "success" });

      setFormData({
        type: "client",
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        birthdate: "",
        contactNumber: "",
        ltmsNumber: "",
      });
      setConfirmPassword("");
    } catch (error: any) {
      enqueueSnackbar(error.message || "Registration failed", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-2 sm:p-1 md:p-2 rounded shadow-md w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl space-y-1 max-h-full"
      >
        <h1 className="text-xl font-bold text-start mb-2">Sign Up</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border px-2 py-1 text-sm rounded"
            required
          />
          <input
            type="text"
            name="middleName"
            placeholder="Middle Name (optional)"
            value={formData.middleName}
            onChange={handleChange}
            className="w-full border px-2 py-1 text-sm rounded"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border px-2 py-1 text-sm rounded"
            required
          />
          <input
            type="date"
            name="birthdate"
            placeholder="Birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            className="w-full border px-2 py-1 text-sm rounded"
            required
          />
          <div className="col-span-1 md:col-span-2">
            <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full border px-2 py-1 text-sm rounded"
            required
          />
          </div>
          <div className="col-span-1 md:col-span-2">
            <input
            type="text"
            name="ltmsNumber"
            placeholder="LTMS Number"
            value={formData.ltmsNumber}
            onChange={handleChange}
            className="w-full border px-2 py-1 text-sm rounded"
            required
          />
          </div>
          <div className="col-span-1 md:col-span-2">
            <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-2 py-1 text-sm rounded"
            required
          />
          </div>
          <div className="col-span-1 md:col-span-2">
            <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-2 py-1 text-sm rounded"
            required
          />
          </div>
          <div className="col-span-1 md:col-span-2">
            <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-2 py-1 text-sm rounded"
            required
          />
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-700 mt-4"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message && (
          <p
            className={`text-sm mt-2 text-center ${
              message.toLowerCase().includes("success") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
