import { useEffect, useState } from "react";

export default function Courses() {
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseUnit, setCourseUnit] = useState("");
  const [targetScore, setTargetScore] = useState("");
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [caScore, setCaScore] = useState("");

  useEffect(() => {
    const savedCourses = localStorage.getItem("courses");
    if (savedCourses) setCourses(JSON.parse(savedCourses));
  }, []);

  function saveCourses(updatedCourses) {
    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
  }

  function handleAddCourse(e) {
    e.preventDefault();
    setMessage("");

    if (!courseCode || !courseTitle || !courseUnit || !targetScore) {
      setMessage("Please fill in all course details.");
      return;
    }

    const unit = Number(courseUnit);
    const target = Number(targetScore);

    if (unit <= 0) {
      setMessage("Course unit must be greater than 0.");
      return;
    }

    if (target < 0 || target > 100) {
      setMessage("Target score must be between 0 and 100.");
      return;
    }

    setSaving(true);

    const newCourse = {
      id: Date.now(),
      courseCode,
      courseTitle,
      courseUnit: unit,
      targetScore: target,
      caScore: null,
      currentTotal: 0,
      neededExamScore: target,
      status: target <= 70 ? "On Track" : "Target Too High",
    };

    setTimeout(() => {
      saveCourses([...courses, newCourse]);
      setCourseCode("");
      setCourseTitle("");
      setCourseUnit("");
      setTargetScore("");
      setSaving(false);
      setMessage("Course added successfully.");
    }, 300);
  }

  function handleDeleteCourse(id) {
    saveCourses(courses.filter((course) => course.id !== id));
    setEditingCourseId(null);
    setCaScore("");
    setMessage("Course removed successfully.");
  }

  function openUpdateForm(course) {
    setEditingCourseId(course.id);
    setCaScore(course.caScore ?? "");
    setMessage("");
  }

  function handleUpdateProgress(id) {
    setMessage("");

    const ca = caScore === "" ? null : Number(caScore);

    if (ca !== null && (ca < 0 || ca > 30)) {
      setMessage("CA score must be between 0 and 30.");
      return;
    }

    const updatedCourses = courses.map((course) => {
      if (course.id !== id) return course;

      const currentTotal = ca || 0;
      const neededExamScore = course.targetScore - currentTotal;

      let status = "Target Too High";
      if (neededExamScore <= 0) status = "Target Reached";
      else if (neededExamScore <= 70) status = "On Track";

      return {
        ...course,
        caScore: ca,
        currentTotal,
        neededExamScore,
        status,
      };
    });

    saveCourses(updatedCourses);
    setEditingCourseId(null);
    setCaScore("");
    setMessage("Course progress updated successfully.");
  }

  const totalUnits = courses.reduce(
    (sum, course) => sum + Number(course.courseUnit || 0),
    0
  );

  const onTrackCount = courses.filter(
    (course) => course.status === "On Track" || course.status === "Target Reached"
  ).length;

  return (
    <div className="app-page">
      <div className="app-header">
        <h1>Courses & Assessment</h1>
        <p>
          Add each course with your target score, then update your CA as the
          semester progresses. The system will forecast the exam score you need.
        </p>
      </div>

      {message && (
        <div
          className={`app-message ${
            message.toLowerCase().includes("success") ||
            message.toLowerCase().includes("updated") ||
            message.toLowerCase().includes("removed")
              ? "app-message-success"
              : "app-message-error"
          }`}
        >
          {message}
        </div>
      )}

      <div className="app-grid-2" style={{ marginBottom: "28px" }}>
        <div className="app-card">
          <h2 style={{ marginTop: 0, marginBottom: "18px" }}>Add New Course</h2>

          <form onSubmit={handleAddCourse}>
            <div className="app-form-grid">
              <div className="app-form-group">
                <label>Course Code</label>
                <input
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. CEN 507"
                  required
                />
              </div>

              <div className="app-form-group">
                <label>Course Title</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Software Engineering"
                  required
                />
              </div>

              <div className="app-form-group">
                <label>Course Unit</label>
                <input
                  type="number"
                  value={courseUnit}
                  onChange={(e) => setCourseUnit(e.target.value)}
                  placeholder="e.g. 3"
                  required
                />
              </div>

              <div className="app-form-group">
                <label>Target Score</label>
                <input
                  type="number"
                  value={targetScore}
                  onChange={(e) => setTargetScore(e.target.value)}
                  placeholder="e.g. 80"
                  required
                />
              </div>
            </div>

            <div className="app-actions">
              <button type="submit" className="app-btn" disabled={saving}>
                {saving ? "Adding..." : "Add Course"}
              </button>
            </div>
          </form>
        </div>

        <div className="app-card">
          <h2 style={{ marginTop: 0, marginBottom: "18px" }}>Quick Summary</h2>

          <div className="app-summary-grid">
            <div className="app-summary-item">
              <span>Total Courses</span>
              <strong>{courses.length}</strong>
            </div>

            <div className="app-summary-item">
              <span>Total Units</span>
              <strong>{totalUnits}</strong>
            </div>

            <div className="app-summary-item">
              <span>On Track</span>
              <strong>{onTrackCount}</strong>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: "18px", fontSize: "26px" }}>Your Courses</h2>

        {courses.length === 0 ? (
          <div className="app-empty">
            <p style={{ margin: 0 }}>No courses added yet.</p>
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

                  <div
                    style={{
                      background: "#dbeafe",
                      color: "#1d4ed8",
                      padding: "8px 12px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    {course.courseUnit} Unit{course.courseUnit > 1 ? "s" : ""}
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "16px",
                    padding: "16px",
                    marginBottom: "18px",
                  }}
                >
                  <Row label="Target Score" value={`${course.targetScore}/100`} />
                  <Row
                    label="CA Score"
                    value={
                      course.caScore != null ? `${course.caScore}/30` : "Not added"
                    }
                  />
                  <Row
                    label="Needed in Exam"
                    value={
                      course.neededExamScore <= 0
                        ? "0/70"
                        : `${course.neededExamScore}/70`
                    }
                  />
                  <Row
                    label="Status"
                    value={course.status}
                    strongStyle={{
                      color:
                        course.status === "Target Too High"
                          ? "#dc2626"
                          : course.status === "Target Reached"
                          ? "#16a34a"
                          : "#2563eb",
                    }}
                    topBorder
                  />
                </div>

                {editingCourseId === course.id && (
                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: "16px",
                      padding: "16px",
                      marginBottom: "18px",
                    }}
                  >
                    <h4 style={{ marginTop: 0, marginBottom: "14px", fontSize: "18px" }}>
                      Update Progress
                    </h4>

                    <div className="app-form-group">
                      <label>CA Score So Far (over 30)</label>
                      <input
                        type="number"
                        value={caScore}
                        onChange={(e) => setCaScore(e.target.value)}
                        placeholder="Enter CA score"
                      />
                    </div>

                    <div className="app-actions">
                      <button
                        type="button"
                        className="app-btn"
                        onClick={() => handleUpdateProgress(course.id)}
                      >
                        Save Progress
                      </button>

                      <button
                        type="button"
                        className="app-btn-secondary"
                        onClick={() => {
                          setEditingCourseId(null);
                          setCaScore("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="app-actions" style={{ marginTop: 0 }}>
                  <button
                    type="button"
                    className="app-btn"
                    onClick={() => openUpdateForm(course)}
                  >
                    Update Progress
                  </button>

                  <button
                    type="button"
                    className="app-btn-danger"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, strongStyle = {}, topBorder = false }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: topBorder ? "14px 0 0" : "8px 0",
        marginTop: topBorder ? "6px" : 0,
        borderTop: topBorder ? "1px solid #e2e8f0" : "none",
        color: "#334155",
        fontSize: "15px",
      }}
    >
      <span>{label}</span>
      <strong style={strongStyle}>{value}</strong>
    </div>
  );
}