import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <div>
          <p className="admin-badge">Admin Panel</p>
          <h1 className="admin-title">
            Welcome back, <span>{userName}</span> 👋
          </h1>
          <p className="admin-subtitle">
            You are logged in as <strong>ADMIN</strong>. Manage users, jobs,
            recruiters and applications from one place.
          </p>
        </div>

        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <h3>Total Users</h3>
          <p>120+</p>
          <span>Students and recruiters on portal</span>
        </div>

        <div className="admin-stat-card">
          <h3>Active Jobs</h3>
          <p>35+</p>
          <span>Jobs currently visible to students</span>
        </div>

        <div className="admin-stat-card">
          <h3>Applications</h3>
          <p>250+</p>
          <span>Track student applications easily</span>
        </div>

        <div className="admin-stat-card">
          <h3>Pending Recruiters</h3>
          <p>08</p>
          <span>Approval requests waiting for review</span>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="section-heading">Quick Actions</h2>

        <div className="admin-grid">
          <div className="admin-card">
            <div className="admin-icon">👥</div>
            <h3>Manage Users</h3>
            <p>
              View registered users, update details and manage access across the
              platform.
            </p>
            <button onClick={() => navigate("/admin/users")}>
              Open
            </button>
          </div>

          <div className="admin-card">
            <div className="admin-icon">💼</div>
            <h3>Manage Jobs</h3>
            <p>
              Add, edit and remove job postings to keep opportunities updated
              for students.
            </p>
            <button onClick={() => navigate("/admin/jobs")}>
  Open
</button>
          </div>

          <div className="admin-card">
            <div className="admin-icon">📄</div>
            <h3>View Applications</h3>
            <p>
              Check all job applications and monitor the progress of student
              submissions.
            </p>
            <button onClick={() => navigate("/admin/applications")}>
  Open
</button>
          </div>

          <div className="admin-card">
            <div className="admin-icon">✅</div>
            <h3>Recruiter Approvals</h3>
            <p>
              Review recruiter requests and approve verified recruiters for job
              posting access.
            </p>
            <button onClick={() => toast.info("Recruiter approvals next")}>
              Open
            </button>
          </div>
        </div>
      </div>

      <div className="admin-bottom">
        <div className="admin-note">
          <h3>Portal Overview</h3>
          <p>
            This admin dashboard helps you control the complete career portal in
            a simple and organized way. Later, you can connect it with backend
            APIs for live data and advanced management features.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;