import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
         <p className="hero-text">
 STUDY PLANNER AND GRADE FORECASTER.
</p>
         <span className="brand-highlight">
         Plan smarter. Study better. Forecast your academic progress with confidence.
         </span>
      

          <div className="feature-boxes">
            <div className="feature-box">
              <h3>Track courses easily</h3>
              <p>Add your courses and update your progress gradually.</p>
            </div>

            <div className="feature-box">
              <h3>Stay motivated</h3>
              <p>Build consistency with a planner designed for students.</p>
            </div>

            <div className="feature-box">
              <h3>Forecast outcomes</h3>
              <p>See what you need to achieve your target performance.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-logo">SP</div>

          <h2>Welcome back</h2>
          <p className="login-card-subtext">
            Login to continue your academic journey.
          </p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Enter your password"
                required
              />
              <div className="forgot-password">
  <Link to="/forgot-password">Forgot password?</Link>
</div>
            </div>
<button type="submit" disabled={loading} className="login-button">
  {loading ? (
    <span className="spinner"></span>
  ) : (
    "Login"
  )}
</button>
          </form>

          <p className="login-footer-text">
            No account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}