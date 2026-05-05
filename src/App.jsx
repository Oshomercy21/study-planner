import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { startReminderSystem } from "./utils/reminder";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Profile from "./pages/Profile";
import Planner from "./pages/Planner";
import Timetable from "./pages/Timetable";
import StudyLog from "./pages/StudyLog";
import Forecast from "./pages/Forecast";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
useEffect(() => {
  const savedTheme = localStorage.getItem("appTheme") || "light";
  const savedColor = localStorage.getItem("themeColor") || "#334155";

  document.documentElement.setAttribute("data-theme", savedTheme);
  document.documentElement.style.setProperty("--theme-color", savedColor);

  startReminderSystem();
}, []);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses" element={<Courses />} />

        <Route path="/planner" element={<Planner />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/studylog" element={<StudyLog />} />
        <Route path="/study-log" element={<StudyLog />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
