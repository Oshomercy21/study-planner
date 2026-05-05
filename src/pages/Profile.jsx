import { useEffect, useState } from "react";
import "./Profile.css";

export default function Profile() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [currentCGPA, setCurrentCGPA] = useState("");
  const [targetGPA, setTargetGPA] = useState("");
  const [semester, setSemester] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("studentProfile");

    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setName(profile.name || "");
      setDepartment(profile.department || "");
      setLevel(profile.level || "");
      setCurrentCGPA(profile.currentCGPA || "");
      setTargetGPA(profile.targetGPA || "");
      setSemester(profile.semester || "");
    }
  }, []);

  function handleSave(e) {
    e.preventDefault();
    setMessage("");

    setSaving(true);

    const profile = {
      name,
      department,
      level,
      currentCGPA,
      targetGPA,
      semester,
    };

    setTimeout(() => {
      localStorage.setItem("studentProfile", JSON.stringify(profile));
      setSaving(false);
      setMessage("Profile saved successfully.");
    }, 400);
  }

  return (
    <div className="app-page">
      <div className="app-header">
        <h1>Student Profile</h1>
        <p>
          Enter your academic details to personalize your planner and support
          your grade forecasting.
        </p>
      </div>

      {message && <div className="app-message app-message-success">{message}</div>}

      <div className="app-card">
        <form onSubmit={handleSave}>
          <div className="app-form-grid">
            <div className="app-form-group">
              <label>Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="app-form-group">
              <label>Department</label>
              <input value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>

            <div className="app-form-group">
              <label>Level</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="">Select level</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
              </select>
            </div>

            <div className="app-form-group">
              <label>Semester</label>
              <select value={semester} onChange={(e) => setSemester(e.target.value)}>
                <option value="">Select semester</option>
                <option>First Semester</option>
                <option>Second Semester</option>
              </select>
            </div>

            <div className="app-form-group">
              <label>Current CGPA</label>
              <input value={currentCGPA} onChange={(e) => setCurrentCGPA(e.target.value)} />
            </div>

            <div className="app-form-group">
              <label>Target GPA</label>
              <input value={targetGPA} onChange={(e) => setTargetGPA(e.target.value)} />
            </div>
          </div>

          <div className="app-actions">
            <button type="submit" className="app-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}