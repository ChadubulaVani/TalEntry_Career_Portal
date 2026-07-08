import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Student");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");

    // If not logged in, go to login
    if (!token) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }

    setUserName(name || "Student");
    setUserRole(role || "");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    toast.success("Logged out ✅");
    navigate("/login");
  };

  return (
    <div className="dash-page">
      {/* Header */}
      <div className="dash-header">
        <div className="dash-welcome-box">
          {/* Logout inside welcome box */}
          <button className="dash-logout" onClick={handleLogout}>
            🚪 Logout
          </button>

          <h1 className="dash-title">
            Welcome back, <span className="dash-highlight">{userName}</span> 👋
          </h1>

          <p className="dash-subtitle">
            🎓 You are logged in as
            <span className="dash-role">{userRole?.toUpperCase()}</span>
            🚀 Ready to explore new opportunities and grow your career!
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="dash-grid">
        <div className="dash-card">
          <h3>Profile Completion</h3>
          <p className="dash-big">70%</p>
          <p className="dash-muted">
            Add skills & projects to improve visibility.
          </p>
        </div>

        <div className="dash-card">
          <h3>Applications</h3>
          <p className="dash-big">4</p>
          <p className="dash-muted">You have applied to 4 opportunities.</p>
        </div>

        <div className="dash-card">
          <h3>Upcoming Tasks</h3>
          <p className="dash-big">2</p>
          <p className="dash-muted">Resume update + Mock interview.</p>
        </div>

        <div className="dash-card">
          <h3>Notifications</h3>
          <p className="dash-big">3</p>
          <p className="dash-muted">New jobs and campus updates.</p>
        </div>
      </div>

      {/* Quick Actions + Recent */}
      <div className="dash-sections">
        <div className="dash-panel">
          <h2>Quick Actions</h2>

          <div className="dash-actions">
            <button className="dash-btn" onClick={() => navigate("/profile")}>
              Update Profile
            </button>

            <button className="dash-btn" onClick={() => navigate("/jobs")}>
              View Jobs
            </button>

            <button className="dash-btn" onClick={() => navigate("/resume")}>
              Build Resume
            </button>

            <button
              className="dash-btn"
              onClick={() => navigate("/interview-prep")}
            >
              Interview Prep
            </button>

            <button
              className="dash-btn"
              onClick={() => navigate("/applications")}
            >
              My Applications
            </button>
          </div>
        </div>

        <div className="dash-panel">
          <h2>Recent Activity</h2>

          <ul className="dash-list">
            <li>
              <span className="dot"></span>
              You updated your email and password.
              <span className="time"> • 1 day ago</span>
            </li>
            <li>
              <span className="dot"></span>
              You applied to “Frontend Intern”.
              <span className="time"> • 3 days ago</span>
            </li>
            <li>
              <span className="dot"></span>
              New recruiter message received.
              <span className="time"> • 5 days ago</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
