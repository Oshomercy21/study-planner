import { useEffect, useMemo, useState } from "react";

const HOURS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const MINUTES = ["00", "15", "30", "45"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Planner() {
  const [courses, setCourses] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);
  const [semesterStart, setSemesterStart] = useState("");
  const [semesterEnd, setSemesterEnd] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedCourses = JSON.parse(localStorage.getItem("courses")) || [];
    const savedPlan = JSON.parse(localStorage.getItem("semesterStudyPlan")) || [];
    const savedSettings = JSON.parse(localStorage.getItem("semesterStudySettings")) || {};

    setCourses(savedCourses);
    setStudyPlan(savedPlan.map(normalizePlanItem));
    setSemesterStart(savedSettings.semesterStart || "");
    setSemesterEnd(savedSettings.semesterEnd || "");
  }, []);

  const totalStudyTime = useMemo(() => {
    const totalMinutes = studyPlan.reduce(
      (sum, item) => sum + getStudyDurationMinutes(item),
      0
    );

    return formatDuration(totalMinutes);
  }, [studyPlan]);

  function savePlan(plan) {
    setStudyPlan(plan);
    localStorage.setItem("semesterStudyPlan", JSON.stringify(plan));
  }

  function generateStudyPlan(e) {
    e.preventDefault();
    setMessage("");

    if (courses.length === 0) {
      setMessage("Please add your courses first before generating a study plan.");
      return;
    }

    if (!semesterStart || !semesterEnd) {
      setMessage("Please select semester start and end date.");
      return;
    }

    const sortedCourses = [...courses].sort(
      (a, b) => getPriorityWeight(b) - getPriorityWeight(a)
    );

    const plan = sortedCourses.map((course, index) => {
      const time = getSuggestedTime(index);

      return {
        id: course.id || `${course.courseCode}-${Date.now()}-${index}`,
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
        courseUnit: course.courseUnit,
        targetScore: course.targetScore,
        priority: getPriority(course),
        studyDay: getSuggestedDay(index),
        startHour: time.startHour,
        startMinute: time.startMinute,
        startPeriod: time.startPeriod,
        endHour: time.endHour,
        endMinute: time.endMinute,
        endPeriod: time.endPeriod,
        studyFocus: getStudyFocus(course),
      };
    });

    savePlan(plan);

    localStorage.setItem(
      "semesterStudySettings",
      JSON.stringify({ semesterStart, semesterEnd })
    );

    setMessage("Semester study plan generated successfully.");
  }

  function updatePlanItem(id, field, value) {
    const updatedPlan = studyPlan.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );

    savePlan(updatedPlan);
  }

  function clearPlan() {
    savePlan([]);
    localStorage.removeItem("semesterStudySettings");
    setMessage("Semester study plan cleared successfully.");
  }

  return (
    <div className="app-page">
      <div className="app-header">
        <h1>Study Planner</h1>
        <p>
          Plan your semester study schedule by choosing the day and time for each course.
          The timetable will use this plan to display a structured weekly schedule.
        </p>
      </div>

      {message && (
        <div
          className={`app-message ${
            message.toLowerCase().includes("success") ||
            message.toLowerCase().includes("cleared")
              ? "app-message-success"
              : "app-message-error"
          }`}
        >
          {message}
        </div>
      )}

      <div className="app-grid-2" style={{ marginBottom: "24px" }}>
        <div className="app-card">
          <h2 style={{ marginTop: 0, marginBottom: "18px" }}>
            Generate Semester Study Plan
          </h2>

          <form onSubmit={generateStudyPlan}>
            <div className="app-form-grid">
              <div className="app-form-group">
                <label>Semester Start Date</label>
                <input
                  type="date"
                  value={semesterStart}
                  onChange={(e) => setSemesterStart(e.target.value)}
                  required
                />
              </div>

              <div className="app-form-group">
                <label>Semester End Date</label>
                <input
                  type="date"
                  value={semesterEnd}
                  onChange={(e) => setSemesterEnd(e.target.value)}
                  required
                />
              </div>
            </div>

            <div
              style={{
                marginTop: "16px",
                background: "#f8fafc",
                borderRadius: "16px",
                padding: "16px",
                border: "1px solid #e2e8f0",
              }}
            >
              <p style={{ margin: 0, color: "#334155", lineHeight: "1.6" }}>
                The system will suggest a study plan from your registered courses.
                You can edit the day, time, priority, and study focus.
              </p>
            </div>

            <div className="app-actions">
              <button type="submit" className="app-btn">
                Generate Study Plan
              </button>

              <button type="button" className="app-btn-secondary" onClick={clearPlan}>
                Clear Plan
              </button>
            </div>
          </form>
        </div>

        <div className="app-card">
          <h2 style={{ marginTop: 0, marginBottom: "18px" }}>Plan Summary</h2>

          <div className="app-summary-grid">
            <div className="app-summary-item">
              <span>Total Courses</span>
              <strong>{courses.length}</strong>
            </div>

            <div className="app-summary-item">
              <span>Planned Courses</span>
              <strong>{studyPlan.length}</strong>
            </div>

            <div className="app-summary-item">
              <span>Total Weekly Study Time</span>
              <strong>{totalStudyTime}</strong>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: "18px", fontSize: "26px" }}>
          Semester Study Plan
        </h2>

        {studyPlan.length === 0 ? (
          <div className="app-empty">
            <p style={{ margin: 0 }}>No semester study plan generated yet.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "20px",
            }}
          >
            {studyPlan.map((item) => (
              <div className="app-card" key={item.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "flex-start",
                    marginBottom: "18px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 6px", fontSize: "22px" }}>
                      {item.courseCode}
                    </h3>
                    <p style={{ margin: 0, color: "#64748b" }}>
                      {item.courseTitle}
                    </p>
                  </div>

                  <PriorityBadge priority={item.priority} />
                </div>

                <div className="app-form-grid">
                  <div className="app-form-group">
                    <label>Priority</label>
                    <select
                      value={item.priority}
                      onChange={(e) =>
                        updatePlanItem(item.id, "priority", e.target.value)
                      }
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div className="app-form-group">
                    <label>Study Day</label>
                    <select
                      value={item.studyDay}
                      onChange={(e) =>
                        updatePlanItem(item.id, "studyDay", e.target.value)
                      }
                    >
                      {DAYS.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="app-form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Start Time</label>
                    <TimePicker
                      hour={item.startHour}
                      minute={item.startMinute}
                      period={item.startPeriod}
                      onHourChange={(value) =>
                        updatePlanItem(item.id, "startHour", value)
                      }
                      onMinuteChange={(value) =>
                        updatePlanItem(item.id, "startMinute", value)
                      }
                      onPeriodChange={(value) =>
                        updatePlanItem(item.id, "startPeriod", value)
                      }
                    />
                  </div>

                  <div className="app-form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>End Time</label>
                    <TimePicker
                      hour={item.endHour}
                      minute={item.endMinute}
                      period={item.endPeriod}
                      onHourChange={(value) =>
                        updatePlanItem(item.id, "endHour", value)
                      }
                      onMinuteChange={(value) =>
                        updatePlanItem(item.id, "endMinute", value)
                      }
                      onPeriodChange={(value) =>
                        updatePlanItem(item.id, "endPeriod", value)
                      }
                    />
                  </div>

                  <div className="app-form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Study Focus</label>
                    <input
                      value={item.studyFocus}
                      onChange={(e) =>
                        updatePlanItem(item.id, "studyFocus", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "16px",
                    padding: "16px",
                    marginTop: "16px",
                  }}
                >
                  <PlanRow label="Study Duration" value={calculateStudyHours(item)} />
                  <PlanRow label="Course Unit" value={item.courseUnit || "-"} />
                  <PlanRow
                    label="Target Score"
                    value={item.targetScore ? `${item.targetScore}/100` : "-"}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TimePicker({
  hour,
  minute,
  period,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
      <select value={hour} onChange={(e) => onHourChange(e.target.value)}>
        {HOURS.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      <select value={minute} onChange={(e) => onMinuteChange(e.target.value)}>
        {MINUTES.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      <select value={period} onChange={(e) => onPeriodChange(e.target.value)}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    High: { background: "#fee2e2", color: "#dc2626" },
    Medium: { background: "#dbeafe", color: "#1d4ed8" },
    Low: { background: "#dcfce7", color: "#16a34a" },
  };

  return (
    <span
      style={{
        padding: "8px 12px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: 700,
        ...(styles[priority] || styles.Medium),
      }}
    >
      {priority}
    </span>
  );
}

function PlanRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
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

function normalizePlanItem(item) {
  const defaultTime = {
    startHour: "6",
    startMinute: "00",
    startPeriod: "PM",
    endHour: "8",
    endMinute: "00",
    endPeriod: "PM",
  };

  return {
    ...item,
    priority: item.priority || "Medium",
    studyDay: item.studyDay || "Monday",
    startHour: item.startHour || defaultTime.startHour,
    startMinute: item.startMinute || defaultTime.startMinute,
    startPeriod: item.startPeriod || defaultTime.startPeriod,
    endHour: item.endHour || defaultTime.endHour,
    endMinute: item.endMinute || defaultTime.endMinute,
    endPeriod: item.endPeriod || defaultTime.endPeriod,
    studyFocus:
      item.studyFocus ||
      "Review lecture notes, summarize concepts, and revise steadily.",
  };
}

function getPriority(course) {
  const neededExamScore = Number(course.neededExamScore || 0);

  if (course.status === "Target Too High") return "High";
  if (neededExamScore >= 50) return "High";
  if (neededExamScore >= 30) return "Medium";
  return "Low";
}

function getPriorityWeight(course) {
  const priority = getPriority(course);
  if (priority === "High") return 3;
  if (priority === "Medium") return 2;
  return 1;
}

function getStudyFocus(course) {
  const priority = getPriority(course);

  if (priority === "High") {
    return "Revise key topics, solve practice questions, and prepare early.";
  }

  if (priority === "Medium") {
    return "Review lecture notes, summarize concepts, and revise steadily.";
  }

  return "Do light but consistent revision and reinforce understanding.";
}

function getSuggestedDay(index) {
  const suggestedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return suggestedDays[index % suggestedDays.length];
}

function getSuggestedTime(index) {
  const slots = [
    {
      startHour: "6",
      startMinute: "00",
      startPeriod: "PM",
      endHour: "8",
      endMinute: "00",
      endPeriod: "PM",
    },
    {
      startHour: "8",
      startMinute: "00",
      startPeriod: "PM",
      endHour: "10",
      endMinute: "00",
      endPeriod: "PM",
    },
    {
      startHour: "10",
      startMinute: "00",
      startPeriod: "AM",
      endHour: "12",
      endMinute: "00",
      endPeriod: "PM",
    },
    {
      startHour: "2",
      startMinute: "00",
      startPeriod: "PM",
      endHour: "4",
      endMinute: "00",
      endPeriod: "PM",
    },
    {
      startHour: "4",
      startMinute: "00",
      startPeriod: "PM",
      endHour: "6",
      endMinute: "00",
      endPeriod: "PM",
    },
  ];

  return slots[index % slots.length];
}

function convertTimeToMinutes(hour, minute, period) {
  let h = Number(hour);
  const m = Number(minute);

  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;

  return h * 60 + m;
}

function getStudyDurationMinutes(item) {
  const start = convertTimeToMinutes(
    item.startHour,
    item.startMinute,
    item.startPeriod
  );

  let end = convertTimeToMinutes(item.endHour, item.endMinute, item.endPeriod);

  if (end <= start) {
    end += 24 * 60;
  }

  return end - start;
}

function calculateStudyHours(item) {
  return formatDuration(getStudyDurationMinutes(item));
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