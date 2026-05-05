import { useEffect, useState } from "react";

export default function Settings() {
  const [theme, setTheme] = useState("light");
  const [themeColor, setThemeColor] = useState("#334155");
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme") || "light";
    const savedColor = localStorage.getItem("themeColor") || "#334155";
    const savedReminder = localStorage.getItem("remindersEnabled") !== "false";

    setTheme(savedTheme);
    setThemeColor(savedColor);
    setRemindersEnabled(savedReminder);

    applyTheme(savedTheme, savedColor);
  }, []);

  function applyTheme(selectedTheme, selectedColor) {
    document.documentElement.setAttribute("data-theme", selectedTheme);
    document.documentElement.style.setProperty("--theme-color", selectedColor);
  }

  function saveSettings() {
    localStorage.setItem("appTheme", theme);
    localStorage.setItem("themeColor", themeColor);
    localStorage.setItem("remindersEnabled", remindersEnabled);

    applyTheme(theme, themeColor);
    setMessage("Settings saved successfully.");
  }

  function handleExportData() {
    const appData = {
      studentProfile: JSON.parse(localStorage.getItem("studentProfile")) || null,
      courses: JSON.parse(localStorage.getItem("courses")) || [],
      semesterStudyPlan: JSON.parse(localStorage.getItem("semesterStudyPlan")) || [],
      studyTasks: JSON.parse(localStorage.getItem("studyTasks")) || [],
      studyLogs: JSON.parse(localStorage.getItem("studyLogs")) || [],
      appTheme: localStorage.getItem("appTheme") || "light",
      themeColor: localStorage.getItem("themeColor") || "#334155",
      remindersEnabled: localStorage.getItem("remindersEnabled") !== "false",
    };

    const file = new Blob([JSON.stringify(appData, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "study-planner-backup.json";
    link.click();
  }

  function handleImportData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        const data = JSON.parse(event.target.result);

        localStorage.setItem("studentProfile", JSON.stringify(data.studentProfile || null));
        localStorage.setItem("courses", JSON.stringify(data.courses || []));
        localStorage.setItem("semesterStudyPlan", JSON.stringify(data.semesterStudyPlan || []));
        localStorage.setItem("studyTasks", JSON.stringify(data.studyTasks || []));
        localStorage.setItem("studyLogs", JSON.stringify(data.studyLogs || []));
        localStorage.setItem("appTheme", data.appTheme || "light");
        localStorage.setItem("themeColor", data.themeColor || "#334155");
        localStorage.setItem("remindersEnabled", data.remindersEnabled ?? true);

        alert("Backup imported successfully. Refresh the page.");
      } catch {
        alert("Invalid backup file.");
      }
    };

    reader.readAsText(file);
  }

  function resetAllData() {
    if (!window.confirm("Delete all saved data?")) return;

    localStorage.clear();
    setMessage("All data cleared.");
  }

  return (
    <div className="app-page">
      <div className="app-header">
        <h1>Settings</h1>
        <p>Manage your app preferences and data.</p>
      </div>

      {message && <div className="app-message app-message-success">{message}</div>}

      {/* Appearance */}
      <div className="app-card" style={{ marginBottom: "24px" }}>
        <h2>Appearance</h2>

        <div className="app-form-grid">
          <div className="app-form-group">
            <label>Theme</label>
            <select
              value={theme}
              onChange={(e) => {
                const newTheme = e.target.value;
                setTheme(newTheme);
                applyTheme(newTheme, themeColor);
              }}
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>

          <div className="app-form-group">
            <label>Theme Color</label>
            <input
              type="color"
              value={themeColor}
              onChange={(e) => {
                const newColor = e.target.value;
                setThemeColor(newColor);
                applyTheme(theme, newColor);
              }}
            />
          </div>
        </div>

        <div className="app-actions">
          <button className="app-btn" onClick={saveSettings}>
            Save Settings
          </button>
        </div>
      </div>

      {/* Reminder */}
      <div className="app-card" style={{ marginBottom: "24px" }}>
        <h2>Reminder Preference</h2>

        <label style={{ fontWeight: 700 }}>
          <input
            type="checkbox"
            checked={remindersEnabled}
            onChange={(e) => setRemindersEnabled(e.target.checked)}
            style={{ marginRight: "10px" }}
          />
          Enable study reminders
        </label>
      </div>

      {/* Backup */}
      <div className="app-card" style={{ marginBottom: "24px" }}>
        <h2>Backup & Restore</h2>

        <div className="app-actions">
          <button className="app-btn" onClick={handleExportData}>
            Export Backup
          </button>

          <label className="app-btn-secondary">
            Import Backup
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>

      {/* Reset */}
      <div className="app-card" style={{ marginBottom: "24px" }}>
        <h2>Reset Data</h2>

        <button className="app-btn-danger" onClick={resetAllData}>
          Clear All Data
        </button>
      </div>

      {/* Account */}
      <div className="app-card" style={{ marginBottom: "24px" }}>
        <h2>Account</h2>

        <button
          className="app-btn-secondary"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      {/* Privacy */}
      <div className="app-card">
        <h2>Privacy</h2>
        <p>
          Your data is stored locally on this device. It is not shared across devices unless exported.
        </p>
      </div>
    </div>
  );
}