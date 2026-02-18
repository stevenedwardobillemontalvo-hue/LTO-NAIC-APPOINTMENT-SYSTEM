import { useState, type ChangeEvent, type FormEvent } from "react";
import { registerUser, type RegisterFormData } from "../../services/auth";
import { useSnackbar } from "notistack";
import LTMSNumberTooltip from "./Tooltip";
import { AUTH_MESSAGES } from "./schema/authSchema";
import { FaEye, FaEyeSlash } from "react-icons/fa";


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
  // const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [birthdateFocused, setBirthdateFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const { enqueueSnackbar } = useSnackbar();

  const formatLTMSNumber = (input: string) => {

  const digits = input.replace(/\D/g, "");
  const part1 = digits.slice(0, 2);
  const part2 = digits.slice(2, 8);
  const part3 = digits.slice(8); 

  let formatted = part1;

  if (digits.length > 2) formatted += "-" + part2;
  if (digits.length > 8) formatted += "-" + part3;

  return formatted.slice(0, 20);
};

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

     if (name === "ltmsNumber") {
    const formatted = formatLTMSNumber(value);
    setFormData(prev => ({ ...prev, ltmsNumber: formatted }));
    return;
  }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isValidLTMSNumber = (value?: string) => {
  if (!value) return false;

  if (!/^[0-9-]+$/.test(value)) return false;

  const digitsOnly = value.replace(/-/g, "");
  if (digitsOnly.length < 13 || digitsOnly.length > 15) return false;

  const formatRegex = /^\d{2}-\d{6}-\d{7}$/;
  return formatRegex.test(value);
};


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const requiredFields = ["firstName", "lastName", "birthdate", "contactNumber", "ltmsNumber", "email", "password", "confirmPassword"];
    const newErrors: { [key: string]: boolean } = {};

    requiredFields.forEach(field => {
    if (!formData[field as keyof RegisterFormData] && field !== "confirmPassword") {
      newErrors[field] = true;
    }
  });

  
    if (!confirmPassword) newErrors.confirmPassword = true;

    setErrors(newErrors);

     if (Object.keys(newErrors).length > 0) {
    enqueueSnackbar("Please fill out the required field(s)", { variant: "error" });
    return;
  }

    if (formData.password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

     if (!isValidLTMSNumber(formData.ltmsNumber)) {
    enqueueSnackbar(AUTH_MESSAGES.REGISTER.INVALID_LTMS, { variant: "error" });
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
      setErrors({});
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
            // className="w-full border px-2 py-1 text-sm rounded"
            className={`w-full border px-2 py-1 text-sm rounded ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
          
          />
          <input
            type="text"
            name="middleName"
            placeholder="Middle Name (optional)"
            value={formData.middleName}
            onChange={handleChange}
            className="w-full border border-gray-300 px-2 py-1 text-sm rounded"
            // className={`w-full border px-2 py-1 text-sm rounded ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            // className="w-full border px-2 py-1 text-sm rounded"
            className={`w-full border px-2 py-1 text-sm rounded ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
          />
          <input
            // type="date"
            type={birthdateFocused ? "date" : "text"}
            name="birthdate"
            placeholder="Birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            onFocus={() => setBirthdateFocused(true)}
            onBlur={() => {
                if (!formData.birthdate) setBirthdateFocused(false);
              }}
            // className="w-full border px-2 py-1 text-sm rounded"
            className={`w-full border px-2 py-1 text-sm rounded ${errors.birthdate ? "border-red-500" : "border-gray-300"}`}
        
          />
          <div className="col-span-1 md:col-span-2">
            <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            // className="w-full border px-2 py-1 text-sm rounded"
            className={`w-full border px-2 py-1 text-sm rounded ${errors.contactNumber ? "border-red-500" : "border-gray-300"}`}
           
          />
          </div>
          <div className="col-span-1 md:col-span-2">
            <div className="relative w-full">
            <input
            type="text"
            name="ltmsNumber"
            placeholder="LTMS Number"
            value={formData.ltmsNumber}
            onChange={handleChange}
            // className="w-full border px-2 py-1 text-sm rounded"
            className={`w-full border px-2 py-1 text-sm rounded ${errors.ltmsNumber ? "border-red-500" : "border-gray-300"}`}
            maxLength={20}
          />
          <LTMSNumberTooltip />
          </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            // className="w-full border px-2 py-1 text-sm rounded"
            className={`w-full border px-2 py-1 text-sm rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
        
          />
          </div>
          <div className="relative col-span-1 md:col-span-2">
            <input
            // type="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            // className="w-full border px-2 py-1 text-sm rounded pr-10"
            className={`w-full border px-2 py-1 text-sm rounded pr-10 ${errors.password ? "border-red-500" : "border-gray-300"}`}
          
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
             {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
          </div>
          <div className="relative col-span-1 md:col-span-2">
            <input
            // type="password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            // className="w-full border px-2 py-1 text-sm rounded pr-10"
            className={`w-full border px-2 py-1 text-sm rounded pr-10 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
          />
           <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
               {showConfirmPassword ? <FaEye /> : <FaEyeSlash /> }
            </button>
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

        {/* {message && (
          <p
            className={`text-sm mt-2 text-center ${
              message.toLowerCase().includes("success") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )} */}
      </form>
    </div>
  );
}
