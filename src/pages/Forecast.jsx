import { useEffect, useMemo, useState } from "react";

export default function Forecast() {
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const savedProfile = localStorage.getItem("studentProfile");
    const savedCourses = localStorage.getItem("courses");
    const savedTasks = localStorage.getItem("studyTasks");
    const savedLogs = localStorage.getItem("studyLogs");
    const savedTimetable =
      localStorage.getItem("semesterStudyPlan") ||
      localStorage.getItem("studyTimetable");

    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedTimetable) setTimetable(JSON.parse(savedTimetable));
  }, []);

  const onTrackCourses = useMemo(
    () =>
      courses.filter(
        (course) =>
          course.status === "On Track" || course.status === "Target Reached"
      ),
    [courses]
  );

  const riskyCourses = useMemo(
    () => courses.filter((course) => course.status === "Target Too High"),
    [courses]
  );

  const totalUnits = useMemo(
    () =>
      courses.reduce((sum, course) => sum + Number(course.courseUnit || 0), 0),
    [courses]
  );

  const averageTargetScore = useMemo(() => {
    if (courses.length === 0) return "0.0";
    const total = courses.reduce(
      (sum, course) => sum + Number(course.targetScore || 0),
      0
    );
    return (total / courses.length).toFixed(1);
  }, [courses]);

  const averageNeededExam = useMemo(() => {
    if (courses.length === 0) return "0.0";
    const total = courses.reduce(
      (sum, course) => sum + Math.max(0, Number(course.neededExamScore || 0)),
      0
    );
    return (total / courses.length).toFixed(1);
  }, [courses]);

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const totalStudyMinutes = useMemo(
    () => logs.reduce((sum, log) => sum + Number(log.durationMinutes || 0), 0),
    [logs]
  );

  const studyConsistency = useMemo(() => {
    if (logs.length === 0) return "No study log yet";
    if (totalStudyMinutes >= 600) return "Strong";
    if (totalStudyMinutes >= 300) return "Moderate";
    return "Low";
  }, [logs, totalStudyMinutes]);

  const overallOutlook = useMemo(() => {
    if (courses.length === 0) {
      return {
        title: "Insufficient data",
        text: "Add your courses and targets first so the system can generate a meaningful forecast.",
        color: "#64748b",
        bg: "#f8fafc",
      };
    }

    if (riskyCourses.length === 0 && totalStudyMinutes >= 300) {
      return {
        title: "Positive outlook",
        text: "Your course targets currently look realistic, and your study activity supports steady progress.",
        color: "#16a34a",
        bg: "#dcfce7",
      };
    }

    if (riskyCourses.length <= 2) {
      return {
        title: "Needs attention",
        text: "A few courses need stronger focus. Prioritize courses with higher needed exam scores and keep logging study sessions.",
        color: "#d97706",
        bg: "#fef3c7",
      };
    }

    return {
      title: "At risk",
      text: "Several courses are demanding high exam scores. Increase study effort, review targets, and focus on difficult courses first.",
      color: "#140c0c",
      bg: "#f30202",
    };
  }, [courses, riskyCourses, totalStudyMinutes]);

  const focusCourses = useMemo(() => {
    return [...courses]
      .sort(
        (a, b) =>
          Number(b.neededExamScore || 0) - Number(a.neededExamScore || 0)
      )
      .slice(0, 3);
  }, [courses]);

  return (
    <div className="app-page">
      <div className="app-header">
        <h1>Grade Forecast</h1>
        <p>
          This page combines your course targets, current progress, study plan,
          timetable, and study log to give a realistic academic outlook.
        </p>
      </div>

      <div className="app-grid-2" style={{ marginBottom: "24px" }}>
        <div className="app-card">
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Student Summary</h2>

          {!profile ? (
            <div className="app-empty">
              <p style={{ margin: 0 }}>
                Your profile is not available yet. Complete your student profile
                first.
              </p>
            </div>
          ) : (
            <div className="app-summary-grid">
              <SummaryItem label="Name" value={profile.name || "-"} />
              <SummaryItem label="Department" value={profile.department || "-"} />
              <SummaryItem label="Level" value={profile.level || "-"} />
              <SummaryItem label="Semester" value={profile.semester || "-"} />
              <SummaryItem label="Current CGPA" value={profile.currentCGPA || "-"} />
              <SummaryItem label="Target GPA" value={profile.targetGPA || "-"} />
            </div>
          )}
        </div>

        <div className="app-card">
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Overall Outlook</h2>

          <div
            style={{
              background: overallOutlook.bg,
              borderRadius: "18px",
              padding: "20px",
              border: `1px solid ${overallOutlook.color}22`,
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: "10px",
                color: overallOutlook.color,
                fontSize: "22px",
              }}
            >
              {overallOutlook.title}
            </h3>
            <p style={{ margin: 0, color: "#334155", lineHeight: "1.7" }}>
              {overallOutlook.text}
            </p>
          </div>
        </div>
      </div>

      <div className="app-grid-2" style={{ marginBottom: "24px" }}>
        <div className="app-card">
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Forecast Summary</h2>

          <div className="app-summary-grid">
            <SummaryItem label="Total Courses" value={courses.length} />
            <SummaryItem label="Total Units" value={totalUnits} />
            <SummaryItem label="On Track" value={onTrackCourses.length} />
            <SummaryItem label="High Risk" value={riskyCourses.length} />
            <SummaryItem label="Average Target Score" value={averageTargetScore} />
            <SummaryItem label="Average Needed Exam" value={averageNeededExam} />
          </div>
        </div>

        <div className="app-card">
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Recommended Focus</h2>

          {focusCourses.length === 0 ? (
            <div className="app-empty">
              <p style={{ margin: 0 }}>No course data available yet.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {focusCourses.map((course) => (
                <div
                  key={course.id}
                  style={{
                    background: "#f8fafc",
                    borderRadius: "16px",
                    padding: "16px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: "6px" }}>
                    {course.courseCode} - {course.courseTitle}
                  </div>

                  <div style={{ color: "#64748b", marginBottom: "6px" }}>
                    Needed in exam:{" "}
                    {course.neededExamScore <= 0
                      ? "0/70"
                      : `${course.neededExamScore}/70`}
                  </div>

                  <div
                    style={{
                      fontWeight: 800,
                      color:
                        course.status === "Target Too High"
                          ? "#dc2626"
                          : course.status === "Target Reached"
                          ? "#16a34a"
                          : "#2563eb",
                    }}
                  >
                    {course.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="app-card" style={{ marginBottom: "24px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Course Progress Chart</h2>

        {courses.length === 0 ? (
          <div className="app-empty">
            <p style={{ margin: 0 }}>No course progress available yet.</p>
          </div>
        ) : (
          <div className="forecast-chart">
            {courses.map((course) => {
              const current = Math.min(100, Number(course.currentTotal || 0));
              const target = Math.min(100, Number(course.targetScore || 0));
              const needed = Math.min(
                100,
                Math.max(0, Number(course.neededExamScore || 0))
              );

              return (
                <div className="chart-row" key={course.id}>
                  <div className="chart-label">
                    <strong>{course.courseCode}</strong>
                    <span>{course.courseTitle}</span>
                  </div>

                  <div className="chart-bars">
                    <ChartBar label="Current" value={current} className="current" />
                    <ChartBar label="Target" value={target} className="target" />
                    <ChartBar label="Needed Exam" value={needed} className="needed" />
                  </div>

                  <div className="chart-score">
                    <strong>{course.currentTotal || 0}</strong> /{" "}
                    {course.targetScore || 0}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="app-grid-2" style={{ marginBottom: "24px" }}>
        <div className="app-card">
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Study Activity</h2>

          <div className="app-summary-grid">
            <SummaryItem label="Planner Tasks" value={tasks.length} />
            <SummaryItem label="Completed Tasks" value={completedTasks} />
            <SummaryItem label="Timetable Sessions" value={timetable.length} />
            <SummaryItem label="Study Logs" value={logs.length} />
            <SummaryItem
              label="Total Study Time"
              value={formatDuration(totalStudyMinutes)}
            />
            <SummaryItem label="Study Consistency" value={studyConsistency} />
          </div>
        </div>

        <div className="app-card">
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Legend</h2>

          <div style={{ display: "grid", gap: "12px" }}>
            <Legend color="#2563eb" label="Current score/CA completed so far" />
            <Legend color="#16a34a" label="Target score set by the student" />
            <Legend color="#f59e0b" label="Score still needed in exam" />
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: "18px", fontSize: "26px" }}>
          Course Breakdown
        </h2>

        {courses.length === 0 ? (
          <div className="app-empty">
            <p style={{ margin: 0 }}>
              No courses found. Add your courses and update your CA scores first.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {courses.map((course) => (
              <div className="app-card" key={course.id}>
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
                    <h3 style={{ margin: "0 0 6px", fontSize: "24px" }}>
                      {course.courseCode}
                    </h3>
                    <p style={{ margin: 0, color: "#64748b" }}>
                      {course.courseTitle}
                    </p>
                  </div>

                  <StatusBadge status={course.status} />
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "16px",
                    padding: "16px",
                  }}
                >
                  <ForecastRow label="Course Unit" value={course.courseUnit || "-"} />
                  <ForecastRow
                    label="Target Score"
                    value={`${course.targetScore || 0}/100`}
                  />
                  <ForecastRow
                    label="CA Score"
                    value={
                      course.caScore != null ? `${course.caScore}/30` : "Not added"
                    }
                  />
                  <ForecastRow
                    label="Needed in Exam"
                    value={
                      course.neededExamScore <= 0
                        ? "0/70"
                        : `${course.neededExamScore}/70`
                    }
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

function SummaryItem({ label, value }) {
  return (
    <div className="app-summary-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ChartBar({ label, value, className }) {
  return (
    <div style={{ marginBottom: "8px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          color: "#64748b",
          marginBottom: "4px",
        }}
      >
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="chart-track">
        <div
          className={`chart-fill ${className}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "#f8fafc",
        padding: "14px",
        borderRadius: "14px",
      }}
    >
      <span
        style={{
          width: "14px",
          height: "14px",
          background: color,
          borderRadius: "50%",
        }}
      />
      <strong>{label}</strong>
    </div>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "Target Too High"
      ? { background: "#fee2e2", color: "#dc2626" }
      : status === "Target Reached"
      ? { background: "#dcfce7", color: "#16a34a" }
      : { background: "#dbeafe", color: "#2563eb" };

  return (
    <div
      style={{
        padding: "8px 12px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: "800",
        ...style,
      }}
    >
      {status || "On Track"}
    </div>
  );
}

function ForecastRow({ label, value }) {
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

function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours} hr ${minutes} min`;
  if (hours > 0) return `${hours} hr`;
  return `${minutes} min`;
}