import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ManageApplications.css";

function ManageApplications() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || "https://talentry-backend.onrender.com/";

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }

    if (role !== "admin") {
      toast.error("Access denied");
      navigate("/login");
      return;
    }

    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/admin/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch applications"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${BASE_URL}/api/admin/applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? res.data.application : app
        )
      );

      toast.success("Application status updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update application status"
      );
    }
  };

  const handleDelete = async (applicationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${BASE_URL}/api/admin/applications/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications((prev) =>
        prev.filter((app) => app._id !== applicationId)
      );

      toast.success("Application deleted successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete application"
      );
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const studentName = app.studentId?.name || "";
      const studentEmail = app.studentId?.email || "";
      const company = app.jobId?.company || "";
      const role = app.jobId?.role || "";
      const status = app.status || "";

      const matchesSearch =
        studentName.toLowerCase().includes(search.toLowerCase()) ||
        studentEmail.toLowerCase().includes(search.toLowerCase()) ||
        company.toLowerCase().includes(search.toLowerCase()) ||
        role.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ? true : status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  return (
    <div className="manage-applications-page">
      <div className="manage-applications-header">
        <div>
          <h1>📄 View Applications</h1>
          <p>Track student job applications and update their status.</p>
        </div>

        <button className="back-btn" onClick={() => navigate("/admin-dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>

      <div className="applications-toolbar">
        <div className="toolbar-item">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by student, email, company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-item">
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button
          className="clear-btn"
          onClick={() => {
            setSearch("");
            setStatusFilter("All");
          }}
        >
          Clear
        </button>
      </div>

      <div className="applications-summary">
        Showing <b>{filteredApplications.length}</b> applications
      </div>

      {loading ? (
        <div className="applications-empty">Loading applications...</div>
      ) : filteredApplications.length === 0 ? (
        <div className="applications-empty">No applications found.</div>
      ) : (
        <div className="applications-table-wrap">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Branch / Year</th>
                <th>Company</th>
                <th>Role</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app._id}>
                  <td>{app.studentId?.name || "N/A"}</td>
                  <td>{app.studentId?.email || "N/A"}</td>
                  <td>
                    {app.studentId?.branch || "N/A"} / {app.studentId?.year || "N/A"}
                  </td>
                  <td>{app.jobId?.company || "N/A"}</td>
                  <td>{app.jobId?.role || "N/A"}</td>
                  <td>
                    {app.appliedDate
                      ? new Date(app.appliedDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${(app.status || "")
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(app._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageApplications;