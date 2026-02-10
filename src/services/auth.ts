import axios from "axios";

export interface RegisterFormData {
  type: "client" | "admin";
  adminType?: "admin" | "superadmin";
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  password: string;
  birthdate?: string;
  contactNumber?: string;
  ltmsNumber?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

const BASE_URL = "https://lto-naic-appointment-server.onrender.com";

export const registerUser = async (formData: RegisterFormData): Promise<ApiResponse> => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Network error" }));
    throw new Error(errorData.message || "Registration failed");
  }

  return res.json();
};

export const loginUser = async (
  email: string,
  password: string
): Promise<ApiResponse> => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password}), 
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Network error" }));
    throw new Error(errorData.message || "Login failed");
  }

  return res.json();
};
interface VerifyResponse {
  success: boolean;
  message: string;
}

export const verifyEmail = async (token: string): Promise<VerifyResponse> => {
  const { data } = await axios.get(`${BASE_URL}/verify-email`, {
    params: { token },
  });
  return data;
};