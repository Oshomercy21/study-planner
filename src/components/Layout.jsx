import { NavLink, Outlet } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  display: "block",
  padding: "10px 14px",
  borderRadius: 10,
  color: "white",
  textDecoration: "none",
  background: isActive ? "#2563eb" : "transparent",
  marginBottom: 8,
});

export default function Layout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fb" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 250,
          background: "#071225",
          color: "white",
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Study Planner</h2>
          <p style={{ margin: "6px 0 0", opacity: 0.75, fontSize: 13 }}>
            and Grade Forecaster
          </p>
        </div>

        <nav style={{ marginTop: 10 }}>
          <NavLink to="/dashboard" style={linkStyle}>Welcome</NavLink>
          <NavLink to="/profile" style={linkStyle}>Student Profile</NavLink>
          <NavLink to="/courses" style={linkStyle}>Courses & Assessment</NavLink>
          <NavLink to="/planner" style={linkStyle}>Study Planner</NavLink>
          <NavLink to="/timetable" style={linkStyle}>Timetable & Reminder</NavLink>
          <NavLink to="/studylog" style={linkStyle}>Study Log</NavLink>
          <NavLink to="/forecast" style={linkStyle}>Grade Forecast</NavLink>
          <NavLink to="/settings" style={linkStyle}>Settings</NavLink>
        </nav>

        <div style={{ marginTop: "auto", fontSize: 12, opacity: 0.7 }}>
          © {new Date().getFullYear()} Osho
        </div>
      </aside>

      {/* Page Content */}
      <main style={{ flex: 1, padding: 28 }}>
        <Outlet />
      </main>
    </div>
  );
}