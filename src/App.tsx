import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, GuestRoute } from "./route/AuthRoutes"
import { useEffect } from "react";
import { checkTokenAndLogout } from "../src/utils/auth"

import Home from "./pages/auth";
import Dashboard from "./pages/dashboard";

import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import AdminAppointments from "./pages/dashboard/admin/appointment/AdminAppointments";
import ViewAppointmentWrapper from "./pages/dashboard/admin/appointment/ViewAppointmentWrapper";
import AdminApplicants from "./pages/dashboard/admin/AdminApplicants";
import AdminCalendar from "./pages/dashboard/admin/AdminCalendar";
import Admin from "./pages/dashboard/admin/Admin";

import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ClientDashboard from "./pages/dashboard/client/ClientDashboard";
import Appointment from "./pages/dashboard/client/Appointment/Appointment";
import MyAppointments from "./pages/dashboard/client/myAppointment/myAppointments";

import ConfirmationPage from "./pages/ConfirmationPage";
import Confirmation from "./pages/Confirmation";

import GoogleRedirectHandler from "./pages/dashboard/client/GoogleRedirectHandler";

export default function App() {
    useEffect(() => {
    const interval = setInterval(() => {
      checkTokenAndLogout(); 
    }, 3 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Routes>
     
      <Route
        path="/"
        element={
          <GuestRoute>
            <Home />
          </GuestRoute>
        }
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/dashboard/:id"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
    
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="appointments/:appointmentId" element={<ViewAppointmentWrapper />} />
        <Route path="applicants" element={<AdminApplicants />} />
        <Route path="calendar" element={<AdminCalendar />} />
        <Route path="manage-admins" element={<Admin />} />
   
        <Route path="appointment" element={<Appointment />} />
        <Route path="my-appointments" element={<MyAppointments />} />
        

      </Route>


      <Route path="/confirmation/:id" element={<ConfirmationPage />} />
      <Route path="/appointments" element={<GoogleRedirectHandler />} />
    </Routes>
  );
}
