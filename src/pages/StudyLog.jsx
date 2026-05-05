import { useEffect, useMemo, useState } from "react";

export default function StudyLog() {
  const [courses, setCourses] = useState([]);
  const [logs, setLogs] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedCourses = localStorage.getItem("courses");
    const savedLogs = localStorage.getItem("studyLogs");

    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }

    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  function saveLogs(updatedLogs) {
    setLogs(updatedLogs);
    localStorage.setItem("studyLogs", JSON.stringify(updatedLogs));
  }

  function handleAddLog(e) {
    e.preventDefault();
    setMessage("");

    if (!selectedCourse || !topic || !date || !clockIn || !clockOut) {
      setMessage("Please fill all required fields.");
      return;
    }

    const durationMinutes = calculateDuration(clockIn, clockOut);

    if (durationMinutes <= 0) {
      setMessage("Clock out time must be later than clock in time.");
      return;
    }

    const newLog = {
      id: Date.now(),
      selectedCourse,
      topic,
      date,
      clockIn,
      clockOut,
      durationMinutes,
      note,
    };

    const updatedLogs = [...logs, newLog];
    saveLogs(updatedLogs);

    setSelectedCourse("");
    setTopic("");
    setDate("");
    setClockIn("");
    setClockOut("");
    setNote("");
    setMessage("Study log added successfully.");
  }

  function handleDeleteLog(id) {
    const updatedLogs = logs.filter((log) => log.id !== id);
    saveLogs(updatedLogs);
    setMessage("Log deleted successfully.");
  }

  const totalStudyMinutes = useMemo(() => {
    return logs.reduce((sum, log) => sum + Number(log.durationMinutes || 0), 0);
  }, [logs]);

  return (
    <div className="app-page">
      <div className="app-header">
        <h1>Study Log</h1>
        <p>
          Record your actual study sessions using clock in and clock out. This
          helps track consistency and compare planned study with real study effort.
        </p>
      </div>

      {message && (
        <div
          className={`app-message ${
            message.toLowerCase().includes("success")
              ? "app-message-success"
              : "app-message-error"
          }`}
        >
          {message}
        </div>
      )}

      <div className="app-grid-2" style={{ marginBottom: "24px" }}>
        <div className="app-card">
          <h2 style={{ marginTop: 0, marginBottom: "18px" }}>Add Study Log</h2>

          <form onSubmit={handleAddLog}>
            <div className="app-form-grid">
              <div className="app-form-group">
                <label>Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
                >
                  <option value="">Select course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.courseCode}>
                      {course.courseCode} - {course.courseTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="app-form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="app-form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Topic / Task Studied</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Chapter 3 revision, past questions"
                  required
                />
              </div>

              <div className="app-form-group">
                <label>Clock In</label>
                <input
                  type="time"
                  value={clockIn}
                  onChange={(e) => setClockIn(e.target.value)}
                  required
                />
              </div>

              <div className="app-form-group">
                <label>Clock Out</label>
                <input
                  type="time"
                  value={clockOut}
                  onChange={(e) => setClockOut(e.target.value)}
                  required
                />
              </div>

              <div className="app-form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Note (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="How was the study session?"
                  rows="4"
                />
              </div>
            </div>

            <div className="app-actions">
              <button type="submit" className="app-btn">
                Add Log
              </button>
            </div>
          </form>
        </div>

        <div className="app-card">
          <h2 style={{ marginTop: 0, marginBottom: "18px" }}>Summary</h2>

          <div className="app-summary-grid">
            <div className="app-summary-item">
              <span>Total Logs</span>
              <strong>{logs.length}</strong>
            </div>

            <div className="app-summary-item">
              <span>Total Study Time</span>
              <strong>{formatDuration(totalStudyMinutes)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: "18px", fontSize: "26px" }}>Study History</h2>

        {logs.length === 0 ? (
          <div className="app-empty">
            <p style={{ margin: 0 }}>No study logs yet.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {logs.map((log) => (
              <div className="app-card" key={log.id}>
                <h3 style={{ margin: "0 0 8px" }}>{log.selectedCourse}</h3>

                <p style={{ margin: "0 0 6px", color: "#334155" }}>{log.topic}</p>

                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "16px",
                    padding: "16px",
                    margin: "12px 0",
                  }}
                >
                  <StudyLogRow label="Date" value={log.date} />
                  <StudyLogRow label="Clock In" value={formatTime(log.clockIn)} />
                  <StudyLogRow label="Clock Out" value={formatTime(log.clockOut)} />
                  <StudyLogRow
                    label="Duration"
                    value={formatDuration(log.durationMinutes)}
                  />
                </div>

                {log.note && (
                  <p style={{ color: "#475569", marginBottom: "12px" }}>{log.note}</p>
                )}

                <button
                  className="app-btn-danger"
                  onClick={() => handleDeleteLog(log.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function calculateDuration(clockIn, clockOut) {
  const start = timeToMinutes(clockIn);
  const end = timeToMinutes(clockOut);
  return end - start;
}

function timeToMinutes(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(value) {
  const [hoursStr, minutesStr] = value.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} hr ${minutes} min`;
  }

  if (hours > 0) {
    return `${hours} hr`;
  }

  return `${minutes} min`;
}

function StudyLogRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        color: "#334155",
        fontSize: "15px",
      }}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}