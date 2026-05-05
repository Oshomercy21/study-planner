export default function Dashboard() {
  return (
    <div className="app-page dashboard-page">
      <div className="app-header dashboard-header">
        <h1>Welcome Back</h1>
        <p>
          Welcome back. Every great result begins with a small, consistent effort.
          Plan with purpose, study with discipline, and let each day move you closer.
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="app-card">
          <h3>Courses & Assessment</h3>
          <p>Add courses and assessment weights.</p>
        </div>

        <div className="app-card">
          <h3>Study Planner</h3>
          <p>Plan your weekly study sessions.</p>
        </div>

        <div className="app-card">
          <h3>Grade Forecast</h3>
          <p>Forecast your grade using transparent weighting.</p>
        </div>
      </div>
    </div>
  );
}