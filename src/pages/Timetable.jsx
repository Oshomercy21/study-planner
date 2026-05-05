import { useEffect, useMemo, useState } from "react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function Timetable() {
  const [studyPlan, setStudyPlan] = useState([]);

  useEffect(() => {
    const savedPlan = localStorage.getItem("semesterStudyPlan");

    if (savedPlan) {
      setStudyPlan(JSON.parse(savedPlan));
    }
  }, []);

  const groupedPlan = useMemo(() => {
    const grouped = {};

    DAYS.forEach((day) => {
      grouped[day] = [];
    });

    studyPlan.forEach((item) => {
      const day = item.studyDay || item.day || "Monday";

      if (!grouped[day]) {
        grouped[day] = [];
      }

      grouped[day].push(item);
    });

    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => {
        return getTimeValue(a) - getTimeValue(b);
      });
    });

    return grouped;
  }, [studyPlan]);

  const totalCourses = studyPlan.length;
  const totalStudyTime = studyPlan.reduce(
    (sum, item) => sum + getDurationMinutes(item),
    0
  );

  return (
    <div className="app-page">
      <div className="app-header">
        <h1>Study Timetable</h1>
        <p>
          This timetable is generated from your Study Planner. To change the day
          or time for a course, edit it from the Study Planner page.
        </p>
      </div>

      <div className="app-grid-2" style={{ marginBottom: "24px" }}>
        <div className="app-card">
          <h2 style={{ marginTop: 0, marginBottom: "18px" }}>
            Weekly Study Timetable
          </h2>

          {studyPlan.length === 0 ? (
            <div className="app-empty">
              <p style={{ margin: 0 }}>
                No study plan found. Please generate your study plan first.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "850px",
                }}
              >
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={thStyle}>Day</th>
                    <th style={thStyle}>Time</th>
                    <th style={thStyle}>Course</th>
                    <th style={thStyle}>Study Focus</th>
                    <th style={thStyle}>Priority</th>
                    <th style={thStyle}>Duration</th>
                  </tr>
                </thead>

                <tbody>
                  {DAYS.map((day) =>
                    groupedPlan[day].length === 0 ? (
                      <tr key={day}>
                        <td style={tdStyle}>{day}</td>
                        <td style={tdStyle} colSpan="5">
                          No study session planned.
                        </td>
                      </tr>
                    ) : (
                      groupedPlan[day].map((item, index) => (
                        <tr key={`${day}-${item.id || index}`}>
                          {index === 0 && (
                            <td
                              style={tdStyle}
                              rowSpan={groupedPlan[day].length}
                            >
                              <strong>{day}</strong>
                            </td>
                          )}

                          <td style={tdStyle}>
                            {formatTime(item, "start")} -{" "}
                            {formatTime(item, "end")}
                          </td>

                          <td style={tdStyle}>
                            <strong>{item.courseCode}</strong>
                            <br />
                            <span style={{ color: "#64748b" }}>
                              {item.courseTitle}
                            </span>
                          </td>

                          <td style={tdStyle}>{item.studyFocus || "Revision"}</td>

                          <td style={tdStyle}>
                            <PriorityBadge priority={item.priority} />
                          </td>

                          <td style={tdStyle}>
                            {formatDuration(getDurationMinutes(item))}
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="app-card">
          <h2 style={{ marginTop: 0, marginBottom: "18px" }}>Quick Summary</h2>

          <div className="app-summary-grid">
            <div className="app-summary-item">
              <span>Planned Courses</span>
              <strong>{totalCourses}</strong>
            </div>

            <div className="app-summary-item">
              <span>Total Study Time</span>
              <strong>{formatDuration(totalStudyTime)}</strong>
            </div>

            <div className="app-summary-item">
              <span>Study Days Used</span>
              <strong>
                {
                  DAYS.filter((day) => groupedPlan[day]?.length > 0).length
                }
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "14px",
  textAlign: "left",
  borderBottom: "1px solid #e2e8f0",
  color: "#0f172a",
  fontWeight: 800,
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #e2e8f0",
  verticalAlign: "top",
  color: "#334155",
};

function PriorityBadge({ priority }) {
  const style =
    priority === "High"
      ? { background: "#fee2e2", color: "#dc2626" }
      : priority === "Low"
      ? { background: "#dcfce7", color: "#16a34a" }
      : { background: "#dbeafe", color: "#2563eb" };

  return (
    <span
      style={{
        padding: "7px 12px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: 800,
        ...style,
      }}
    >
      {priority || "Medium"}
    </span>
  );
}

function formatTime(item, type) {
  const hour = item[`${type}Hour`] || "6";
  const minute = item[`${type}Minute`] || "00";
  const period = item[`${type}Period`] || "PM";

  return `${hour}:${minute} ${period}`;
}

function getTimeValue(item) {
  return convertToMinutes(
    item.startHour || "6",
    item.startMinute || "00",
    item.startPeriod || "PM"
  );
}

function getDurationMinutes(item) {
  const start = convertToMinutes(
    item.startHour || "6",
    item.startMinute || "00",
    item.startPeriod || "PM"
  );

  let end = convertToMinutes(
    item.endHour || "8",
    item.endMinute || "00",
    item.endPeriod || "PM"
  );

  if (end <= start) {
    end += 24 * 60;
  }

  return end - start;
}

function convertToMinutes(hour, minute, period) {
  let h = Number(hour);
  const m = Number(minute);

  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;

  return h * 60 + m;
}

function formatDuration(totalMinutes) {
  if (!totalMinutes || totalMinutes <= 0) return "0 min";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} min`;
  }

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  return `${minutes} min`;
}